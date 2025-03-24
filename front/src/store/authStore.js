import {create} from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import io from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;

const useAuthStore = create((set,get)=>({
    user: null,
    accessToken: null,
    // checkAuth: true,
    signinLoading: false,
    signupLoading: false,
    updateProfileLoading: false,
    checkAuthLoading: true,
    onlineUsers: [],
    socketUser: null,

    signup: async (data)=>{
        set({signupLoading:true});
        try{
            const res = await axiosInstance.post("/auth/signup", data);
            console.log(res);
            set({user:res.data.user});
            set({accessToken:res.data.access_token});
            set({signupLoading:false});
            get().connectSocket();
            toast.success("Account created successfully");
        } catch (error) {
            console.error("Signup error: ", error);
            toast.error(error.response.data.message);
        } finally {
            set({signupLoading:false});
        }
    },

    signin: async(data)=>{
        set({signinLoading:true});
        try{
            const res = await axiosInstance.post("/auth/signin", data);
            set({user:res.data.user});
            set({accessToken:res.data.access_token});
            get().connectSocket();
            toast.success("Logged in successfully");
        } catch(err){
            console.error("Signin error: ", err);
            toast.error(err.response.data.message);
        } finally {
            set({signinLoading:false});
        }
    },

    logout: async()=>{
        try{
            await axiosInstance.get("/auth/logout");
            set({user:null});
            set({accessToken:null});
            get().disconnectSocket();
            toast.success("Logged out successfully");
        } catch(err){
            console.error("Logout error: ", err);
            toast.error(err.response.data.message);
        }
    },

    getMe: async()=>{
        try {
            const res = await axiosInstance.get("/auth/me",{
                headers: {
                    Authorization: `Bearer ${get().accessToken}`
                }
            });
            set({user:res.data});
            get().connectSocket();
        } catch (error) {
            console.error("CheckAuth error: ", error);
            set({user:null});
        } finally {
            set({checkAuthLoading:false});
        }
    },

    refreshToken: async()=>{
        try {
            const res = await axiosInstance.post("/auth/refresh");
            set({accessToken:res.data.accessToken});
            get().getMe();
        } catch (error) {
            console.error("RefreshToken error: ", error);
        } finally {
            set({checkAuthLoading:false});
        }
    },

    connectSocket: ()=>{
        if(!get().user || get().socketUser?.connected) return;
        const socket = io(BASE_URL,{
            query: {
                user_id: get().user._id
            }
        });
        socket.connect();
        set({socketUser:socket});
        socket.on("getOnlineUsers",(data)=>{
            // console.log(data);
            set({onlineUsers:data});
        })
    },

    disconnectSocket: () => {
        if(get().socketUser.connected){
            get().socketUser.disconnect();
        }
    }
}));
export default useAuthStore;