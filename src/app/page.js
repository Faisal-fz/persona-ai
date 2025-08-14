"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Replace these with your actual image paths
  const userAvatar = "/user-avatar.jpg"; // Your user avatar path
  const aiAvatar = "/ai-avatar.png";    // Your AI avatar path

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat(e);
    } else if (e.key === "Enter" && e.shiftKey) {
      setInput(input + "\n");
    }
    
  };

  const handleChat = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    
    // Add user message to conversation with timestamp
    const userMessage = { 
      sender: 'user', 
      text: input,
      avatar: userAvatar,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMessage]);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      
      // Add AI response to conversation with timestamp
      const aiMessage = { 
        sender: 'ai', 
        text: data.response,
        avatar: aiAvatar,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        sender: 'ai', 
        text: "Error processing your request. Please try again.",
        avatar: aiAvatar,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    }
    
    setInput("");
    setLoading(false);
    textareaRef.current?.focus();
  };

  // Format timestamp as "HH:MM AM/PM · Month Day"
  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    }) + ' · ' + date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <header className="text-center mb-4 md:mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            Hitesh Sir's AI Persona
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Interact with our API through this beautiful interface</p>
        </header>

        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex-1 flex flex-col">
          {/* Conversation history */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-900/50">
            {conversation.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p>Start a conversation by typing below</p>
                </div>
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {msg.sender === 'ai' && (
                    <img 
                      src={msg.avatar} 
                      alt="AI Avatar" 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full mt-1 object-cover border-2 border-purple-500"
                    />
                  )}
                  <div className={`max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                    <div
                      className={`rounded-lg px-4 py-2 ${msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-gray-100 rounded-bl-none'}`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-300' : 'text-gray-500'}`}>
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                  {msg.sender === 'user' && (
                    <img 
                      src={msg.avatar} 
                      alt="User Avatar" 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full mt-1 object-cover border-2 border-blue-500"
                    />
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start gap-3">
                <img 
                  src={aiAvatar} 
                  alt="AI Avatar" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full mt-1 object-cover border-2 border-purple-500"
                />
                <div className="bg-gray-700 text-gray-100 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleChat} className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="relative">
              <textarea
                ref={textareaRef}
                className="min-h-[60px] max-h-[200px] w-full bg-gray-700 text-gray-100 rounded-lg px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={1}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="absolute right-12 bottom-2 p-2 text-gray-400 hover:text-white transition-colors"
                  title="Clear message"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 bottom-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                title="Send message"
              >
                {loading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>{input.length}/1000</span>
            </div>
          </form>
        </div>

        <footer className="text-center mt-4 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CLI API Interface. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}