import express from 'express';
import dotenv from 'dotenv';


dotenv.config();
const app = express();


// Routes
app.get('/', (req, res) => {
    res.send('<h1>Server is running</h1>');
});

const serverStart = async() => {
    try {
        // await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("serverStart -> error", error);
    }
}
serverStart();