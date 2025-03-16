import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { io, usersSocket } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

// Get users
export const getUsers = async(req,res) => {
    try {
        const currentUser = req.user._id;
        const users = await User.find({ _id: { $ne: currentUser } },{
            // _id:0,
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
// Send Message
export const sendMessage = async(req,res) => {
    const {msg,to}=req.body;
    try{
        const receiver = await User.findOne({email:to});
        if(!receiver){
            return res.status(404).json({message: "User not found"});
        }

        const message = new Message({
            from: req.user._id,
            to: receiver._id,
            text: msg.text
        });
        if(msg.image){
            const res = await cloudinary.uploader.upload(msg.image,{
                upload_preset: process.env.COUD_PRESET
            });
            message.image = res.secure_url;
        }
        await message.save();
        const receiverSocket = usersSocket.get(receiver._id.toString());
        if(receiverSocket){
            io.to(receiverSocket).emit("newMessage",message);
        }
        return res.status(200).json({
            ...message.toObject(),
            from: {
                name: req.user.name,
                email: req.user.email,
                profilePicture: req.user.profilePicture
            },
            to: {
                name: receiver.name,
                email: receiver.email,
                profilePicture: receiver.profilePicture
            }
        });
    } catch(err){
        console.error("sendMessage -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
}
// Messages
export const messages = async(req,res)=>{
    const {email} = req.params;
    try{
        const receiver = await User.findOne({email});
        if(!receiver){
            return res.status(404).json({message: "User not found"});
        }
        let messages = await Message.find({
            $or: [
            { from: req.user._id, to: receiver._id },
            { from: receiver._id, to: req.user._id }
            ]
        })
        .populate("from","name email profilePicture")
        .populate("to","name email profilePicture")
        .sort({createdAt:1});
        messages = messages.map(message => {
            const messageObj = message.toObject();
            delete messageObj.from._id;
            delete messageObj.to._id;
            return messageObj;
        });
        return res.status(200).json(messages);
    } catch(err){
        console.error("messages -> err", err);
        return res.status(500).json({message: "Internal server error"});
    }
}