import mongoose from "mongoose";

const userReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        userName: {
            type: String,
            required: true
        },

        userImageUrl: {
            type: String
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        comment: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// One user can review a product only once
userReviewSchema.index(
    { user: 1, product: 1 },
    { unique: true }
);

const UserReview = mongoose.model("UserReview", userReviewSchema);

export default UserReview;