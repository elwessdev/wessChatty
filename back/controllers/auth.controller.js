import bcrypt from "bcrypt";
import User from "../models/user.model.js";
// import { generateToken } from "../lib/utils.js";
import jwt from 'jsonwebtoken';

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
        const refresh_token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: "7d"}
        );
        const access_token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_ACCESS_SECRET,
            {expiresIn: "15m"}
        );
        newUser.refreshToken = refresh_token;
        await newUser.save();

        res.cookie("tkn",refresh_token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json({
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            },
            access_token
        });
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
        if(!match){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const refresh_token = jwt.sign(
            {id: user._id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: "7d"}
        );
        const access_token = jwt.sign(
            {id: user._id},
            process.env.JWT_ACCESS_SECRET,
            {expiresIn: "15m"}
        );
        user.refreshToken = refresh_token;
        await User.findByIdAndUpdate(user._id,{refreshToken: refresh_token});

        res.cookie("tkn",refresh_token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            },
            access_token
        });

    } catch (err){
        console.error("signin -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
}
// Refresh Token
export const refreshToken = async(req,res) => {
    const refreshToken = req.cookies.tkn;
    if (!refreshToken){
        return res.status(401).json({ message: 'No refresh token' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user){
            return res.status(401).json({ message: 'User not found' });
        }
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        );
        return res.status(200).json({ accessToken });
    } catch (err){
        console.error("refreshtoken -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
}
// Me
export const getMe = async(req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user){
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (err){
        console.error("getMe -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
}
// Logout
export const logout = async(req,res)=>{
    try {
        const refreshToken = req.cookies.tkn;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }
        res.clearCookie('tkn');
        res.json({ message: 'Logged out' });
    } catch (err){
        console.error("logout -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
} 