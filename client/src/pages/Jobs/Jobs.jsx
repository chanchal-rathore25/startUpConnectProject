import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { fetchJobs } from "../../api/api1";

const JOB_TYPES = ["All", "Full-time", "Part-time", "Internship"];

function JobCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="mt-5 h-3 w-full bg-gray-100 rounded" />
      <div className="mt-2 h-3 w-3/4 bg-gray-100 rounded" />
      <div className="mt-5 flex gap-2">
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

function JobCard({ job, onOpen }) {
  const [saved, setSaved] = useState(false);

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
          onClick={(e) => {
            e.stopPropagation();
            setSaved((s) => !s);
          }}
          aria-label="Save job"
          className={`p-2 rounded-full transition-colors shrink-0 ${
            saved ? "text-indigo-600 bg-indigo-50" : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
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
  const [activeType, setActiveType] = useState("All");
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchJobs({ query, type: activeType })
      .then((data) => {
        if (!cancelled) setJobs(data);
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
  }, [query, activeType]);

  const handleOpenJob = (id) => navigate(`/jobs/${id}`);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Page header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Find your next role at a growing startup
          </h1>
          <p className="mt-2 text-gray-500">
            {loading ? "Loading open positions…" : `${jobs.length} open positions from vetted startups on StartupConnect`}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-600/30 focus-within:border-indigo-600">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or company..."
                className="w-full text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:border-gray-300 transition-colors">
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
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
        </div>
      </section>

      {/* Job grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onOpen={handleOpenJob} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Briefcase size={32} className="mx-auto text-gray-300" />
            <p className="mt-3 text-gray-500">No jobs match your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}