import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  Building2,
  CheckCircle2,
  Bookmark,
  Share2,
  Globe,
  Calendar,
  BriefcaseBusiness,
} from "lucide-react";
import { fetchJobById } from "../../api/api1";
import { useAuth } from "../../context/AuthContext";

function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      <div className="h-4 w-24 bg-gray-100 rounded mb-6" />
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-1/2 bg-gray-100 rounded" />
            <div className="h-4 w-1/3 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchJobById(id)
      .then((data) => {
        if (!cancelled) setJob(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Job load nahi ho payi.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleApply = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setApplied(true);
  };

  if (loading) return <DetailSkeleton />;

  if (error || !job) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <BriefcaseBusiness size={32} className="mx-auto text-gray-300" />
        <p className="mt-3 text-gray-500">{error || "Job nahi mili."}</p>
        <Link to="/jobs" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← Back to all jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to all jobs
        </button>

        {/* Header card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <span
                className={`flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${job.logoColor || "from-indigo-500 to-indigo-600"} text-white font-bold text-lg shrink-0`}
              >
                {job.logo}
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="mt-1 text-sm text-gray-500 flex items-center gap-1.5">
                  <Building2 size={14} />
                  {job.company}
                </p>
                <div className="mt-3 flex items-center gap-4 flex-wrap text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {job.location} · {job.mode}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IndianRupee size={14} />
                    {job.salary}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSaved((s) => !s)}
                aria-label="Save job"
                className={`p-2.5 rounded-lg border transition-colors ${
                  saved ? "text-indigo-600 bg-indigo-50 border-indigo-200" : "text-gray-400 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              </button>
              <button
                aria-label="Share job"
                className="p-2.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4 flex-wrap text-xs text-gray-400">
            <span>Posted {job.posted}</span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {job.applicants} applicants
            </span>
          </div>

          <div className="mt-5 flex items-center gap-2 flex-wrap">
            {job.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleApply}
              disabled={applied}
              className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-lg transition-colors ${
                applied
                  ? "bg-emerald-50 text-emerald-600 cursor-default"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {applied ? "✓ Application sent" : "Apply now"}
            </button>
            {!user && (
              <p className="mt-2 text-xs text-gray-400">
                Apply karne ke liye pehle{" "}
                <Link to="/login" className="text-indigo-600 font-medium">
                  login
                </Link>{" "}
                karo.
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-base font-semibold text-gray-900">About the role</h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-base font-semibold text-gray-900">Responsibilities</h2>
              <ul className="mt-3 space-y-2.5">
                {job.responsibilities?.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <h2 className="text-base font-semibold text-gray-900">Requirements</h2>
              <ul className="mt-3 space-y-2.5">
                {job.requirements?.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {job.perks?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
                <h2 className="text-base font-semibold text-gray-900">Perks & benefits</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.perks.map((p) => (
                    <span key={p} className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-900">About {job.company}</h2>
              <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">{job.about}</p>
              <div className="mt-4 space-y-2.5 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <Users size={14} className="text-gray-400" />
                  {job.companyInfo?.size}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  Founded {job.companyInfo?.founded}
                </p>
                <p className="flex items-center gap-2">
                  <Globe size={14} className="text-gray-400" />
                  {job.companyInfo?.website}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
              <p className="text-sm font-semibold">Experience level</p>
              <p className="mt-1 text-lg font-bold">{job.experience}</p>
              <div className="mt-4 pt-4 border-t border-white/20 text-sm">
                <p className="opacity-80">Salary range</p>
                <p className="font-semibold">{job.salary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}