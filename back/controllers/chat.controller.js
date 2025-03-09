import User from "../models/user.model.js";

// Get users
export const getUsers = async(req,res) => {
    try {
        const currentUser = req.user._id;
        const users = await User.find({ _id: { $ne: currentUser } },{
            email:1,
            name:1,
            profilePicture:1
        })
        return res.status(200).json(users)
    } catch(err){
        console.error("users -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
} 