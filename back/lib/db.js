import mongoose from "mongoose";

export default async function db() {
    try {
        await mongoose.connect(process.env.MONGO_URL,{dbName:process.env.DB_NAME});
        console.log("DB connected");
    } catch (error) {
        console.error("DB error: ", error);
    }
}