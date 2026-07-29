import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Rocket, Menu, X, User, LayoutDashboard, LogOut, ChevronDown, MessageCircle, Bell, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { fetchConversations, fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../../api/api1";

const ROLE_LABEL = {
  developer: "Developer",
  founder: "Founder",
  investor: "Investor",
};

const ROLE_BADGE_COLOR = {
  developer: "bg-indigo-50 text-indigo-600",
  founder: "bg-amber-50 text-amber-600",
  investor: "bg-emerald-50 text-emerald-600",
};

function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-semibold">
          {user.initials || <User size={15} />}
        </span>
        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[110px] truncate">
          {user.name}
        </span>
        <ChevronDown size={15} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-40 animate-[fadeIn_0.12s_ease-out]">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <span
              className={`inline-block mt-2 px-2 py-0.5 text-[11px] font-medium rounded-full ${ROLE_BADGE_COLOR[user.role]}`}
            >
              {ROLE_LABEL[user.role]}
            </span>
          </div>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User size={16} className="text-gray-400" />
            View Profile
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LayoutDashboard size={16} className="text-gray-400" />
            Dashboard
          </Link>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotificationBell() {
  const { token } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef(null);

  const loadNotifications = () => {
    if (!token) return;
    fetchNotifications(token)
      .then((data) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadNotifications();
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    const handleNew = (notif) => {
      setNotifications((prev) => [notif, ...prev].slice(0, 30));
      setUnreadCount((c) => c + 1);
    };
    socket.on("notification:new", handleNew);
    return () => socket.off("notification:new", handleNew);
  }, [socket]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenNotification = async (notif) => {
    if (!notif.read) {
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
      markNotificationRead(notif.id, token).catch(() => {});
    }
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead(token);
    } catch {
      // ignore — next open will resync
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-40 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                <Check size={12} />
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400 text-center">Koi notification nahi hai.</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleOpenNotification(n)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                  !n.read ? "bg-indigo-50/40" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                    {n.message && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>}
                    <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NavSearch() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate(`/jobs?search=${encodeURIComponent(value.trim())}`);
    setOpen(false);
    setValue("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
      >
        <Search size={18} />
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full pl-3 pr-1 py-1"
    >
      <Search size={15} className="text-gray-400 shrink-0" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => !value && setOpen(false)}
        placeholder="Search jobs, skills, location..."
        className="w-44 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-400"
      />
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close search"
        className="p-1 rounded-full hover:bg-gray-200"
      >
        <X size={13} className="text-gray-400" />
      </button>
    </form>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, token, logout } = useAuth();
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = () => {
    if (!token) return;
    fetchConversations(token)
      .then((data) => setUnreadCount(data.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)))
      .catch(() => {});
  };

  useEffect(() => {
    refreshUnreadCount();
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message:new", refreshUnreadCount);
    socket.on("conversation:updated", refreshUnreadCount);
    return () => {
      socket.off("message:new", refreshUnreadCount);
      socket.off("conversation:updated", refreshUnreadCount);
    };
  }, [socket, token]);
  const navigate = useNavigate();

  const links = [
    { label: "Home", href: "/" },
    { label: "Startups", href: "/startups" },
    { label: "Jobs", href: "/jobs" },
    { label: "About", href: "/about" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/" className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <Rocket size={18} />
          </Link>
          <Link to="/" className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            StartupConnect
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              to={l.href}
              key={l.href}
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <NavSearch />

          {user && <NotificationBell />}

          {user && (
            <Link
              to="/chat"
              aria-label="Messages"
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <MessageCircle size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <ProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-gray-700" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-1 bg-white">
          {links.map((l) => (
            <Link
              to={l.href}
              key={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {l.label}
            </Link>
          ))}

          {user ? (
            <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-2 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-[11px] font-semibold">
                  {user.initials}
                </span>
                {user.name}
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <span className="flex items-center gap-2.5">
                  <MessageCircle size={16} className="text-gray-400" />
                  Messages
                </span>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2.5 px-2 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2 mt-2 border-t border-gray-100">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;