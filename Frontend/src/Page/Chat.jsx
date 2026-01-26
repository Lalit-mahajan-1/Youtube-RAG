import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const Chat = () => {
  const { id, VideoId } = useParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_ML_API}/chat-history/${id}/${VideoId}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    fetchChatHistory();
  }, [id, VideoId]);

  // Initialize YouTube Player
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player("player", {
        height: "100%",
        width: "100%",
        videoId: VideoId,
        playerVars: { playsinline: 1 },
      });
    };
  }, [VideoId]);

  // Send message handler
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_ML_API}/chat/${id}/${VideoId}`,
        { Query: userMsg.content },
        { withCredentials: true }
      );
      const aiMsg = { role: "ai", content: res.data };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "An unexpected error occurred." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Video Chat Assistant
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                Video #{VideoId}
              </span>
              <span>Ask anything about this video</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Video Player - Larger Width */}
          <div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl sticky top-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden w-full">
                <div id="player" className="w-full h-full"></div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <Message key={idx} message={msg} index={idx} />
                  ))}
                </AnimatePresence>

                {loading && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-white/10 p-4 bg-white/5">
                <form onSubmit={sendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the video..."
                    disabled={loading}
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl px-6 py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2"
                  >
                    <SendRoundedIcon className="text-xl" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Message Component
const Message = ({ message, index }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-purple-500"
            : "bg-gradient-to-br from-emerald-500 to-teal-500"
        } shadow-lg`}
      >
        {isUser ? (
          <PersonOutlineOutlinedIcon className="text-xl" />
        ) : (
          <SmartToyOutlinedIcon className="text-xl" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[80%] ${
          isUser
            ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30"
            : "bg-white/5 border-white/10"
        } border rounded-2xl px-4 py-3 shadow-lg`}
      >
        <p className="text-sm leading-relaxed text-gray-100">
          {message.content}
        </p>
      </div>
    </motion.div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
        <SmartToyOutlinedIcon className="text-xl" />
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 shadow-lg">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;