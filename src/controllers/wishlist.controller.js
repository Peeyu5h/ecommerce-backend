import mongoose from "mongoose";
import WishList from "../models/wishlist.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

export const addToWishList = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId= req.body.productId;

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({
                error: 'The id provided is invalid'
            });
        }

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                error: 'Product with id does not exists'
            });
        }

        const checkWishlist = await WishList.findOne({userId, "items.product": productId})
                .populate('items.product', '-__v -createdAt -updatedAt -category')
                .select('-__v -createdAt -updatedAt -userId');
        
        if(checkWishlist){
            return res.status(200).json({
                message: `Wishlist already contains this product.`,
                wishList: checkWishlist
            });
        }

        const newWishList = await WishList.findOneAndUpdate( 
            { userId },
            { $push: { items: [{ product: productId }] } },
            { upsert: true, returnDocument: "after"})
            .populate('items.product', '-__v -createdAt -updatedAt -category')
            .select('-__v -createdAt -updatedAt -userId');

        return res.status(201).json({
            message: `Wislist created successfully!`,
            wishList: newWishList
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
} 

export const getWishListItems = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishListItems = await WishList.findOne({userId}).populate('items.product', '-__v -createdAt -updatedAt -category');

        res.status(200).json({
            message: `WishList product reveived successfully! Total: ${wishListItems?.items.length ?? 0}`,
            wishList: wishListItems?.items || []
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        }); 
    }
}

export const removeWishListItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.id;

        const removedWishListItem = await WishList.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId } } },
            { returnDocument: "after" }
        ).populate('items.product', '-__v -createdAt -updatedAt -category').select('-__v -createdAt -updatedAt -userId');

        if(!removedWishListItem){
            return res.status(404).json({
                message: `Item with ID ${productId} not found.`,
            });
        }
        if(removedWishListItem.items.length === 0){
            await WishList.findOneAndDelete({userId});
        }

        res.status(200).json({
            message: "WishList Item removed successfully!",
            wishList: removedWishListItem
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const deleteWishList = async (req, res) => {
    try {
        const deletedWishList = await WishList.findOneAndDelete({ userId: req.user._id});

        if(!deletedWishList) {
            return res.status(404).json({
                message: "WishList not deleted."
            });
        }

        res.status(200).json({
            message: "All WishList Items deleted successfully!",
            deletedWishList
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const moveAllToCart = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get wishlist with product details
        const wishlist = await WishList.findOne({ userId })
            .populate("items.product");

        if (!wishlist || wishlist.items.length === 0) {
            return res.status(404).json({
                message: "Wishlist is empty."
            });
        }

        // Get cart (or create an empty object for checking)
        let cart = await Cart.findOne({ userId });

        const existingProductIds = new Set(
            (cart?.items || []).map(item => item.product.toString())
        );

        const itemsToAdd = [];
        const remainingWishlistItems = [];

        for (const item of wishlist.items) {

            const product = item.product;

            // Product deleted
            if (!product) {
                continue;
            }

            // Skip out of stock products
            if (product.stock <= 0) {
                remainingWishlistItems.push(item);
                continue;
            }

            // Skip if already exists in cart
            if (existingProductIds.has(product._id.toString())) {
                remainingWishlistItems.push(item);
                continue;
            }

            itemsToAdd.push({
                product: product._id,
                quantity: 1
            });

            existingProductIds.add(product._id.toString());
        }

        // Add all new products in a single update
        if (itemsToAdd.length > 0) {
            cart = await Cart.findOneAndUpdate(
                { userId },
                { $push: { items: { $each: itemsToAdd } } },
                { upsert: true, returnDocument: 'after' }
            ).populate("items.product", '-__v -createdAt -updatedAt -category');
        } else if (!cart) {
            cart = await Cart.findOne({ userId }).populate("items.product", '-__v -createdAt -updatedAt -category');
        } else {
            await cart.populate("items.product", '-__v -createdAt -updatedAt -category');
        }

        // Keep only items that weren't moved
        wishlist.items = remainingWishlistItems;
        await wishlist.save();

        await wishlist.populate("items.product", "-__v -createdAt -updatedAt -category");

        return res.status(200).json({
            message: `${itemsToAdd.length} item(s) moved to cart.`,
            cartItems: cart?.items ?? [],
            wishlist: wishlist.items
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}