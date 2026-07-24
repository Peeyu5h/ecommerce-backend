import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({
                error: 'The id provided is invalid'
            });
        }

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                error: 'Product with this id not exists'
            });
        }

        if(product.stock < quantity){
            return res.status(400).json({ error: "Requested quantity exceeds available stock"})
        }

        const cart = await Cart.findOneAndUpdate(
            { userId, "items.product": productId},
            { $inc: { "items.$.quantity": quantity } },
            { returnDocument: "after" }
        ).populate("items.product");

        if(cart){
            return res.status(200).json({
                message: `Cart updated successfully!`,
                cartList: cart
            });
        }

        const newItem = await Cart.findOneAndUpdate(
            { userId },
            { $push: { items : { product : productId, quantity } } },
            { upsert: true, returnDocument: "after" }
        );

        return res.status(201).json({
            message: `${quantity} Item added to cart successfully!`,
            cartList: newItem
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
} 

export const getCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const cartItems = await Cart.findOne({userId}).populate('items.product');

        res.status(200).json({
            message: `Cart product reveived successfully! Total: ${cartItems?.items.length ?? 0}`,
            cartItems: cartItems?.items || []
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        }); 
    }
}

export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const cartItemId = req.params.id;

        const removedCartItem = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { _id: cartItemId } } },
            { returnDocument: "after" }
        );

        if(!removedCartItem){
            if(removedCartItem.items.length === 0){
                await Cart.findOneAndDelete({userId});
            }

            return res.status(404).json({
                message: `Item with ID ${cartItemId} not found.`,
            });
        }
        res.status(200).json({
            message: "Cart Item removed successfully!",
            removedCartItem
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export const deleteCartItems = async (req, res) => {
    try {
        const deletedCart = await Cart.findOneAndDelete({ userId: req.user._id});

        if(!deletedCart) {
            return res.status(404).json({
                message: "Cart Items not deleted."
            });
        }

        res.status(200).json({
            message: "All Cart Items deleted successfully!",
            deletedCart
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const updateCartItems = async(req, res) => {
    try {
        const cartItemId = req.params.id;
        const { quantity, productId } = req.body;
        const userId = req.user._id;

        if(!mongoose.isValidObjectId(cartItemId) || !mongoose.isValidObjectId(productId)){
            return res.status(400).json({
                error: 'The id provided is invalid'
            });
        }

        if(quantity < 1) return res.status(400).json({ error: "Quantity must be greater then 0"});

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                error: 'Product with this id not exists'
            });
        }

        if(product.stock < quantity){
            return res.status(400).json({ error: "Item is out of stock"})
        }
        
        const updatedCart = await Cart.findOneAndUpdate(
            { userId, "items._id": cartItemId },
            { $set: { "items.$.quantity": quantity } },
            { returnDocument : "after" }
        ).populate("items.product");

        if(!updatedCart){
            return res.status(404).json({
                error: 'Cart Item update Failed, Id not found!'
            });
        }

        res.status(200).json({
            message: "Cart Item updateed successfully!",
            updatedCart
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}