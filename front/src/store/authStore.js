import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useAuthStore = create((set,get)=>({
    user: null,
    // checkAuth: true,
    signinLoading: false,
    signupLoading: false,
    updateProfileLoading: false,
    checkAuthLoading: true,
    onlineUsers: [],
    socket: null,

    signup: async (data)=>{
        set({signupLoading:true});
        try{
            const res = await axiosInstance.post("/auth/signup", data);
            console.log(res);
            set({user:res.data.user});
            set({signupLoading:false});
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
            toast.success("Logged out successfully");
        } catch(err){
            console.error("Logout error: ", err);
            toast.error(err.response.data.message);
        }
    },

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/checkauth");
            set({user:res.data});
        } catch (error) {
            console.error("CheckAuth error: ", error);
            set({user:null});
        } finally {
            set({checkAuthLoading:false});
        }
    }
}));
export default useAuthStore;