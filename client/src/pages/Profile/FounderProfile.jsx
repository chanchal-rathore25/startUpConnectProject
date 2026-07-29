import React, { useRef, useState } from "react";
import { Pencil, Save, X, Rocket, IndianRupee, Users, FileText, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { uploadPitchDeck } from "../../api/api1";

const STAGES = ["Idea", "Pre-seed", "Seed", "Series A", "Series B+"];

export default function FounderProfile() {
  const { user, token, updateProfile, setUserFromServer } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingDeck, setUploadingDeck] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    startupName: user.startupName || "",
    tagline: user.tagline || "",
    stage: user.stage || "Idea",
    fundingAsk: user.fundingAsk || "",
    teamSize: user.teamSize || 1,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Seedha backend PATCH /api/users/me ko hit karta hai (AuthContext.updateProfile)
      await updateProfile(form);
      setEditing(false);
      toast.success("Profile update ho gayi ✅");
    } catch (err) {
      toast.error(err.message || "Save nahi ho paaya.");
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
    });
    setEditing(false);
  };

  const handleDeckUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDeck(true);
    setUploadError("");
    try {
      // Real backend call — /api/users/me/pitch-deck pe multipart upload, Cloudinary pe store hota hai
      const { user: updatedUser } = await uploadPitchDeck(file, token);
      setUserFromServer(updatedUser);
      toast.success("Pitch deck upload ho gaya ✅");
    } catch (err) {
      setUploadError(err.message || "Pitch deck upload fail ho gaya.");
      toast.error(err.message || "Pitch deck upload fail ho gaya.");
    } finally {
      setUploadingDeck(false);
      e.target.value = "";
    }
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

        {/* Pitch deck — upload hote hi seedha backend pe save hota hai */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pitch deck</label>
          <div className="flex items-center gap-3 flex-wrap">
            {user.pitchDeckName ? (
              <a
                href={user.pitchDeckUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:border-amber-200 transition-colors"
              >
                <FileText size={15} className="text-amber-500" />
                {user.pitchDeckName}
              </a>
            ) : (
              <span className="text-sm text-gray-400">Koi pitch deck upload nahi hua.</span>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              disabled={uploadingDeck}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 disabled:opacity-60"
            >
              <Upload size={14} />
              {uploadingDeck ? "Uploading..." : user.pitchDeckName ? "Replace" : "Upload"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.ppt,.pptx"
              onChange={handleDeckUpload}
              className="hidden"
            />
          </div>
          {uploadError && <p className="mt-1.5 text-xs text-red-500">{uploadError}</p>}
          <p className="mt-1.5 text-xs text-gray-400">PDF, PPT ya PPTX — max 15MB.</p>
        </div>
      </div>
    </div>
  );
}