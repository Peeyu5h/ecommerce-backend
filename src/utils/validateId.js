import mongoose from "mongoose";

export const validateId = (id) => {

    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({
            error: 'The id provided is invalid'
        });
    }
    return true;
};

