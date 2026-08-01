import mongoose from "mongoose";

const wishListItemSchema = new mongoose.Schema({
    product : {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }
});

const wishListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true,
        unique: true
    },
    items: [wishListItemSchema],
 }, 
    {  
        timestamps: true, 
        strictPopulate: false 
    }, 
);

 const WishList = mongoose.model('WishList', wishListSchema);

 export default WishList;