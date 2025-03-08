import mongoose from "mongoose";

export default async function db() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB error: ", error);
    }
}