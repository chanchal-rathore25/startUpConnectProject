import React, { useRef, useState } from "react";
import { Pencil, Save, X, Rocket, IndianRupee, Users, FileText, Upload, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../api/api1";

const STAGES = ["Idea", "Pre-seed", "Seed", "Series A", "Series B+"];

export default function FounderProfile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    startupName: user.startupName || "",
    tagline: user.tagline || "",
    stage: user.stage || "Idea",
    fundingAsk: user.fundingAsk || "",
    teamSize: user.teamSize || 1,
    pitchDeckName: user.pitchDeckName || null,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(user.id, form);
      updateProfile(form);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      startupName: user.startupName || "",
      tagline: user.tagline || "",
      stage: user.stage || "Idea",
      fundingAsk: user.fundingAsk || "",
      teamSize: user.teamSize || 1,
      pitchDeckName: user.pitchDeckName || null,
    });
    setEditing(false);
  };

  const handleDeckUpload = (e) => {
    const file = e.target.files?.[0];
    // Demo ke liye sirf naam store ho raha hai — real backend me file ko
    // S3/Cloudinary pe upload karo aur wapas mile URL ko save karo.
    if (file) setForm((f) => ({ ...f, pitchDeckName: file.name }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Rocket size={16} className="text-amber-500" />
            Startup profile
          </h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              <Pencil size={14} />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg disabled:opacity-60"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Startup name</label>
            {editing ? (
              <input
                value={form.startupName}
                onChange={(e) => setForm((f) => ({ ...f, startupName: e.target.value }))}
                placeholder="e.g. Nimbus AI"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
            ) : (
              <p className="text-sm text-gray-900 font-medium">{form.startupName || "—"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stage</label>
            {editing ? (
              <div className="grid grid-cols-3 gap-1.5">
                {STAGES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, stage: s }))}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      form.stage === s
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <span className="inline-block px-2.5 py-1 text-xs font-medium text-amber-600 bg-amber-50 rounded-full">
                {form.stage}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
          {editing ? (
            <input
              value={form.tagline}
              onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              placeholder="One line jo aapki startup ko describe kare"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
            />
          ) : (
            <p className="text-sm text-gray-600">{form.tagline || "Abhi tak koi tagline nahi hai."}</p>
          )}
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Funding ask</label>
            {editing ? (
              <div className="relative">
                <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={form.fundingAsk}
                  onChange={(e) => setForm((f) => ({ ...f, fundingAsk: e.target.value }))}
                  placeholder="e.g. ₹2Cr for 15% equity"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <IndianRupee size={14} className="text-gray-400" />
                {form.fundingAsk || "—"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Team size</label>
            {editing ? (
              <div className="relative">
                <Users size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  value={form.teamSize}
                  onChange={(e) => setForm((f) => ({ ...f, teamSize: Number(e.target.value) }))}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <Users size={14} className="text-gray-400" />
                {form.teamSize} {form.teamSize === 1 ? "person" : "people"}
              </p>
            )}
          </div>
        </div>

        {/* Pitch deck */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pitch deck</label>
          <div className="flex items-center gap-3">
            {form.pitchDeckName ? (
              <span className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg">
                <FileText size={15} className="text-amber-500" />
                {form.pitchDeckName}
                {editing && (
                  <button onClick={() => setForm((f) => ({ ...f, pitchDeckName: null }))} aria-label="Remove deck">
                    <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </span>
            ) : (
              <span className="text-sm text-gray-400">Koi pitch deck upload nahi hua.</span>
            )}
            {editing && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                >
                  <Upload size={14} />
                  {form.pitchDeckName ? "Replace" : "Upload"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  onChange={handleDeckUpload}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}