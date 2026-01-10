import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Youtube, ArrowRight } from 'lucide-react';
import axios from 'axios';
export default function ChatApp() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current && chatStarted) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input, chatStarted]);

  const isValidYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

 const handleStartChat = async () => {
  if (!youtubeUrl.trim() || !isValidYoutubeUrl(youtubeUrl)) {
    alert('Please enter a valid YouTube URL');
    return;
  }
  
  try {
    setChatStarted(true);
    setIsTyping(true);
    const res = await axios.post(
        `${import.meta.env.VITE_ML_API}/url`,
        { URL: youtubeUrl }
    );

    setIsTyping(false);
    
    setMessages([
      { 
        id: 1, 
        text: `${res.data.message}`, 
        sender: 'bot' 
      }
    ]);
  } catch (error) {
    console.error('Error:', error);
    setIsTyping(false);
    alert('Failed to load video transcript. Please try again.');
    setChatStarted(false);
  }
};

  const simulateBotResponse = async(userMessage) => {
    try{
     const res =  await axios.post(`${import.meta.env.VITE_ML_API}/chat`, 
      { question: userMessage})
     return res.data.answer
    }
    catch(error){
      console.log(error)
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: simulateBotResponse(input),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (chatStarted) {
        handleSend();
      } else {
        handleStartChat();
      }
    }
  };

  if (!chatStarted) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
        {/* Header */}
        <div className="backdrop-blur-xl bg-slate-900/60 border-b border-emerald-500/10 shadow-xl">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Youtube className="w-6 h-6 text-slate-950" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  YouTube AI Chat
                </h1>
                <p className="text-sm text-slate-400">Chat with any YouTube video</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Screen */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Youtube className="w-10 h-10 text-slate-950" strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Start Your Video Chat
              </h2>
              <p className="text-slate-400 text-lg">
                Paste a YouTube URL below to begin chatting about the video content
              </p>
            </div>

            {/* URL Input */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-sm border border-emerald-400/20 rounded-3xl p-2 shadow-2xl hover:border-emerald-400/40 transition-all duration-300">
                  <div className="flex items-center gap-3 px-4">
                    <Youtube className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 py-4 focus:outline-none text-[15px]"
                    />
                    <button
                      onClick={handleStartChat}
                      disabled={!youtubeUrl.trim()}
                      className="relative group w-12 h-12 flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 group-hover:scale-110 transition-transform duration-300"></div>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <ArrowRight className="w-6 h-6 text-slate-950" strokeWidth={2.5} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Ask questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Get summaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Find timestamps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Header with glassmorphism */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-slate-900/60 border-b border-emerald-500/10 shadow-xl">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-6 h-6 text-slate-950" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  YouTube AI Chat
                </h1>
                <p className="text-sm text-slate-400 truncate max-w-md">{youtubeUrl}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setChatStarted(false);
                setYoutubeUrl('');
                setMessages([]);
                setInput('');
              }}
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-800/50"
            >
              New Video
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 group ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              style={{
                animation: 'fadeIn 0.5s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'backwards'
              }}
            >
              <div className={`flex-shrink-0 ${message.sender === 'user' ? 'mt-1' : 'mt-0'}`}>
                {message.sender === 'user' ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl blur opacity-40"></div>
                    <div className="relative w-10 h-10 bg-slate-800 border border-emerald-400/30 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`flex-1 ${message.sender === 'user' ? 'flex justify-end' : ''}`}>
                <div
                  className={`inline-block max-w-[85%] rounded-2xl px-5 py-3 shadow-xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white'
                      : 'bg-slate-800/80 backdrop-blur-sm text-slate-100 border border-emerald-400/20'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 animate-fadeIn">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl blur opacity-40"></div>
                  <div className="relative w-10 h-10 bg-slate-800 border border-emerald-400/30 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm border border-emerald-400/20 rounded-2xl px-5 py-4 shadow-xl">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area with glassmorphism */}
      <div className="sticky bottom-0 backdrop-blur-xl bg-slate-900/80 border-t border-emerald-500/10 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
            <div className="relative flex gap-3 items-end bg-slate-800/80 backdrop-blur-sm border border-emerald-400/20 rounded-3xl p-2 shadow-2xl hover:border-emerald-400/40 transition-all duration-300">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about the video..."
                rows="1"
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 px-4 py-3 focus:outline-none resize-none max-h-40 text-[15px]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="relative group w-11 h-11 flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
                </div>
              </button>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-3">AI can make mistakes. Consider checking important information.</p>
        </div>
      </div>

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
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 3px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}