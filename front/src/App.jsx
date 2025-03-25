import { Routes, Route, Navigate } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import useAuthStore from "./store/authStore";


const App = () => {
  const user = useAuthStore(state=>state.user);
  const refreshToken = useAuthStore(state=>state.refreshToken);
  const checkAuthLoading = useAuthStore(state=>state.checkAuthLoading);
  const { theme } = useThemeStore();

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  // console.log(user);

  if (checkAuthLoading && !user){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={user ?<HomePage /> :<Navigate to="/login" />} />
        <Route path="/signup" element={user ?<Navigate to="/" /> :<SignUpPage />} />
        <Route path="/login" element={user ?<Navigate to="/" /> :<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={user ?<ProfilePage /> :<Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
};
export default App;
