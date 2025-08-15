"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
/* eslint-disable react/no-unescaped-entities */

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleChat = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const now = new Date();
    const userMessage = {
      sender: "user",
      text: input,
      time: formatTime(now),
      date: formatDate(now),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      const aiMessage = {
        sender: "ai",
        text: data.response || "No response.",
        time: formatTime(new Date()),
        date: formatDate(new Date()),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Error processing your request.",
          time: formatTime(new Date()),
          date: formatDate(new Date()),
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            🧠
          </div>
          <div>
            <h1 className="text-xl font-bold">Hitesh Sir's AI Personality</h1>
            <p className="text-blue-100 text-sm">Your intelligent coding companion</p>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
      </header>

      {/* Enhanced Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg">
              💬
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Start a conversation</h2>
              <p className="text-gray-500">Ask me anything about coding, tech, or life!</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end space-x-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } animate-fadeIn`}
          >
            {msg.sender === "ai" && (
              <div className="flex-shrink-0">
                <Image
                  src="/ai-avatar.png"
                  alt="AI"
                  width={40}
                  height={40}
                  className="rounded-full shadow-lg border-2 border-white"
                />
              </div>
            )}

            <div className="flex flex-col max-w-xs lg:max-w-md">
              <div
                className={`px-4 py-3 rounded-2xl shadow-lg ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md transform hover:scale-105 transition-transform duration-200"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-md hover:shadow-xl transition-shadow duration-200"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
              <div className={`text-xs text-gray-400 mt-1 px-2 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}>
                {msg.date} • {msg.time}
              </div>
            </div>

            {msg.sender === "user" && (
              <div className="flex-shrink-0">
                <Image
                  src="/user-avatar.jpg"
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full shadow-lg border-2 border-white"
                />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-end space-x-2 animate-fadeIn">
            <div className="flex-shrink-0">
              <Image
                src="/ai-avatar.png"
                alt="AI"
                width={40}
                height={40}
                className="rounded-full shadow-lg border-2 border-white"
              />
            </div>
            <div className="flex flex-col">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-lg border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-1 px-2">
                {formatDate(new Date())} • {formatTime(new Date())}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4">
        <form onSubmit={handleChat} className="flex items-center space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full bg-white border-2 border-gray-200 rounded-full px-6 py-3 pr-12 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              💭
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg disabled:cursor-not-allowed group"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-blue-200::-webkit-scrollbar-thumb {
          background-color: #bfdbfe;
          border-radius: 9999px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
    </main>
  );
}
