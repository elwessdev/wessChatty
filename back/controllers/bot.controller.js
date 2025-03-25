import User from '../models/user.model.js';
import openRouter from '../lib/ai.js';

// Get history
export const getHistory = async (req,res) => {
    try {
        const userID = req.user.id;
        const history = await User.findById(userID).lean();

        return res.status(200).json(history.bot);
    } catch (error) {
        console.error("getHistory -> error", error);
        return res.status(500).json({message: "Internal server error"});
    }
}
// Response
export const response = async (req,res) => {
    try {
        const userID = req.user.id;
        const {prompt} = req.body;

        const history = await User.findById(userID);
        if(history.bot.length === 0) {
            history.bot.push({
                role: "system",
                content:"You are a chatbot for the site wessChatty. and your name chattyAI. Assist users with their queries."
            });
        }
        history.bot.push({ role: "user", content: prompt });
        const completion = await openRouter.chat.completions.create({
            model: "google/gemini-2.0-flash-lite-preview-02-05:free",
            messages: history.bot,
        });
        const aiResponse = completion.choices[0].message.content;
        // console.log(completion.choices[0].message)
        if(aiResponse.length === 0) {
            return res.status(200).json("Something went wrong. Please ask me again.");
        }
        history.bot.push({ role: "assistant", content: aiResponse });
        await history.save();
        return res.status(200).json(aiResponse);
    } catch (error) {
        console.error("response -> error", error);
        return res.status(500).json({message: "Internal server error"});
    }
}