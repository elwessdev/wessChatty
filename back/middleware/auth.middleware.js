import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const checkAuthMiddle = async(req,res,next) => {
    try {
        const token = req.cookies.tkn;
        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized"});
        }
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message: "user not found"});
        }
        req.user = user;
        next();
    } catch(err){
        console.error("checkAuth -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
}