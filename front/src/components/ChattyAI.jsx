import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
// import { formatMessageTime } from "../lib/utils";
import { BotMessageSquare, Send } from "lucide-react";
import { useBotAIStore } from "../store/botAIStore";
import Markdown from 'react-markdown'

const ChattyAI = () => {
    const messageEndRef = useRef(null);
    const messages = useBotAIStore((state) => state.messages);
    const sendMessage = useBotAIStore((state) => state.sendMessage);
    const messageLoading = useBotAIStore((state) => state.messageLoading);
    const getHistory = useBotAIStore((state) => state.getHistory);
    const botThinking = useBotAIStore((state) => state.botThinking);
    const [text, setText] = useState("");

    useEffect(() => {
        if (messageEndRef.current && messages.length) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        getHistory();
    },[]);

    if (messageLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    const handleSendMessage = (e) => {
        e.preventDefault();
        sendMessage(text);
        setText("");
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                    if(msg.role!="system"){
                        return (
                            <div
                                key={idx}
                                className={`chat ${msg?.role=="assistant" ? "chat-start" : "chat-end"}`}
                                ref={messageEndRef}
                            >
                                <div className="chat-image avatar">
                                    {msg?.role === "assistant" && 
                                        <div
                                            className="size-9 rounded-lg bg-primary/10 flex justify-center items-center"
                                            style={{"display": "flex"}}
                                        >
                                            <BotMessageSquare className="w-5 h-5 text-primary" />
                                        </div>
                                    }
                                </div>
                                {/* <div className="chat-header mb-1">
                                    <time className="text-xs opacity-50 ml-1">
                                        {formatMessageTime(msg?.createdAt)}
                                    </time>
                                </div> */}
                                <div 
                                    className={`chat-bubble flex flex-col ${msg?.role === "assistant" ? "overflow-auto" : ""}`}
                                >
                                    <Markdown>{msg?.content}</Markdown>
                                </div>
                            </div>
                        )
                    }
                })}
                {botThinking && (
                    <div className="chat chat-start">
                        <div className="chat-image avatar">
                            <div
                                className="size-9 rounded-lg bg-primary/10 flex justify-center items-center"
                                style={{"display": "flex"}}
                            >
                                <BotMessageSquare className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            <p>Thinking...</p>
                        </div>
                    </div>
                )}
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <div
                            className="size-9 rounded-lg bg-primary/10 flex justify-center items-center"
                            style={{"display": "flex"}}
                        ><BotMessageSquare className="w-5 h-5 text-primary" /></div>
                        <p className="ml-2">Hi, Ask Me Anything</p>
                    </div>
                )}
            </div>
            {/* INPUT */}
            <div className="p-4 w-full">
                <form 
                    onSubmit={handleSendMessage} 
                    className="flex items-center gap-2">
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                            placeholder="Type a message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button
                            type="submit"
                            className={`hidden sm:flex btn btn-circle`}
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
