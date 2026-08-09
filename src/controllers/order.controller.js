import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Order from "../models/orders.js";

export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Get logged-in user
        const userId = req.user._id;

        // 2. Fetch user's cart
        const cart = await Cart.findOne({ userId })
            .populate("items.product")
            .session(session);

        // 3. Check if cart exists / is empty
        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Your cart is empty."
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        // Validate products, stock and calculate total
        for (const item of cart.items) {

            const product = item.product;

            // Product doesn't exist anymore
            if (!product) {
                await session.abortTransaction();

                return res.status(400).json({
                    message: "One or more products in your cart no longer exist."
                });
            }

            // Validate quantity
            if (!item.quantity || item.quantity <= 0) {
                await session.abortTransaction();

                return res.status(400).json({
                    message: `Invalid quantity for ${product.name}.`
                });
            }
            
            // Stock validation
            if (product.stock < item.quantity) {
                await session.abortTransaction();

                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}.`
                });
            }

            // Calculate total using BACKEND product price
            const itemTotal = product.price * item.quantity;

            totalAmount += itemTotal;

            // Store product snapshot in order
            orderItems.push({
                product: product._id,
                name: product.name,
                priceAtPurchase: product.price,
                quantity: item.quantity,
                images: product.images[0],
                itemTotal
            });
        }

        // 8. Create order
        const [createdOrder] = await Order.create(
            [{
                userId,
                items: orderItems,
                totalAmount,
                status: "pending"
            }],
            { session }
        );

        // 9. Reduce stock
        for (const item of cart.items) {
            const productId = item.product._id;

            const updatedProduct = await Product.findOneAndUpdate(
                { _id: productId,  stock: { $gte: item.quantity }  },
                { $inc: { stock: -item.quantity } },
                { returnDocument: 'after',  session }
            );

            // Important: another request may have purchased
            // the stock between validation and update.
            if (!updatedProduct) {
                throw new Error(
                    `Stock changed for ${item.product.name}. Please try again.`
                );
            }
        }
        
        // 10. Delete user's cart
        await Cart.deleteOne(
            { userId },
            { session }
        );
        
        // Commit everything
        await session.commitTransaction();

        // 11. Return created order
        return res.status(201).json({
            message: "Order created successfully.",
            order: createdOrder
        });

    } catch (error) {

        await session.abortTransaction();
        return res.status(500).json({
            message: "Failed to create order.",
            error: error.message
        });

    } finally {
        session.endSession();
    }
};