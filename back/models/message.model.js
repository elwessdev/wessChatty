import mongoose from "mongoose";

export default mongoose.model("message", new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        text: String,
        image: String
    },{ timestamps: true }
))