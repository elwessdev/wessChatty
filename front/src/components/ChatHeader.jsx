import { BotMessageSquare, X } from "lucide-react";
import useChatStore from "../store/chatStore";
import useAuthStore from "../store/authStore";

const ChatHeader = () => {
  const {selectedUser,setSelectedUser} = useChatStore();
  const {onlineUsers} = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedUser=="ChattyAI" 
                ? (
                  <div className="size-9 rounded-lg bg-primary/10 w-full h-full flex justify-center items-center">
                    <BotMessageSquare className="w-5 h-5 text-primary" />
                  </div>
                ) 
                : (
                  <img src={selectedUser.profilePicture || "/avatar.png"} alt={selectedUser.name} />
                )
              }
            </div>
          </div>
          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedUser=="ChattyAI" ? "ChattyAI" : selectedUser.name}
            </h3>
            <p className="text-sm text-base-content/70">
              {selectedUser=="ChattyAI" ? "Ask Me Anything" : onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {/* Close button */}
        <button onClick={()=>setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
