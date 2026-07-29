import React, { useRef, useState } from "react";
import { Pencil, Save, X, Plus, Github, Globe, FileText, Upload, Trash2, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { uploadResume } from "../../api/api1";

export default function DeveloperProfile() {
  const { user, token, updateProfile, setUserFromServer } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    bio: user.bio || "",
    github: user.github || "",
    portfolio: user.portfolio || "",
    skills: user.skills || [],
    experience: user.experience || [],
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Ye seedha backend PATCH /api/users/me ko hit karta hai (AuthContext.updateProfile)
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
      bio: user.bio || "",
      github: user.github || "",
      portfolio: user.portfolio || "",
      skills: user.skills || [],
      experience: user.experience || [],
    });
    setEditing(false);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput("");
  };

  const removeSkill = (s) => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }));

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    setUploadError("");
    try {
      // Real backend call — file multipart/form-data se /api/users/me/resume pe jaati hai,
      // backend Cloudinary pe upload karta hai, DB me sirf URL save hota hai.
      const { user: updatedUser } = await uploadResume(file, token);
      setUserFromServer(updatedUser);
      toast.success("Resume upload ho gaya ✅");
    } catch (err) {
      setUploadError(err.message || "Resume upload fail ho gaya.");
      toast.error(err.message || "Resume upload fail ho gaya.");
    } finally {
      setUploadingResume(false);
      e.target.value = ""; // taaki wahi file dobara select ho sake to bhi onChange fire ho
    }
  };

  const addExperience = () => {
    setForm((f) => ({
      ...f,
      experience: [...f.experience, { role: "", company: "", duration: "" }],
    }));
  };

  const updateExperience = (idx, key, value) => {
    setForm((f) => {
      const next = [...f.experience];
      next[idx] = { ...next[idx], [key]: value };
      return { ...f, experience: next };
    });
  };

  const removeExperience = (idx) =>
    setForm((f) => ({ ...f, experience: f.experience.filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Developer profile</h2>
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

        {/* Bio */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">About</label>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Apne baare me likho — kya build karte ho, kis me interested ho..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
            />
          ) : (
            <p className="text-sm text-gray-600">{form.bio || "Abhi tak koi bio nahi likha gaya."}</p>
          )}
        </div>

        {/* Skills */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills</label>
          <div className="flex items-center gap-2 flex-wrap">
            {form.skills.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full"
              >
                {s}
                {editing && (
                  <button onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                    <X size={12} />
                  </button>
                )}
              </span>
            ))}
            {form.skills.length === 0 && !editing && (
              <span className="text-sm text-gray-400">Koi skills add nahi ki gayi.</span>
            )}
          </div>
          {editing && (
            <div className="mt-2 flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="e.g. React, Node.js"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
              <button
                onClick={addSkill}
                type="button"
                className="px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub</label>
            {editing ? (
              <div className="relative">
                <Github size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={form.github}
                  onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                  placeholder="github.com/username"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <Github size={14} className="text-gray-400" />
                {form.github || "—"}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Portfolio</label>
            {editing ? (
              <div className="relative">
                <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={form.portfolio}
                  onChange={(e) => setForm((f) => ({ ...f, portfolio: e.target.value }))}
                  placeholder="yourportfolio.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <Globe size={14} className="text-gray-400" />
                {form.portfolio || "—"}
              </p>
            )}
          </div>
        </div>

        {/* Resume — upload hote hi seedha backend pe save hota hai */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume</label>
          <div className="flex items-center gap-3 flex-wrap">
            {user.resumeName ? (
              <a
                href={user.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors"
              >
                <FileText size={15} className="text-indigo-600" />
                {user.resumeName}
              </a>
            ) : (
              <span className="text-sm text-gray-400">Koi resume upload nahi hua.</span>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              disabled={uploadingResume}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 disabled:opacity-60"
            >
              <Upload size={14} />
              {uploadingResume ? "Uploading..." : user.resumeName ? "Replace" : "Upload"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </div>
          {uploadError && <p className="mt-1.5 text-xs text-red-500">{uploadError}</p>}
          <p className="mt-1.5 text-xs text-gray-400">PDF, DOC ya DOCX — max 5MB.</p>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase size={16} className="text-gray-400" />
            Experience
          </h2>
          {editing && (
            <button
              onClick={addExperience}
              type="button"
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              <Plus size={14} />
              Add
            </button>
          )}
        </div>

        {form.experience.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">Abhi tak koi experience add nahi kiya.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {form.experience.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                {editing ? (
                  <div className="flex-1 grid sm:grid-cols-3 gap-2">
                    <input
                      value={exp.role}
                      onChange={(e) => updateExperience(idx, "role", e.target.value)}
                      placeholder="Role"
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30"
                    />
                    <input
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, "company", e.target.value)}
                      placeholder="Company"
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30"
                    />
                    <input
                      value={exp.duration}
                      onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                      placeholder="e.g. 2023 – Present"
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{exp.role || "—"}</p>
                    <p className="text-xs text-gray-500">
                      {exp.company} {exp.duration && `· ${exp.duration}`}
                    </p>
                  </div>
                )}
                {editing && (
                  <button onClick={() => removeExperience(idx)} aria-label="Remove experience">
                    <Trash2 size={15} className="text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}