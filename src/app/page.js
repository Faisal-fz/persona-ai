"use client";
import { useState } from "react";
import Image from "next/image";
/* eslint-disable react/no-unescaped-entities */
export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
    <main className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-center font-bold text-lg shadow-md">
        🤖 Hitesh Sir&apos;s AI Personality
      </header>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "ai" && (
              <Image
                src="/ai-avatar.png"
                alt="AI"
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
            )}

            <div>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border"
                }`}
              >
                {msg.text}
              </div>
              <div className="text-xs text-gray-500 mt-1 px-1">
                {msg.date} • {msg.time}
              </div>
            </div>

            {msg.sender === "user" && (
              <Image
                src="/user-avatar.jpg"
                alt="User"
                width={32}
                height={32}
                className="rounded-full ml-2"
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start">
            <Image
              src="/ai-avatar.png"
              alt="AI"
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
            <div>
              <div className="bg-white px-4 py-2 rounded-lg shadow border animate-pulse">
                Typing...
              </div>
              <div className="text-xs text-gray-500 mt-1 px-1">
                {formatDate(new Date())} • {formatTime(new Date())}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleChat}
        className="flex items-center p-4 bg-white border-t"
      >
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </main>
  );
}
