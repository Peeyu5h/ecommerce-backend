import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {

        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            });
        }  
        
        const existingUser = await User.findOne({ email });
        
        if(existingUser){
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const user = await User.create({
            name,
            password,
            email
        });


        return res.status(201).json({
            message: "User registered successfully! ",
            user: {
                id : user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "All the feilds are required."
            });
        }

        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(404).json({
                message: "No user account found with this email address."
            });
        }

        const isMatch = await existingUser.comparePassword(password);

        if(!isMatch) return res.status(401).json({ message: "Invalid email or password"});

        const payload = {
            id: existingUser._id
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        
        return res.status(200).json({
            message: "Authentication successful!.",
            token: token,
            payload
        });


    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }   
}