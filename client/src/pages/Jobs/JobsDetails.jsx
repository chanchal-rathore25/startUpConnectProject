import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
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
  X,
  FileText,
  Send,
} from "lucide-react";
import { fetchJobById, applyToJob, toggleSaveJob } from "../../api/api1";
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

/* ============================= Apply Modal ============================= */
function ApplyModal({ job, onClose, onSubmit, submitting, resumeUrl, resumeName }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ coverLetter, expectedSalary });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Apply to {job.title}</h2>
            <p className="text-xs text-gray-500">{job.company}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Resume — profile se aata hai, yahan sirf preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume</label>
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors"
              >
                <FileText size={16} className="text-indigo-600 shrink-0" />
                {resumeName}
              </a>
            ) : (
              <p className="text-sm text-red-500">
                Koi resume upload nahi hai.{" "}
                <Link to="/profile" className="font-medium underline">
                  Profile me jaake upload karo
                </Link>
                .
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Bataiye is role ke liye aap kyun fit ho..."
              rows={5}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected salary</label>
            <div className="relative">
              <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="e.g. ₹12L per annum"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !resumeUrl}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60"
          >
            <Send size={15} />
            {submitting ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============================= Job Details ============================= */
export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchJobById(id, token)
      .then((data) => {
        if (!cancelled) {
          setJob(data);
          setApplied(!!data.appliedByMe);
        }
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
  }, [id, token]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.error("Save karne ke liye pehle login karo.");
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }
    if (saving) return;
    setSaving(true);
    setJob((j) => ({ ...j, savedByMe: !j.savedByMe })); // optimistic
    try {
      const { saved } = await toggleSaveJob(id, token);
      toast.success(saved ? "Job saved ❤️" : "Job unsaved");
    } catch (err) {
      setJob((j) => ({ ...j, savedByMe: !j.savedByMe })); // rollback
      toast.error(err.message || "Kuch gadbad ho gayi.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenApply = () => {
    if (!user) {
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }
    setShowApplyModal(true);
  };

  const handleSubmitApplication = async ({ coverLetter, expectedSalary }) => {
    setApplying(true);
    try {
      const { applicants } = await applyToJob(id, { coverLetter, expectedSalary }, token);
      setApplied(true);
      setJob((j) => ({ ...j, applicants }));
      setShowApplyModal(false);
      toast.success("Application bhej di gayi ✅");
    } catch (err) {
      if (err.message?.toLowerCase().includes("already")) {
        setApplied(true);
        setShowApplyModal(false);
      } else {
        toast.error(err.message || "Apply nahi ho paaya. Dobara try karo.");
      }
    } finally {
      setApplying(false);
    }
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
                onClick={handleToggleSave}
                disabled={saving}
                aria-label="Save job"
                className={`p-2.5 rounded-lg border transition-colors disabled:opacity-50 ${
                  job.savedByMe
                    ? "text-indigo-600 bg-indigo-50 border-indigo-200"
                    : "text-gray-400 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Bookmark size={18} fill={job.savedByMe ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Link copy ho gaya");
                }}
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
              onClick={handleOpenApply}
              disabled={applied}
              className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-lg transition-colors disabled:opacity-70 ${
                applied ? "bg-emerald-50 text-emerald-600 cursor-default" : "bg-indigo-600 text-white hover:bg-indigo-700"
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

      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleSubmitApplication}
          submitting={applying}
          resumeUrl={user?.resumeUrl}
          resumeName={user?.resumeName}
        />
      )}
    </div>
  );
}