import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({ message: "Access token missing"});
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedPayload) => {
        if(err) {
            return res.status(403).json({message: "Invalid or expired token"});
        }

        const existingUser = await User.findById(decodedPayload.id).select("-password -__v");

        if(!existingUser){
            return res.status(401).json({
                message: "User with the auth token not present in DB"
            });
        }
        req.user = existingUser;
        next();
    })
}

export default authMiddleware;
