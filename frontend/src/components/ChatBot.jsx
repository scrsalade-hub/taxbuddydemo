import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export default function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm TaxBuddy AI — your personal tax assistant. I can help you with Nigerian tax questions (VAT, CIT, PAYE, WHT), guide you through TaxBuddy features, and keep you compliant. What would you like to know?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-hide tooltip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: new Date() }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${API}/api/chat`,
        {
          userId: user?._id || 'guest',
          message: userMsg,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.reply, time: new Date() },
      ]);
      setRemaining(data.remainingMessages);
    } catch (error) {
      const errMsg =
        error.response?.data?.error || 'Something went wrong. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: errMsg,
          time: new Date(),
          isError: true,
        },
      ]);
      if (error.response?.data?.error === 'Daily limit reached') {
        setRemaining(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Tooltip label above the button */}
      {!isOpen && showTooltip && (
        <div
          className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 max-w-[200px] animate-bounce-slow"
          style={{ animation: 'fadeInUp 0.5s ease-out' }}
        >
          <p className="text-xs text-gray-600 font-medium">
            Got tax questions? Chat with our AI! 💬
          </p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45" />
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-gray-500"
          >
            ×
          </button>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">TaxBuddy AI</h3>
                <p className="text-white/70 text-[11px]">
                  {remaining !== null
                    ? `${remaining} messages left today`
                    : 'Your tax assistant'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-primary-light'
                      : 'bg-primary'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : msg.isError
                      ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
                      : 'bg-white text-gray-700 border border-gray-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(msg.time)}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
              </div>
            )}

            {/* Daily limit warning */}
            {remaining === 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">
                  You've reached your daily limit. Come back tomorrow!
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-200 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  remaining === 0
                    ? 'Daily limit reached...'
                    : 'Ask about taxes...'
                }
                disabled={loading || remaining === 0}
                maxLength={500}
                className="flex-1 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim() || remaining === 0}
                className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-right">
              {input.length}/500
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title="Chat with TaxBuddy AI"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
