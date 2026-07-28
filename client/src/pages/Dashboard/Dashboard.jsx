import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Briefcase,
  Bookmark,
  Sparkles,
  Clock,
  MapPin,
  IndianRupee,
  ArrowUpRight,
  CircleCheck,
  Rocket,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchDashboard } from "../../api/api1";

function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="h-8 w-72 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-96 bg-gray-100 rounded mb-8" />
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white border border-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-white border border-gray-200 rounded-xl" />
          <div className="h-64 bg-white border border-gray-200 rounded-xl" />
        </div>
        <div className="h-80 bg-white border border-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

function ProfileCompletionRing({ percent }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{percent}%</span>
      </div>
    </div>
  );
}

function MiniJobRow({ job, rightSlot }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="flex items-center gap-3 py-3 group hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
    >
      <span
        className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${job.logoColor || "from-indigo-500 to-indigo-600"} text-white font-semibold text-xs shrink-0`}
      >
        {job.logo}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
          {job.title}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate">
          <MapPin size={11} />
          {job.company} · {job.location}
        </p>
      </div>
      {rightSlot}
      <ArrowUpRight size={15} className="text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0" />
    </Link>
  );
}

const EMPTY_STATE_TEXT = {
  applied: "Abhi tak koi job apply nahi ki. Jobs browse karo aur apply shuru karo!",
  saved: "Koi job save nahi ki. Job cards pe ❤️ dabao taaki baad me dekh sako.",
  recommended: "Recommendations abhi generate ho rahe hain — profile complete karo behtar suggestions ke liye.",
  recent: "Abhi koi naya job post nahi hua.",
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchDashboard(token)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Dashboard load nahi ho paaya.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-red-500">{error || "Kuch gadbad ho gayi."}</p>
      </div>
    );
  }

  const firstName = data.name?.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Welcome banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
          <div className="relative z-10">
            <p className="text-sm font-medium text-white/80">{greeting},</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold flex items-center gap-2">
              {firstName} <span>👋</span>
            </h1>
            <p className="mt-2 text-sm text-white/80 max-w-md">
              Yahan aapki activity, saved jobs aur recommendations ka ek jagah overview hai.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-white/10" />
        </div>

        {/* Stats row */}
        <div className="mt-6 grid sm:grid-cols-3 gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Briefcase size={20} />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.stats.appliedCount}</p>
              <p className="text-xs text-gray-500">Jobs applied</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-purple-50 text-purple-600 shrink-0">
              <Bookmark size={20} />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.stats.savedCount}</p>
              <p className="text-xs text-gray-500">Jobs saved</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <CircleCheck size={20} />
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.profileCompletion}%</p>
              <p className="text-xs text-gray-500">Profile complete</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applied jobs */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase size={16} className="text-indigo-500" />
                  Applied Jobs
                </h2>
                <Link to="/jobs" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  Browse more
                </Link>
              </div>
              {data.appliedJobs.length === 0 ? (
                <p className="mt-4 text-sm text-gray-400">{EMPTY_STATE_TEXT.applied}</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {data.appliedJobs.map((job) => (
                    <MiniJobRow
                      key={job.id}
                      job={job}
                      rightSlot={
                        <span className="px-2 py-0.5 text-[11px] font-medium text-indigo-600 bg-indigo-50 rounded-full shrink-0 capitalize">
                          {job.status}
                        </span>
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recommended jobs */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-amber-500" />
                Recommended for you
              </h2>
              {data.recommendedJobs.length === 0 ? (
                <p className="mt-4 text-sm text-gray-400">{EMPTY_STATE_TEXT.recommended}</p>
              ) : (
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  {data.recommendedJobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="group border border-gray-100 rounded-lg p-3.5 hover:border-indigo-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br ${job.logoColor || "from-indigo-500 to-indigo-600"} text-white text-[10px] font-semibold shrink-0`}
                        >
                          {job.logo}
                        </span>
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600">
                          {job.title}
                        </p>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                        <IndianRupee size={11} />
                        {job.salary}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Saved startups — placeholder until Startups module is wired to backend */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-1">
                <Rocket size={16} className="text-purple-500" />
                Saved & Recommended Startups
              </h2>
              <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Startup save/recommend backend se connect nahi hai abhi.{" "}
                  <Link to="/startups" className="text-indigo-600 font-medium">
                    Startups browse karo
                  </Link>{" "}
                  yahan se, ya bata do to isko bhi wire kar dete hain.
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Profile completion */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Profile completion</h2>
              <ProfileCompletionRing percent={data.profileCompletion} />
              <p className="mt-4 text-xs text-gray-500">
                {data.profileCompletion < 100
                  ? "Profile complete karke behtar matches paao."
                  : "Profile poori tarah complete hai! 🎉"}
              </p>
              <Link
                to="/profile"
                className="mt-4 inline-block w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Edit profile
              </Link>
            </div>

            {/* Saved jobs */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-1">
                <Bookmark size={15} className="text-purple-500" />
                Saved Jobs
              </h2>
              {data.savedJobs.length === 0 ? (
                <p className="mt-3 text-xs text-gray-400">{EMPTY_STATE_TEXT.saved}</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {data.savedJobs.map((job) => (
                    <MiniJobRow key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent jobs */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-1">
                <Clock size={15} className="text-gray-400" />
                Recent Jobs
              </h2>
              {data.recentJobs.length === 0 ? (
                <p className="mt-3 text-xs text-gray-400">{EMPTY_STATE_TEXT.recent}</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {data.recentJobs.map((job) => (
                    <MiniJobRow key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
