import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    priceAtPurchase: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        type: [String],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    itemTotal: {
        type: Number,
        required: true
    }
    
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
        required: true        
    }
},
{  
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;