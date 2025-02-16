import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaEllipsisV, FaPaperPlane, FaSmile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChatRoom = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: "Bot", text: "Hello! I'm your AI Chat Assistant. How can I help you today?", time: getTime() },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const userMessage = { sender: "You", text: inputMessage, time: getTime() };
      setMessages([...messages, userMessage]);
      setInputMessage("");

      setTimeout(() => {
        const botReply = generateBotReply(inputMessage);
        setMessages((prev) => [...prev, botReply]);
      }, 1000);
    }
  };

  const generateBotReply = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
      return { sender: "Bot", text: "Hi there! How can I assist you today?", time: getTime() };
    } else if (text.includes("how are you")) {
      return { sender: "Bot", text: "I'm just a bot, but I'm here to help!", time: getTime() };
    } else if (text.includes("project")) {
      return { sender: "Bot", text: "Are you asking about a project? I can help with that!", time: getTime() };
    } else if (text.includes("bye")) {
      return { sender: "Bot", text: "Goodbye! Have a great day!", time: getTime() };
    } else {
      return { sender: "Bot", text: "I'm not sure I understand. Could you please clarify?", time: getTime() };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar with fixed position */}
   {/* Navbar */}
   <div className="fixed top-0 left-0 w-full bg-gray-800 px-6 py-4 flex justify-between items-center shadow-md z-10">
  <h1 className="text-xl font-semibold">Chat Room</h1>
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 mr-4"
  >
    <FaArrowLeft size={20} />
    <span>Back</span>
  </button>
</div>
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 mt-16">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg text-sm shadow-md ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-700"}`}>
              <p className="font-semibold">{msg.sender}</p>
              <p>{msg.text}</p>
              <p className="text-xs text-right opacity-75">{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-800 p-3 flex items-center gap-2 shadow-md">
        <FaSmile size={24} className="cursor-pointer text-gray-400 hover:text-yellow-300" />
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 p-2 bg-gray-700 text-white rounded-lg outline-none"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <FaPaperPlane /> Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
