import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

// Signup
export const signup = async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);

        const newUser = new User({
            name,
            email,
            password: hash,
            profilePicture: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${name}`
        });

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            return res.status(201).json({message: "User created successfully", user:newUser});
        } else {
            return res.status(500).json({message: "Failed to create user"});
        }
    } catch (err){
        console.error("signup -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
}
// Signin
export const signin = async(req,res)=>{
    const {email,password} = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = await User.findOne({email}).lean();
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }

        const match = await bcrypt.compare(password,user.password);
        if(match){
            generateToken(user._id,res);
            return res.status(200).json({message: "User signed in successfully", user});
        } else {
            return res.status(400).json({message: "Invalid credentials"});
        }
    } catch (err){
        console.error("signin -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
}
// Logout
export const logout = async(req,res)=>{
    try{
        console.log("test");
        res.clearCookie('tkn', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
        });
        console.log(req.cookies);
        return res.status(200).json({message: "Logged out successfully"});
    } catch(err){
        console.error("logout -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
} 
// CheckAuth
export const checkAuth = (req,res) => {
    try{
        return res.status(200).json(req.user);
    } catch(err){
        console.error("checkAuth -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
}