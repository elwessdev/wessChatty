import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";

import connectDB from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import chatRoutes from './routes/chat.route.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5174"],
    credentials: true
}));


// Routes
app.get('/', (req, res) => {
    res.send('<h1>Server is running</h1>');
});
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes)


// Start server
const serverStart = async() => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("serverStart -> error", error);
    }
}
serverStart();