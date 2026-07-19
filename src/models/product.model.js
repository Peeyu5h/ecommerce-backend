import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    rating: {
        type: Number,
        required: false,
        default: 0
    },
    reviewCount: {
        type: Number,
        required: false,
        default: 0
    },
    stock: {
        type: Number,
        min: 0,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
},
    { timestamps: true },
    { strictPopulate: false}
);

const Product = mongoose.model('Product', productSchema);

export default Product;