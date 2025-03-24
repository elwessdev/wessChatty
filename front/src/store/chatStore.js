import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import useAuthStore from "./authStore";

const useChatStore = create((set,get)=>({
    users: [],
    usersLoading: false,
    selectedUser: null,
    messages: [],
    messagesLoading: false,

    // Get User
    getUsers: async()=>{
        set({usersLoading:true});
        try {
            const res = await axiosInstance.get("/chat/users",{
                headers:{
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`
                }
            });
            set({users:res.data});
        } catch(err){
            console.error("getUsers error: ", err);
        } finally{
            setTimeout(()=>set({usersLoading:false}),300);
        }
    },
    
    // Set Selected User
    setSelectedUser: (user) => set({selectedUser:user}),

    // Send Message
    sendMessage: async(msg)=>{
        try {
            const res = await axiosInstance.post("/chat/send",
                {
                    msg,
                    to: get().selectedUser.email
                }, 
                {
                    headers:{
                        Authorization: `Bearer ${useAuthStore.getState().accessToken}`
                    }
                }
            );
            set({messages:[...get().messages, res.data]});
        } catch(err){
            toast.error(err.response.data.message);
            console.error("sendMessage error: ", err);
        }
    }, 

    // Get Messages
    getMessages: async(user_email)=>{
        set({messagesLoading:true});
        try{
            const res = await axiosInstance.get(`/chat/messages/${user_email}`,{
                headers:{
                    Authorization: `Bearer ${useAuthStore.getState().accessToken}`
                }
            });
            set({messages:res.data});
        } catch(err){
            console.error("getMessages error: ", err);
            toast.error(err.response.data.message);
        } finally {
            setTimeout(()=>set({messagesLoading:false}),300)
        }
    },
    
    // Track New Message
    trackNewMessage: () => {
        if(!get().selectedUser) return;
        const socket = useAuthStore.getState().socketUser;
        socket.on("newMessage",(msg)=>{
            if(msg.from===get().selectedUser._id){
                set({messages:[...get().messages,msg]});
                // console.log(get().messages);
            }
        })
    },
    closeTrackNewMessage: () => {
        const socket = useAuthStore.getState().socketUser;
        socket.off("newMessage");
    }
}));
export default useChatStore;