/*
  IMPORTANT:
  • Ensure you load Mermaid via CDN in your public/index.html:
      <script src="https://unpkg.com/mermaid@10/dist/mermaid.min.js"></script>
  • Your backend response for a flowchart must start with "flowchart:" (optionally preceded by a line containing "mermaid")
    followed by valid Mermaid syntax.
*/

import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from "../UserContext";
import { ArrowLeft, Bell, User, Menu } from 'react-feather';

const ChatAssistant = (props) => {
  const { user } = useContext(UserContext);
  const effectiveCandidateId =
    user?.id ||
    props.candidateId ||
    new URLSearchParams(window.location.search).get('candidateId') ||
    '1';

  const [conversation, setConversation] = useState({
    mode: null, // "roadmap" or "simple"
    step: 0,
    details: {}
  });
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      content:
        "Welcome! Would you like to create a personalized career roadmap? (yes/no)"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatLogs, setChatLogs] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const chatBoxRef = useRef(null);
  const apiUrl = 'http://localhost:3000'; // Your backend API URL

  // Initialize Mermaid using the global variable
  useEffect(() => {
    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: false });
    } else {
      console.error("Mermaid is not loaded. Ensure the CDN script is included in your index.html.");
    }
  }, []);

  // Function to render Mermaid diagrams manually
  const renderMermaidDiagrams = () => {
    if (!window.mermaid) {
      console.error("Mermaid is not loaded.");
      return;
    }
    const mermaidElements = document.querySelectorAll('.mermaid');
    mermaidElements.forEach((element, index) => {
      const graphDefinition = element.textContent;
      const uniqueId = `mermaid-${index}-${Date.now()}`;
      try {
        const svgCode = window.mermaid.render(uniqueId, graphDefinition);
        element.innerHTML = svgCode;
      } catch (e) {
        console.error('Error rendering Mermaid diagram:', e);
      }
    });
  };

  // After messages update, try rendering Mermaid diagrams
  useEffect(() => {
    setTimeout(() => {
      renderMermaidDiagrams();
    }, 500);
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Format answer content: if it starts with "mermaid" and then "flowchart:" remove extra line.
  const formatAnswerContent = (answer) => {
    let trimmed = answer.trim();
    // Remove a leading "mermaid" line if present.
    if (trimmed.toLowerCase().startsWith("mermaid")) {
      const lines = trimmed.split("\n");
      lines.shift();
      trimmed = lines.join("\n").trim();
    }
    // Check for flowchart prefix.
    if (trimmed.toLowerCase().startsWith("flowchart:")) {
      const flowchartContent = trimmed.substring("flowchart:".length).trim();
      return `<div class="mermaid">${flowchartContent}</div>`;
    }
    // Otherwise, perform standard text formatting.
    let cleaned = answer.replace(/\*/g, '');
    if (/<\/?[a-z][\s\S]*>/i.test(cleaned)) {
      return cleaned;
    }
    cleaned = cleaned.replace(
      /(https?:\/\/[^\s]+)/gi,
      '<a href="$1" target="_blank" class="text-blue-500 font-bold hover:underline">$1</a>'
    );
    let lines = cleaned.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) {
      lines = cleaned.split('. ').filter(line => line.trim() !== '');
      lines = lines.map(line => line.trim().endsWith('.') ? line.trim() : line.trim() + '.');
    }
    if (lines.length > 1) {
      return `<ul class="list-disc list-inside space-y-2 mt-2">
        ${lines.map(line => `<li class="py-1">${line}</li>`).join('')}
      </ul>`;
    }
    return `<p class="py-2">${cleaned}</p>`;
  };

  const loadPreviousChats = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/chat-logs?candidateId=${encodeURIComponent(effectiveCandidateId)}`
      );
      const data = await response.json();
      if (data.chatLogs) {
        setChatLogs(data.chatLogs);
      }
    } catch (error) {
      console.error('Error fetching previous chats:', error);
    }
  };

  useEffect(() => {
    loadPreviousChats();
  }, [effectiveCandidateId]);

  const addMessage = (sender, content) => {
    setMessages((prev) => [...prev, { sender, content }]);
  };

  const resetChat = () => {
    setMessages([
      {
        sender: 'bot',
        content:
          "Welcome! Would you like to create a personalized career roadmap? (yes/no)"
      }
    ]);
    setConversation({ mode: null, step: 0, details: {} });
    setInputValue('');
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userInput = inputValue.trim();
    addMessage('user', userInput);

    if (conversation.mode === null) {
      if (userInput.toLowerCase() === 'yes') {
        setConversation({ mode: 'roadmap', step: 1, details: {} });
        addMessage('bot', 'Great! Which domain would you like to excel in? (e.g., Software Development, Data Science)');
      } else if (userInput.toLowerCase() === 'no') {
        setConversation({ mode: 'simple', step: 0, details: {} });
        addMessage('bot', "Alright, I'm here to help with any questions you have.");
      } else {
        addMessage('bot', "Please answer 'yes' or 'no'. Would you like to create a personalized career roadmap? (yes/no)");
      }
      setInputValue('');
      return;
    }

    if (conversation.mode === 'roadmap') {
      if (conversation.step === 1) {
        const domain = userInput;
        setConversation((prev) => ({
          ...prev,
          step: 2,
          details: { ...prev.details, domain }
        }));
        addMessage('bot', 'For how many months would you like your roadmap? Please select a duration.');
        setInputValue('');
        return;
      }
      if (conversation.step === 3) {
        const cheatAnswer = userInput.toLowerCase();
        if (cheatAnswer === 'yes' || cheatAnswer === 'no') {
          addMessage('user', cheatAnswer);
          setConversation((prev) => ({
            ...prev,
            step: 4,
            details: { ...prev.details, cheatSheet: cheatAnswer }
          }));
          addMessage('bot', 'Please select your roadmap type: Certification-based or Non-certification-based.');
          setInputValue('');
        } else {
          addMessage('bot', "Please answer 'yes' or 'no'. Would you like to include cheat sheets and course links?");
          setInputValue('');
        }
        return;
      }
    }

    if (conversation.mode === 'simple') {
      try {
        const response = await fetch(`${apiUrl}/ask-roadmap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidateId: effectiveCandidateId, question: userInput })
        });
        const data = await response.json();
        if (data.answer) {
          const formatted = formatAnswerContent(data.answer);
          addMessage('bot', formatted);
        } else {
          addMessage('bot', "Sorry, I didn't receive an answer.");
        }
      } catch (error) {
        console.error('Error:', error);
        addMessage('bot', 'Error fetching response.');
      }
      setInputValue('');
    }
  };

  const handleDurationChange = (e) => {
    const duration = e.target.value;
    if (!duration) return;
    addMessage('user', `${duration} month(s)`);
    setConversation((prev) => ({
      ...prev,
      step: 3,
      details: { ...prev.details, duration }
    }));
    addMessage('bot', 'Would you like to include cheat sheets and course links in your roadmap? (yes/no)');
  };

  const handleCertificationChange = async (e) => {
    const certValue = e.target.value;
    if (!certValue) return;
    addMessage('user', certValue);
    const newDetails = { ...conversation.details, certification: certValue };
    setConversation((prev) => ({
      ...prev,
      step: 5,
      details: newDetails
    }));
    const { domain, duration, cheatSheet } = newDetails;
    const compositeQuestion = `Create a detailed, actionable, and professional weekly roadmap for someone who wants to excel in ${domain} over a period of ${duration} month${duration > 1 ? 's' : ''}. Please present your answer as bullet points.`;
    addMessage('bot', 'Generating your personalized roadmap...');
    try {
      const response = await fetch(`${apiUrl}/ask-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: effectiveCandidateId,
          roadmap: true,
          domain,
          duration,
          cheatSheet,
          certification: certValue,
          question: compositeQuestion
        })
      });
      const data = await response.json();
      if (data.answer) {
        const formatted = formatAnswerContent(data.answer);
        addMessage('bot', formatted);
      } else {
        addMessage('bot', "Sorry, I didn't receive an answer.");
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage('bot', 'Error fetching response.');
    }
    setConversation({ mode: 'simple', step: 0, details: {} });
    addMessage('bot', 'Your personalized roadmap is ready! Feel free to ask any other questions.');
  };

  const handleChatLogClick = (log) => {
    setMessages([
      { sender: 'bot', content: '<h2>Previous Chat</h2>' },
      { sender: 'bot', content: `<strong>Q:</strong> ${log.question}` },
      { sender: 'bot', content: `<strong>A:</strong> ${formatAnswerContent(log.answer)}` }
    ]);
  };

  const renderInputComponent = () => {
    if (conversation.mode === 'roadmap' && conversation.step === 2) {
      return (
        <select
          className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-900"
          onChange={handleDurationChange}
          defaultValue=""
        >
          <option value="" disabled>
            Select duration (months)
          </option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      );
    }
    if (conversation.mode === 'roadmap' && conversation.step === 4) {
      return (
        <select
          className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-900"
          onChange={handleCertificationChange}
          defaultValue=""
        >
          <option value="" disabled>
            Select roadmap type
          </option>
          <option value="certification">Certification-based</option>
          <option value="non-certification">Non-certification-based</option>
        </select>
      );
    }
    return (
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your answer or question here..."
        className="flex-1 p-2 border border-gray-300 rounded bg-white text-gray-900"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
    );
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="p-2 rounded-full text-white hover:bg-white/10 transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h1 className="ml-4 text-2xl font-bold text-white">MetaMind</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/90 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Courses</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Community</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Resources</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-white hover:bg-white/10 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-2 rounded-full text-white hover:bg-white/10 transition-colors">
                  <User size={20} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Help Center</a>
                    <hr className="my-1" />
                    <a href="#" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Sign Out</a>
                  </div>
                )}
              </div>
              <button className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <div className="flex h-screen bg-white text-gray-900 overflow-hidden pt-16">
        {/* Sidebar for previous chats */}
        <div className={`w-72 bg-white border-r border-gray-300 overflow-y-auto transition-transform duration-300 ${sidebarCollapsed ? '-translate-x-72' : ''}`}>
          <h2 className="p-4 text-xl font-semibold">Previous Chats</h2>
          <div>
            {chatLogs.length > 0 ? (
              chatLogs.map((log) => {
                let heading = "";
                const compositePromptRegex = /excel in\s+(.+?)\s+over a period/i;
                if (compositePromptRegex.test(log.question)) {
                  const match = log.question.match(compositePromptRegex);
                  const domain = match && match[1] ? match[1] : "";
                  heading = domain ? `Roadmap of ${domain}` : "Roadmap";
                } else {
                  heading = log.question.length > 50 ? log.question.substring(0, 50) + '...' : log.question;
                }
                return (
                  <div
                    key={log.id || log.created_at}
                    onClick={() => handleChatLogClick(log)}
                    className="p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
                  >
                    <strong>{new Date(log.created_at).toLocaleTimeString()}</strong>
                    <br />
                    {heading}
                  </div>
                );
              })
            ) : (
              <p className="p-4">No previous chats.</p>
            )}
          </div>
        </div>
        {/* Main Chat Area */}
        <div className="flex flex-col flex-1">
          <div className="bg-white p-4 flex justify-between items-center border-b border-gray-300">
            <h1 className="text-2xl">Chat Assistant</h1>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-2xl focus:outline-none">
              &#9776;
            </button>
          </div>
          <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto bg-white space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[70%] p-3 rounded ${msg.sender === 'user' ? 'bg-blue-100 self-end text-gray-900' : 'bg-gray-100 self-start text-gray-900'}`} dangerouslySetInnerHTML={{ __html: msg.content }} />
            ))}
          </div>
          <div className="p-4 bg-white flex gap-2 items-center border-t border-gray-300">
            {renderInputComponent()}
            <button onClick={handleSend} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
              Send
            </button>
          </div>
          <div className="p-4">
            <button onClick={resetChat} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
              Back to Chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;
