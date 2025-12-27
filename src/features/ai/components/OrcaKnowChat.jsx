import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { botAPI } from "../../../services/ai_api";

// ChatBubble Component - The floating button
const ChatBubble = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 z-50 ${
        isOpen
          ? "bg-red-500 hover:bg-red-600"
          : "bg-linear-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      }`}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <X className="w-6 h-6 text-white m-auto" />
      ) : (
        <MessageCircle className="w-6 h-6 text-white m-auto animate-bounce" />
      )}
    </button>
  );
};

// Message Component - Individual chat messages
const Message = ({ message, isUser, grounding }) => {
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 animate-fadeIn`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
          isUser
            ? "bg-linear-to-br from-blue-500 to-purple-600 text-white"
            : "bg-gray-100 text-gray-800 border border-gray-200"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap wrap-break-word">{message}</p>
        {!isUser && grounding === false && (
          <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
            <AlertCircle className="w-3 h-3" />
            <span>Thông tin có thể không chính xác</span>
          </div>
        )}
      </div>
    </div>
  );
};

// TypingIndicator Component
const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-md">
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// ChatWindow Component - The main chat interface
const ChatWindow = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Tôi là OrcaKnow. Tôi có thể giúp gì cho bạn hôm nay?",
      isUser: false,
      grounding: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await botAPI.ask({ question: inputValue.trim() });

      const aiMessage = {
        text: response.data.answer,
        isUser: false,
        grounding: response.data.grounding,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");

      const errorMessage = {
        text:
          err.response?.data?.detail ||
          "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.",
        isUser: false,
        grounding: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 animate-slideUp">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">OrcaKnow</h3>
            <p className="text-xs text-blue-100">Trợ lý AI của bạn</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 rounded-full p-2 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        {messages.map((msg, index) => (
          <Message
            key={index}
            message={msg.text}
            isUser={msg.isUser}
            grounding={msg.grounding}
          />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-linear-to-br from-blue-500 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main OrcaKnowChat Component
const OrcaKnowChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <style>{`
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      <ChatWindow isOpen={isOpen} onClose={toggleChat} />
      <ChatBubble onClick={toggleChat} isOpen={isOpen} />
    </>
  );
};

export default OrcaKnowChat;