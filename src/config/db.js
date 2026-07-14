import mongoose  from "mongoose";

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo DB connected successfully! ")
    } catch (error) {
        console.error("Mongo DB connection failed! ");
        console.error(error.message);

        process.exit();
    }
    
};

export default connectDB;