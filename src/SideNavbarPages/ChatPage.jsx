import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Book, Calendar, MessageCircle, Users, Settings,
  LogOut, Search, Paperclip, Smile, Phone, Send
} from 'lucide-react';

const ChatPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: "Alice", content: "Hi, how are you?", time: "09:00 AM" },
      { id: 2, sender: "You", content: "I'm good, thanks! How about you?", time: "09:01 AM" },
    ],
    2: [
      { id: 1, sender: "Bob", content: "Hey, can you help me?", time: "08:00 AM" },
      { id: 2, sender: "You", content: "Sure, what do you need?", time: "08:05 AM" },
    ],
    3: [
      { id: 1, sender: "Charlie", content: "Are we meeting today?", time: "Yesterday" },
      { id: 2, sender: "You", content: "Yes, at 5 PM.", time: "Yesterday" },
    ],
  });

  useEffect(() => {
    if (selectedConversation) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [selectedConversation]);

  const conversations = [
    { id: 1, name: "Alice", lastMessage: "See you soon!", avatar: "https://via.placeholder.com/40", status: "online" },
    { id: 2, name: "Bob", lastMessage: "Thanks for your help.", avatar: "https://via.placeholder.com/40", status: "offline" },
    { id: 3, name: "Charlie", lastMessage: "Let's catch up.", avatar: "https://via.placeholder.com/40", status: "online" },
  ];

  const navItems = [
    { icon: Grid, label: "Dashboard", route: "/studentdashboard" },
    { icon: Book, label: "Courses", route: "/courses" },
    { icon: Calendar, label: "Schedule", route: "/studentschedule" },
    { icon: MessageCircle, label: "Messages", route: "/chatpage" },
    { icon: Users, label: "Community", route: "/communitypage" },
    { icon: Settings, label: "Settings", route: "/settings" },
    { icon: LogOut, label: "Logout", route: "/logout" },
  ];

  const handleSelectConversation = (convId) => {
    setSelectedConversation(convId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const messageToAdd = {
        id: Date.now(),
        sender: "You",
        content: newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages({
        ...messages,
        [selectedConversation]: [...(messages[selectedConversation] || []), messageToAdd],
      });
      setNewMessage("");
    }
  };

  const LoadingSpinner = () => (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-gray-500">Loading messages...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 
        fixed lg:static 
        w-64 lg:w-20 
        bg-indigo-600
        min-h-screen 
        flex flex-col 
        items-center 
        py-8 
        gap-8 
        transition-all 
        duration-300 
        ease-in-out
        z-40
        shadow-xl
      `}>
        {/* Logo */}
        <div
          onClick={() => navigate('/studentprofile')}
          className="w-12 h-12 rounded-xl mb-8 bg-cover cursor-pointer transform hover:scale-110 transition-transform duration-200"
          style={{ backgroundImage: "url('https://tse3.mm.bing.net/th?id=OIP.--sB_AG8cxvPbn4tFQU4YAHaJ4&pid=Api&P=0&h=180')" }}
        />
        {/* Nav Items */}
        {navItems.map((item, index) => (
          <button
            onClick={() => navigate(item.route)}
            key={index}
            className="text-white/70 hover:text-white p-3 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-3 w-48 lg:w-auto relative transform hover:scale-105"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <item.icon size={24} />
            {hoveredIndex === index && (
              <span className="absolute left-14 bg-white text-purple-600 px-3 py-1 rounded-md text-sm shadow-lg animate-fade-in">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-20 bg-white rounded-tl-3xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-tr from-blue-500 to-purple-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            {selectedConversation && (
              <div className="relative">
                <img
                  src={conversations.find(c => c.id === selectedConversation)?.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-white transform hover:scale-105 transition-transform duration-200"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                  conversations.find(c => c.id === selectedConversation)?.status === 'online'
                    ? 'bg-green-400'
                    : 'bg-gray-400'
                } border-2 border-white`}></div>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">
                {selectedConversation ? conversations.find(c => c.id === selectedConversation)?.name : "Select a conversation"}
              </h1>
              {selectedConversation && 
                <p className="text-sm text-white/80">
                  {conversations.find(c => c.id === selectedConversation)?.status === 'online' ? 'Online' : 'Offline'}
                </p>
              }
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white/80 hover:text-white transition-colors transform hover:scale-110">
              <Phone size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white overflow-y-auto transition-all duration-300">
            <div className="sticky top-0 bg-white p-4 shadow-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={18} />
              </div>
            </div>
            <ul className="p-4 space-y-2">
              {conversations.map((conv) => (
                <li
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 transform hover:scale-102 ${
                    selectedConversation === conv.id ? 'bg-gradient-to-tr from-blue-50 to-purple-50 shadow-md' : ''
                  }`}
                >
                  <div className="relative">
                    <img src={conv.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                      conv.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    } border-2 border-white`}></div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold">{conv.name}</h2>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedConversation ? (
              isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages[selectedConversation]?.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                        <div 
                          className={`p-4 rounded-lg max-w-xs shadow-md transition-all duration-200 animate-fade-in ${
                            msg.sender === "You" 
                              ? "bg-gradient-to-tr from-blue-500 to-purple-500 text-white" 
                              : "bg-white text-gray-800"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div className="text-xs mt-1 text-right opacity-80">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-white border-t">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-500 hover:text-purple-500 transition-colors transform hover:scale-110">
                        <Smile size={20} />
                      </button>
                      <button className="text-gray-500 hover:text-purple-500 transition-colors transform hover:scale-110">
                        <Paperclip size={20} />
                      </button>
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-tr from-blue-500 to-purple-500 text-white p-2 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <MessageCircle size={48} className="mx-auto text-purple-500 animate-bounce" />
                  <p className="text-gray-500 text-xl">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;