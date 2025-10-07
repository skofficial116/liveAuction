import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";

const socket = io.connect("http://localhost:3100");
const username = nanoid(4);
console.log("Username: ", username);

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const bottomRef = useRef(null); // 👈 for auto scroll

  const sendChat = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    socket.emit("chat", { message, username });
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat((prevChat) => [...prevChat, payload]);
    });

    socket.on("chatHistory", (messages) => {
      setChat(messages);
    });

    return () => {
      socket.off("chat");
      socket.off("chatHistory");
    };
  }, []);

  // 👇 whenever chat updates, scroll to the bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition"
        >
          💬
        </button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
            <h2 className="font-semibold">Chat</h2>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {chat.map((payload, index) => {
              const isMe = payload.username === username;
              return (
                <div
                  key={index}
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                      isMe
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <p>{payload.message}</p>
                    <span className="block text-xs opacity-70 mt-1">
                      {isMe ? "You" : payload.username}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* 👇 Invisible div for scrolling */}
            <div ref={bottomRef}></div>
          </div>

          {/* Input */}
          <form
            onSubmit={sendChat}
            className="flex items-center border-t p-2 gap-2"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatComponent;
