import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product : {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity : {
        type: Number,
        required: true,
        min: [1, 'Qunatity can not be less than 1.']
    }
}, { strictPopulate: false });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true,
        unique: true
    },
    items: [cartItemSchema],

    // billsTotal: {
    //     type: Number,
    //     required: true,
    //     default: 0
    // }
 }, 
    {  timestamps: true }, 
    { strictPopulate: false});

 const Cart = mongoose.model('Cart', cartSchema);

 export default Cart;