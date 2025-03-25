import { memo, useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { BotMessageSquare, Users } from "lucide-react";
import useChatStore from "../store/chatStore";
import useAuthStore from "../store/authStore";

const Sidebar = () => {
  const users = useChatStore((state)=>state.users);
  const usersLoading = useChatStore((state)=>state.usersLoading);
  const getUsers = useChatStore((state)=>state.getUsers);
  const setSelectedUser = useChatStore((state)=>state.setSelectedUser);
  const selectedUser = useChatStore((state)=>state.selectedUser);

  const {onlineUsers} = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(()=>{
    getUsers();
  },[getUsers]);

  useEffect(()=>{
    if(!showOnlineOnly) return setFilteredUsers(users);
    setFilteredUsers(users.filter((user)=>onlineUsers.includes(user._id)));
  },[showOnlineOnly,users,onlineUsers]);

  if (usersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2" style={{userSelect: "none"}}>
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">online</span>
        </div>
        {/* <div className="mt-3">
          <input
            type="text"
            placeholder="Search users to invite"
            className="input input-bordered w-full"
          />
          <div className="relative">
            <ul className="absolute z-10 bg-white border border-base-300 rounded-md shadow-lg w-full max-h-60 overflow-y-auto">
              {filteredUsers.map((user, idx) => (
                <li
                  key={idx}
                  onClick={() => setSelectedUser(user)}
                  className="p-2 hover:bg-base-300 cursor-pointer flex items-center gap-2"
                >
                  <img
                    src={user?.profilePicture ? user?.profilePicture : "/avatar.png"}
                    alt={user.name}
                    className="size-8 object-cover rounded-full"
                  />
                  <span className="truncate">{user?.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </div>
      <div className="overflow-y-auto w-full py-3">
        <button
            onClick={()=>setSelectedUser("ChattyAI")}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser=="ChattyAI" ? "bg-base-300 ring-1 ring-base-300" : ""}`}
          >
            <div className="relative mx-auto lg:mx-0">
              <div className="size-9 rounded-lg bg-primary/10 flex justify-center items-center">
                <BotMessageSquare className="w-5 h-5 text-primary" />
              </div>
              <span
                className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
              />
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">ChattyAI</div>
              <div className="text-sm text-zinc-400">Ask Me Anything</div>
            </div>
        </button>
        {filteredUsers?.map((user,idx) => (
          <button
            key={idx}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?.email === user.email ? "bg-base-300 ring-1 ring-base-300" : ""}`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user?.profilePicture ?user?.profilePicture :"/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers?.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>
            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user?.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers?.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default memo(Sidebar);
