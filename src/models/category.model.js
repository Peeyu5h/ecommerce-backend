import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },
    description: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;