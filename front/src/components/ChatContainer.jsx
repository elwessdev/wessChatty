import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const messageEndRef = useRef(null);


  // useEffect(() => {
  //   if (messageEndRef.current && messages) {
  //     messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  // if (isMessagesLoading) {
  //   return (
  //     <div className="flex-1 flex flex-col overflow-auto">
  //       <ChatHeader />
  //       <MessageSkeleton />
  //       <MessageInput />
  //     </div>
  //   );
  // }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div
            // key={message._id}
            // className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            className="chat-start"
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  // src={
                  //   message.senderId === authUser._id
                  //     ? authUser.profilePic || "/avatar.png"
                  //     : selectedUser.profilePic || "/avatar.png"
                  // }
                  src="/avatar.png"
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {/* {formatMessageTime(message.createdAt)} */}
                12:00 PM
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {/* {message.image && ( */}
                <img
                  // src={message.image}
                  src="/avatar.png"
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              {/* )} */}
              {/* {message.text && <p>{message.text}</p>} */}
              <p>Test test test</p>
            </div>
          </div>
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
