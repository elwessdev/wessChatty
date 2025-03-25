import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { BotMessageSquare, Send } from "lucide-react";
import { useBotAIStore } from "../store/botAIStore";

const ChattyAI = () => {
    const messageEndRef = useRef(null);
    const messages = useBotAIStore((state) => state.messages);

    useEffect(() => {
        if (messageEndRef.current && messages.length) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    console.log(messages);

    if (!messages.length) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                    key={idx}
                    className={`chat ${msg.from}`}
                    ref={messageEndRef}
                    >
                    <div className="chat-image avatar">
                        {msg.from === "bot" && <div className="size-9 rounded-lg bg-primary/10 flex justify-center items-center" style={{display: "flex !important"}}>
                                <BotMessageSquare className="w-5 h-5 text-primary" />
                            </div>
                        }
                    </div>
                    <div className="chat-header mb-1">
                        <time className="text-xs opacity-50 ml-1">
                            {formatMessageTime(msg?.createdAt)}
                        </time>
                    </div>
                    <div className="chat-bubble flex flex-col">
                        {msg?.image && (
                            <img
                                src={msg.image}
                                alt="Attachment"
                                className="sm:max-w-[200px] rounded-md mb-2"
                            />
                        )}
                        {msg.text && <p>{msg.text}</p>}
                    </div>
                    </div>
                ))}
            </div>
            {/* INPUT */}
            <div className="p-4 w-full">
                <form 
                    // onSubmit={handleSendMessage} 
                    className="flex items-center gap-2">
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                            placeholder="Type a message..."
                            // value={text}
                            // onChange={(e) => setText(e.target.value)}
                        />
                        <button
                            type="button"
                            className={`hidden sm:flex btn btn-circle`}
                            // onClick={() => fileInputRef.current?.click()}
                        >
                            <Send size={22} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ChattyAI;
