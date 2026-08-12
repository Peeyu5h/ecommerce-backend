import mongoose from "mongoose";
import UserReview from "../models/user-review.model.js";
import Product from "../models/product.model.js";

export const createReview = async (req, res) => {
    try {
        const user = req.user;
        const productId = req.params.id;
        const { title, comment, rating } = req.body;

        // 1. Validate productId
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        // 2. Validate required fields
        if (!title?.trim() || !comment?.trim() || rating === undefined) {
            return res.status(400).json({
                message: "Title, comment and rating are required"
            });
        }

        // 3. Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        // 4. Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // 5. Check if user already reviewed this product
        const existingReview = await UserReview.findOne({
            user: user._id,
            product: productId
        });

        if (existingReview) {
            return res.status(409).json({
                message: "You have already reviewed this product"
            });
        }

        // 6. Create review
        const review = await UserReview.create({
            user: user._id,
            product: productId,
            userName: user.name,
            userImageUrl: user.imageUrl,
            title: title.trim(),
            comment: comment.trim(),
            rating
        });

        // 7. Return created review
        return res.status(201).json({
            message: "Review added successfully",
            review
        });

    } catch (error) {

        // Handle duplicate review race condition
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already reviewed this product"
            });
        }

        console.error("Create review error:", error);

        return res.status(500).json({
            message: "Failed to create review"
        });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;

        // 1. Validate productId
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                message: "Invalid product id"
            });
        }

        // 2. Fetch reviews
        const reviews = await UserReview.find({
            product: productId
        })
            .sort({ createdAt: -1 }).select("-user -__v -updatedAt");

        // 3. Calculate total reviews
        const totalReviews = reviews.length;

        // 4. Calculate average rating
        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        const averageRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

        // 5. Calculate rating distribution
        const ratingDistribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        reviews.forEach((review) => {
            ratingDistribution[review.rating]++;
        });

        // 6. Return response
        return res.status(200).json({
            message: "Reviews fetched successfully",
            averageRating,
            totalReviews,
            ratingDistribution,
            reviews
        });

    } catch (error) {
        console.error("Get product reviews error:", error);

        return res.status(500).json({
            message: "Failed to fetch reviews"
        });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { title, comment, rating } = req.body;
        const userId = req.user._id;
        
        // Find review belonging to logged-in user
        const review = await UserReview.findOne({
            _id: reviewId,
            user: userId
        }).select("-user -__v -updatedAt");

        if (!review) {
            return res.status(404).json({
                message: "Review not found or you are not authorized to update it."
            });
        }

        // Validate rating if provided
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    message: "Rating must be between 1 and 5."
                });
            }

            review.rating = rating;
        }

        // Update only fields that were provided
        if (title !== undefined) {
            review.title = title;
        }

        if (comment !== undefined) {
            review.comment = comment;
        }

        const updatedReview = await review.save();

        return res.status(200).json({
            message: "Review updated successfully.",
            review: updatedReview
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const deletedReview = await UserReview.findOneAndDelete({
            _id: reviewId,
            user: req.user._id
        });

        if (!deletedReview) {
            return res.status(404).json({
                message: "Review not found or you are not authorized to delete it."
            });
        }

        return res.status(200).json({
            message: "Review deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};