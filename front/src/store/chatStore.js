import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set,get)=>({
    users: [],
    usersLoading: false,
    selectedUser: null,

    getUsers: async()=>{
        try {
            const res = await axiosInstance.get("/chat/users");
            set({users:res.data});
        } catch(err){
            console.error("getUsers error: ", err);
        }
    },
    
    setSelectedUser: (user) => set({selectedUser:user}),
}));
export default useChatStore;