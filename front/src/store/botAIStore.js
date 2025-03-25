import {create} from 'zustand';
import axiosInstance from '../lib/axios';
import useAuthStore from "./authStore";

export const useBotAIStore = create((set,get) => ({
    messages: [],
    messageLoading: false,
    botThinking: false,
    
    sendMessage: async(prompt) => {
        set({messages: [...get().messages, {role: "user", content: prompt, createdAt: new Date()}]});
        set({botThinking: true});
        try {
            const response = await axiosInstance.post("/bot", {prompt}, {
                headers: {
                    authorization: `Bearer ${useAuthStore.getState().accessToken}`,
                }
            });
            set({messages: [...get().messages, {role: "assistant", content: response.data, createdAt: new Date()}]});
            // console.log("sendMessage -> response", response);
        } catch (error) {
            console.error("sendMessage -> error", error);
        } finally {
            set({botThinking: false});
        }
    },

    getHistory: async() => {
        set({messageLoading: true});
        try {
            const response = await axiosInstance.get("/bot", {
                headers: {
                    authorization: `Bearer ${useAuthStore.getState().accessToken}`,
                }
            });
            set({messages: response.data});
        } catch(err){
            console.error("getHistory -> err", err);
        } finally {
            set({messageLoading: false});
        }
    }
}));