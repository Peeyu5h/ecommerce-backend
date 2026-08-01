import mongoose from "mongoose";
import WishList from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

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