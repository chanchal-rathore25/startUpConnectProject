import React from "react";
import { Navigate, Link } from "react-router-dom";
import { Mail, Calendar, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DeveloperProfile from "./DeveloperProfile";
import FounderProfile from "./FounderProfile";
import InvestorProfile from "./InvestorProfile";

const ROLE_LABEL = { developer: "Developer", founder: "Founder", investor: "Investor" };
const ROLE_BADGE = {
  developer: "bg-indigo-50 text-indigo-600",
  founder: "bg-amber-50 text-amber-600",
  investor: "bg-emerald-50 text-emerald-600",
};

export default function Profile() {
  const { user, logout } = useAuth();

  // Login nahi hai to seedha login page pe bhej do
  if (!user) return <Navigate to="/login" replace />;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Common profile header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xl font-semibold shrink-0">
                {user.initials}
              </span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <p className="mt-1 text-sm text-gray-500 flex items-center gap-1.5">
                  <Mail size={14} />
                  {user.email}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${ROLE_BADGE[user.role]}`}>
                    {ROLE_LABEL[user.role]}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    Member since {memberSince}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>

        {/* Role-specific section */}
        <div className="mt-6">
          {user.role === "developer" && <DeveloperProfile />}
          {user.role === "founder" && <FounderProfile />}
          {user.role === "investor" && <InvestorProfile />}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Kuch aur explore karna hai?{" "}
          <Link to="/jobs" className="text-indigo-600 font-medium">
            Jobs dekho
          </Link>{" "}
          ya{" "}
          <Link to="/startups" className="text-indigo-600 font-medium">
            Startups browse karo
          </Link>
          .
        </p>
      </div>
    </div>
  );
}