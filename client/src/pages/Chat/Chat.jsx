import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Send, ArrowLeft, MessageSquarePlus, X, Circle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { fetchConversations, startConversation, fetchMessages, searchUsers } from "../../api/api1";

const ROLE_BADGE = {
  developer: "bg-indigo-50 text-indigo-600",
  founder: "bg-amber-50 text-amber-600",
  investor: "bg-emerald-50 text-emerald-600",
};

function timeAgo(date) {
  if (!date) return "";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NewChatModal({ token, onClose, onStart }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      setSearching(true);
      searchUsers(query, token)
        .then((data) => setResults(data.users))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, token]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">New conversation</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-2">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full text-sm bg-transparent outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {searching && <p className="p-4 text-sm text-gray-400">Searching...</p>}
          {!searching && query && results.length === 0 && (
            <p className="p-4 text-sm text-gray-400">Koi user nahi mila.</p>
          )}
          {results.map((u) => (
            <button
              key={u.id}
              onClick={() => onStart(u.id)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-semibold shrink-0">
                {u.initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                <span className={`inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded-full ${ROLE_BADGE[u.role]}`}>
                  {u.role}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { user, token } = useAuth();
  const { socket, onlineUserIds } = useSocket();
  const navigate = useNavigate();
  const { conversationId: activeIdFromUrl } = useParams();

  const [conversations, setConversations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draft, setDraft] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Conversation list load karo
  useEffect(() => {
    if (!token) return;
    setLoadingList(true);
    fetchConversations(token)
      .then((data) => setConversations(data.conversations))
      .catch((err) => toast.error(err.message || "Conversations load nahi ho payi."))
      .finally(() => setLoadingList(false));
  }, [token]);

  // URL me conversation id ho to us thread ko open karo
  useEffect(() => {
    if (activeIdFromUrl && conversations.length > 0) {
      const found = conversations.find((c) => c.id === activeIdFromUrl);
      if (found) setActiveConversation(found);
    }
  }, [activeIdFromUrl, conversations]);

  // Active conversation ke messages fetch karo + socket room join karo
  useEffect(() => {
    if (!activeConversation || !token) return;
    setLoadingMessages(true);
    fetchMessages(activeConversation.id, token)
      .then((data) => setMessages(data.messages))
      .catch((err) => toast.error(err.message || "Messages load nahi ho paaye."))
      .finally(() => setLoadingMessages(false));

    socket?.emit("conversation:join", activeConversation.id);

    setConversations((prev) => prev.map((c) => (c.id === activeConversation.id ? { ...c, unreadCount: 0 } : c)));

    return () => socket?.emit("conversation:leave", activeConversation.id);
  }, [activeConversation, token, socket]);

  // Real-time incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (activeConversation && msg.conversationId === activeConversation.id) {
        setMessages((prev) => [...prev, msg]);
      }
      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? {
                ...c,
                lastMessage: msg.text,
                lastMessageAt: msg.createdAt,
                unreadCount:
                  activeConversation?.id === msg.conversationId || msg.sender === user.id
                    ? c.unreadCount
                    : (c.unreadCount || 0) + 1,
              }
            : c
        )
      );
    };

    const handleConversationUpdated = ({ conversationId, lastMessage, lastMessageAt }) => {
      setConversations((prev) =>
        prev.some((c) => c.id === conversationId)
          ? prev.map((c) => (c.id === conversationId ? { ...c, lastMessage, lastMessageAt } : c))
          : prev
      );
    };

    const handleTypingStart = ({ conversationId, userId }) => {
      if (activeConversation?.id === conversationId) {
        setTypingUsers((prev) => new Set(prev).add(userId));
      }
    };
    const handleTypingStop = ({ conversationId, userId }) => {
      if (activeConversation?.id === conversationId) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:updated", handleConversationUpdated);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:updated", handleConversationUpdated);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, activeConversation, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeConversation) return;
    socket?.emit("message:send", { conversationId: activeConversation.id, text: draft.trim() }, (res) => {
      if (res?.error) toast.error(res.error);
    });
    socket?.emit("typing:stop", { conversationId: activeConversation.id });
    setDraft("");
  };

  const handleDraftChange = (e) => {
    setDraft(e.target.value);
    if (!activeConversation) return;
    socket?.emit("typing:start", { conversationId: activeConversation.id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("typing:stop", { conversationId: activeConversation.id });
    }, 1500);
  };

  const handleStartNewChat = async (userId) => {
    try {
      const { id, otherUser } = await startConversation(userId, token);
      const newConv = { id, otherUser, lastMessage: "", lastMessageAt: new Date().toISOString(), unreadCount: 0 };
      setConversations((prev) => (prev.some((c) => c.id === id) ? prev : [newConv, ...prev]));
      setActiveConversation(newConv);
      setShowNewChat(false);
      navigate(`/chat/${id}`);
    } catch (err) {
      toast.error(err.message || "Conversation start nahi ho payi.");
    }
  };

  const isOtherOnline = activeConversation && onlineUserIds.has(String(activeConversation.otherUser?.id));
  const isOtherTyping = activeConversation && typingUsers.size > 0;

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 flex">
      {/* Conversation list */}
      <div
        className={`w-full sm:w-80 shrink-0 bg-white border-r border-gray-200 flex-col ${
          activeConversation ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Messages</h1>
          <button
            onClick={() => setShowNewChat(true)}
            aria-label="New conversation"
            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50"
          >
            <MessageSquarePlus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-400">Koi conversation nahi hai abhi.</p>
              <button
                onClick={() => setShowNewChat(true)}
                className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Naya message shuru karo
              </button>
            </div>
          ) : (
            conversations.map((c) => {
              const online = onlineUserIds.has(String(c.otherUser?.id));
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveConversation(c);
                    navigate(`/chat/${c.id}`);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left ${
                    activeConversation?.id === c.id ? "bg-indigo-50/60" : ""
                  }`}
                >
                  <div className="relative shrink-0">
                    <span className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-semibold">
                      {c.otherUser?.initials || "?"}
                    </span>
                    {online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{c.otherUser?.name}</p>
                      <span className="text-[11px] text-gray-400 shrink-0">{timeAgo(c.lastMessageAt)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-gray-500 truncate">{c.lastMessage || "Say hi 👋"}</p>
                      {c.unreadCount > 0 && (
                        <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-indigo-600 rounded-full shrink-0">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Message thread */}
      <div className={`flex-1 flex-col ${activeConversation ? "flex" : "hidden sm:flex"}`}>
        {!activeConversation ? (
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <div>
              <MessageSquarePlus size={32} className="mx-auto text-gray-300" />
              <p className="mt-3 text-sm text-gray-400">Chat karne ke liye ek conversation select karo</p>
            </div>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 bg-white">
              <button
                onClick={() => setActiveConversation(null)}
                className="sm:hidden p-1.5 -ml-1.5 text-gray-500"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-semibold shrink-0">
                {activeConversation.otherUser?.initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{activeConversation.otherUser?.name}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  {isOtherTyping ? (
                    <span className="text-indigo-500 font-medium">typing...</span>
                  ) : isOtherOnline ? (
                    <>
                      <Circle size={7} className="fill-emerald-500 text-emerald-500" />
                      Online
                    </>
                  ) : (
                    "Offline"
                  )}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {loadingMessages ? (
                <p className="text-center text-sm text-gray-400 mt-10">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-sm text-gray-400 mt-10">Koi message nahi hai abhi. Say hi 👋</p>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender === user.id;
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-br-md"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{m.text}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? "text-white/70" : "text-gray-400"}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white">
              <input
                value={draft}
                onChange={handleDraftChange}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send"
                className="p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>

      {showNewChat && (
        <NewChatModal token={token} onClose={() => setShowNewChat(false)} onStart={handleStartNewChat} />
      )}
    </div>
  );
}
