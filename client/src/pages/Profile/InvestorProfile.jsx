import React, { useState } from "react";
import { Pencil, Save, X, Landmark, IndianRupee, TrendingUp, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../api/api1";

const SECTOR_OPTIONS = [
  "Fintech",
  "AI/ML",
  "Climate Tech",
  "SaaS",
  "Consumer",
  "Healthtech",
  "Edtech",
  "D2C",
];

export default function InvestorProfile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firmName: user.firmName || "",
    checkSize: user.checkSize || "",
    sectors: user.sectors || [],
    thesis: user.thesis || "",
    investmentsCount: user.investmentsCount || 0,
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
      firmName: user.firmName || "",
      checkSize: user.checkSize || "",
      sectors: user.sectors || [],
      thesis: user.thesis || "",
      investmentsCount: user.investmentsCount || 0,
    });
    setEditing(false);
  };

  const toggleSector = (sector) => {
    setForm((f) => ({
      ...f,
      sectors: f.sectors.includes(sector) ? f.sectors.filter((s) => s !== sector) : [...f.sectors, sector],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Landmark size={16} className="text-emerald-500" />
            Investor profile
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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Firm name</label>
            {editing ? (
              <input
                value={form.firmName}
                onChange={(e) => setForm((f) => ({ ...f, firmName: e.target.value }))}
                placeholder="e.g. Sequoia, or Angel (Individual)"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
              />
            ) : (
              <p className="text-sm text-gray-900 font-medium">{form.firmName || "—"}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Typical check size</label>
            {editing ? (
              <div className="relative">
                <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={form.checkSize}
                  onChange={(e) => setForm((f) => ({ ...f, checkSize: e.target.value }))}
                  placeholder="e.g. ₹25L – ₹1Cr"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <IndianRupee size={14} className="text-gray-400" />
                {form.checkSize || "—"}
              </p>
            )}
          </div>
        </div>

        {/* Sectors */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sectors of interest</label>
          {editing ? (
            <div className="flex flex-wrap gap-2">
              {SECTOR_OPTIONS.map((sector) => (
                <button
                  key={sector}
                  type="button"
                  onClick={() => toggleSector(sector)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    form.sectors.includes(sector)
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {form.sectors.length > 0 ? (
                form.sectors.map((s) => (
                  <span key={s} className="px-2.5 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">Koi sector select nahi kiya gaya.</span>
              )}
            </div>
          )}
        </div>

        {/* Thesis */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Investment thesis</label>
          {editing ? (
            <textarea
              value={form.thesis}
              onChange={(e) => setForm((f) => ({ ...f, thesis: e.target.value }))}
              placeholder="Kis tarah ki startups me invest karna pasand karte ho..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
            />
          ) : (
            <p className="text-sm text-gray-600">{form.thesis || "Abhi tak koi thesis nahi likha gaya."}</p>
          )}
        </div>

        {/* Portfolio count */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-gray-400" />
            Portfolio companies
          </label>
          {editing ? (
            <input
              type="number"
              min={0}
              value={form.investmentsCount}
              onChange={(e) => setForm((f) => ({ ...f, investmentsCount: Number(e.target.value) }))}
              className="w-32 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
            />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{form.investmentsCount}</p>
          )}
        </div>
      </div>
    </div>
  );
}