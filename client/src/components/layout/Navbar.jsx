import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Rocket, Menu, X, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
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
          <button aria-label="Search" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Search size={18} />
          </button>

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