import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from "../UserContext";

const ChatAssistant = (props) => {
  const { user } = useContext(UserContext);
  // Use candidateId from props if available, otherwise from localStorage or URL, default "1"
  const effectiveCandidateId = user?.id || 
  props.candidateId || 
  new URLSearchParams(window.location.search).get('candidateId') || 
  '1';

console.log("Effective candidateId from context:", effectiveCandidateId);

  // Conversation state to manage the roadmap flow.
  const [conversation, setConversation] = useState({
    mode: null, // "roadmap" or "simple"
    step: 0,
    details: {}
  });
  // Messages state holds an array of message objects: { sender: 'bot' | 'user', content: string }
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      content:
        "Welcome! Would you like to create a personalized career roadmap? (yes/no)"
    }
  ]);
  // For the text input value.
  const [inputValue, setInputValue] = useState('');
  // For storing previous chat logs from the backend.
  const [chatLogs, setChatLogs] = useState([]);
  // State to collapse/expand the sidebar.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const chatBoxRef = useRef(null);
  const apiUrl = 'http://localhost:3000'; // Backend API URL

  // Helper: Add Tailwind styling for HTML content (tables, links, etc.)
  const formatHTMLContent = (content) => {
    return content
      .replace(/<table/gi, '<table class="min-w-full table-auto border-collapse mb-4"')
      .replace(/<th/gi, '<th class="px-4 py-2 border border-gray-300 bg-gray-200 text-left"')
      .replace(/<td/gi, '<td class="px-4 py-2 border border-gray-300"')
      .replace(/<a /gi, '<a class="text-blue-500 font-bold hover:underline" ');
  };

  // Helper: Format plain-text answers into bullet points with extra spacing,
  // and also style any URLs found within the text.
  const formatAnswerContent = (answer) => {
    // Remove unwanted asterisks.
    let cleaned = answer.replace(/\*/g, '');

    // If answer contains any HTML tags, assume it's pre-formatted.
    if (/<\/?[a-z][\s\S]*>/i.test(cleaned)) {
      return formatHTMLContent(cleaned);
    }
    
    // Replace URLs in plain text with styled anchor tags.
    cleaned = cleaned.replace(
      /(https?:\/\/[^\s]+)/gi,
      '<a href="$1" target="_blank" class="text-blue-500 font-bold hover:underline">$1</a>'
    );

    // Attempt to split by newline first.
    let lines = cleaned.split(/\r?\n/).filter(line => line.trim() !== '');
    
    // If no newlines, split by period followed by a space.
    if (lines.length <= 1) {
      lines = cleaned.split('. ').filter(line => line.trim() !== '');
      // Append period if missing.
      lines = lines.map(line => line.trim().endsWith('.') ? line.trim() : line.trim() + '.');
    }
    
    // If we have multiple lines, wrap them in a styled unordered list.
    if (lines.length > 1) {
      return `<ul class="list-disc list-inside space-y-2 mt-2">
        ${lines.map(line => `<li class="py-1">${line}</li>`).join('')}
      </ul>`;
    }
    // Otherwise, return the cleaned answer in a paragraph with extra padding.
    return `<p class="py-2">${cleaned}</p>`;
  };

  // Scroll to the bottom whenever messages change.
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch previous chat logs from the backend.
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

  // Append a message to the chat.
  const addMessage = (sender, content) => {
    setMessages((prev) => [...prev, { sender, content }]);
  };

  // Reset the chat to the initial state.
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

  // Handle the send button or Enter key when input is text.
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userInput = inputValue.trim();
    addMessage('user', userInput);

    // INITIAL QUESTION: Ask if the user wants a roadmap.
    if (conversation.mode === null) {
      if (userInput.toLowerCase() === 'yes') {
        setConversation({ mode: 'roadmap', step: 1, details: {} });
        addMessage(
          'bot',
          'Great! Which domain would you like to excel in? (e.g., Software Development, Data Science)'
        );
      } else if (userInput.toLowerCase() === 'no') {
        setConversation({ mode: 'simple', step: 0, details: {} });
        addMessage(
          'bot',
          "Alright, I'm here to help with any questions you have."
        );
      } else {
        addMessage(
          'bot',
          "Please answer 'yes' or 'no'. Would you like to create a personalized career roadmap? (yes/no)"
        );
      }
      setInputValue('');
      return;
    }

    // ROADMAP FLOW
    if (conversation.mode === 'roadmap') {
      // Step 1: Get domain.
      if (conversation.step === 1) {
        const domain = userInput;
        setConversation((prev) => ({
          ...prev,
          step: 2,
          details: { ...prev.details, domain }
        }));
        addMessage(
          'bot',
          'For how many months would you like your roadmap? Please select a duration.'
        );
        setInputValue('');
        return;
      }
      // Step 3: Ask about cheat sheets.
      if (conversation.step === 3) {
        const cheatAnswer = userInput.toLowerCase();
        if (cheatAnswer === 'yes' || cheatAnswer === 'no') {
          addMessage('user', cheatAnswer);
          setConversation((prev) => ({
            ...prev,
            step: 4,
            details: { ...prev.details, cheatSheet: cheatAnswer }
          }));
          addMessage(
            'bot',
            'Please select your roadmap type: Certification-based or Non-certification-based.'
          );
          setInputValue('');
        } else {
          addMessage(
            'bot',
            "Please answer 'yes' or 'no'. Would you like to include cheat sheets and course links?"
          );
          setInputValue('');
        }
        return;
      }
    }

    // SIMPLE MODE: Send question to backend.
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

  // Handle duration selection (roadmap step 2).
  const handleDurationChange = (e) => {
    const duration = e.target.value;
    if (!duration) return;
    addMessage('user', `${duration} month(s)`);
    setConversation((prev) => ({
      ...prev,
      step: 3,
      details: { ...prev.details, duration }
    }));
    addMessage(
      'bot',
      'Would you like to include cheat sheets and course links in your roadmap? (yes/no)'
    );
  };

  // Handle certification dropdown (roadmap step 4).
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
    addMessage(
      'bot',
      'Your personalized roadmap is ready! Feel free to ask any other questions.'
    );
  };

  // When a previous chat log is clicked, display that conversation.
  const handleChatLogClick = (log) => {
    setMessages([
      { sender: 'bot', content: '<h2>Previous Chat</h2>' },
      { sender: 'bot', content: `<strong>Q:</strong> ${log.question}` },
      { sender: 'bot', content: `<strong>A:</strong> ${formatAnswerContent(log.answer)}` }
    ]);
  };

  // Render the appropriate input component based on conversation state.
  const renderInputComponent = () => {
    if (conversation.mode === 'roadmap' && conversation.step === 2) {
      return (
        <select
          className="flex-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
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
          className="flex-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
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
        className="flex-1 p-2 border border-gray-700 rounded bg-gray-900 text-gray-200"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 overflow-hidden">
      {/* Sidebar for previous chats */}
      <div
        className={`w-72 bg-gray-800 border-r border-gray-700 overflow-y-auto transition-transform duration-300 ${
          sidebarCollapsed ? '-translate-x-72' : ''
        }`}
      >
        <h2 className="p-4 text-xl font-semibold">Previous Chats</h2>
        <div>
          {chatLogs.length > 0 ? (
            chatLogs.map((log) => (
              <div
                key={log.id || log.created_at}
                onClick={() => handleChatLogClick(log)}
                className="p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700"
              >
                <strong>{new Date(log.created_at).toLocaleTimeString()}</strong>
                <br />
                {log.question}
              </div>
            ))
          ) : (
            <p className="p-4">No previous chats.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-2xl">Chat Assistant</h1>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-2xl focus:outline-none"
          >
            &#9776;
          </button>
        </div>

        {/* Chat messages */}
        <div
          ref={chatBoxRef}
          className="flex-1 p-4 overflow-y-auto bg-gray-900 space-y-4"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[70%] p-3 rounded ${
                msg.sender === 'user'
                  ? 'bg-teal-700 self-end text-white'
                  : 'bg-gray-700 self-start text-gray-200'
              }`}
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 bg-gray-800 flex gap-2 items-center">
          {renderInputComponent()}
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Send
          </button>
        </div>

        {/* Back button */}
        <div className="p-4">
          <button
            onClick={resetChat}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Back to Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
