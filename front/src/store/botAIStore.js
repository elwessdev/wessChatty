import {create} from 'zustand';

export const useBotAIStore = create((set,get) => ({
    messages: [
        {
            from: "bot",
            text: "I am a bot, I can help you with your queries.",
            createdAt: new Date(),
        },
        {
            from: "user",
            text: "thanks",
            createdAt: new Date(),
        }
    ],
    
    sendMessage: (prompt) => {
        set(...get().messages, {
            from: "user",
            text: prompt,
            createdAt: new Date(),
        });
    }
}));