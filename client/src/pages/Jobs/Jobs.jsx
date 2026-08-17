import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  SlidersHorizontal,
  Building2,
  IndianRupee,
  Users,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { fetchJobs, toggleSaveJob } from "../../api/api1";
import { useAuth } from "../../context/AuthContext";

const JOB_TYPES = ["All", "Full-time", "Part-time", "Internship"];
const MODES = ["All", "Remote", "Hybrid", "On-site"];
const SALARY_OPTIONS = [
  { label: "Any salary", value: "" },
  { label: "₹5L+", value: "5" },
  { label: "₹10L+", value: "10" },
  { label: "₹15L+", value: "15" },
];
const EXPERIENCE_OPTIONS = [
  { label: "Any experience", value: "" },
  { label: "Fresher", value: "0" },
  { label: "1+ years", value: "1" },
  { label: "3+ years", value: "3" },
  { label: "5+ years", value: "5" },
];

/* Facebook-style shimmer skeleton */
function ShimmerStyles() {
  return (
    <style>{`
      @keyframes sc-shimmer {
        0% { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      .sc-shimmer {
        background: linear-gradient(90deg, #f1f5f9 25%, #e9edf3 37%, #f1f5f9 63%);
        background-size: 800px 100%;
        animation: sc-shimmer 1.4s ease-in-out infinite;
      }
    `}</style>
  );
}

function JobCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg sc-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 rounded sc-shimmer" />
          <div className="h-3 w-1/2 rounded sc-shimmer" />
        </div>
      </div>
      <div className="mt-5 h-3 w-full rounded sc-shimmer" />
      <div className="mt-2 h-3 w-3/4 rounded sc-shimmer" />
      <div className="mt-5 flex gap-2">
        <div className="h-5 w-16 rounded-full sc-shimmer" />
        <div className="h-5 w-16 rounded-full sc-shimmer" />
      </div>
    </div>
  );
}

function JobCard({ job, onOpen, onToggleSave }) {
  const [saving, setSaving] = useState(false);

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    await onToggleSave(job);
    setSaving(false);
  };

  return (
    <div
      onClick={() => onOpen(job.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(job.id)}
      className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br ${job.logoColor || "from-indigo-500 to-indigo-600"} text-white font-semibold text-sm shrink-0`}
          >
            {job.logo}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
              {job.title}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
              <Building2 size={13} className="shrink-0" />
              {job.company}
            </p>
          </div>
        </div>
        <button
          onClick={handleSaveClick}
          aria-label="Save job"
          disabled={saving}
          className={`p-2 rounded-full transition-colors shrink-0 disabled:opacity-50 ${
            job.savedByMe ? "text-indigo-600 bg-indigo-50" : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          <Bookmark size={18} fill={job.savedByMe ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 flex-wrap text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin size={13} />
          {job.location} · {job.mode}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} />
          {job.type}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-700">
        <IndianRupee size={13} />
        {job.salary}
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {job.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>Posted {job.posted}</span>
          <span className="flex items-center gap-1">
            <Users size={12} />
            {job.applicants}
          </span>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-1.5 transition-all">
          View
          <ArrowUpRight size={14} />
        </span>
      </div>
    </div>
  );
}

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const query = searchParams.get("search") || "";
  const activeType = searchParams.get("type") || "All";
  const activeMode = searchParams.get("mode") || "All";
  const minSalary = searchParams.get("minSalary") || "";
  const minExperience = searchParams.get("minExperience") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [localQuery, setLocalQuery] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === "" || value === "All" || value === undefined) next.delete(key);
      else next.set(key, value);
    });
    if (!("page" in patch)) next.delete("page"); // filter badalne pe page 1 pe reset
    setSearchParams(next);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchJobs({ query, type: activeType, mode: activeMode, minSalary, minExperience, page, limit: 9 }, token)
      .then((data) => {
        if (!cancelled) {
          setJobs(data.jobs);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Jobs load nahi ho paaye.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, activeType, activeMode, minSalary, minExperience, page, token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: localQuery });
  };

  const handleOpenJob = (id) => navigate(`/jobs/${id}`);

  const handleToggleSave = useCallback(
    async (job) => {
      if (!user) {
        toast.error("Save karne ke liye pehle login karo.");
        navigate("/login", { state: { from: "/jobs" } });
        return;
      }
      // Optimistic UI update
      setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, savedByMe: !j.savedByMe } : j)));
      try {
        const { saved } = await toggleSaveJob(job.id, token);
        toast.success(saved ? "Job saved ❤️" : "Job unsaved");
      } catch (err) {
        // Rollback on failure
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, savedByMe: job.savedByMe } : j)));
        toast.error(err.message || "Kuch gadbad ho gayi.");
      }
    },
    [user, token, navigate]
  );

  const activeFilterCount = [activeType !== "All", activeMode !== "All", !!minSalary, !!minExperience].filter(
    Boolean
  ).length;

  const clearFilters = () => updateParams({ type: "All", mode: "All", minSalary: "", minExperience: "" });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <ShimmerStyles />

      {/* Page header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Find your next role at a growing startup
          </h1>
          <p className="mt-2 text-gray-500">
            {loading ? "Loading open positions…" : `${total} open positions from vetted startups on StartupConnect`}
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-600/30 focus-within:border-indigo-600">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search by title, company, skill, or location..."
                className="w-full text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalQuery("");
                    updateParams({ search: "" });
                  }}
                  aria-label="Clear search"
                >
                  <X size={15} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-full transition-colors ${
                showFilters || activeFilterCount > 0
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                  : "text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-indigo-600 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </form>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => updateParams({ type })}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  activeType === type
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Work mode</label>
                <div className="flex flex-wrap gap-1.5">
                  {MODES.map((m) => (
                    <button
                      key={m}
                      onClick={() => updateParams({ mode: m })}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                        activeMode === m
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Minimum salary</label>
                <select
                  value={minSalary}
                  onChange={(e) => updateParams({ minSalary: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30"
                >
                  {SALARY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Minimum experience</label>
                <select
                  value={minExperience}
                  onChange={(e) => updateParams({ minExperience: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30"
                >
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="sm:col-span-3 text-left text-xs font-medium text-red-500 hover:text-red-600"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Job grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <JobCard key={job.id}  onOpen={handleOpenJob} onToggleSave={handleToggleSave} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1.5">
                <button
                  onClick={() => updateParams({ page: Math.max(1, page - 1) })}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParams({ page: p })}
                    className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                      p === page
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => updateParams({ page: Math.min(totalPages, page + 1) })}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Briefcase size={32} className="mx-auto text-gray-300" />
            <p className="mt-3 text-gray-500">No jobs match your search.</p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}