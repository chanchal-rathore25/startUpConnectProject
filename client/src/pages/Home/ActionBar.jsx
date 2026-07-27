import { useState } from "react";
import { applyToStartup, toggleSaveStartup } from "../../api/api.js";;

const ActionBar = ({ startupId }) => {
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleSave = async () => {
    const next = !saved;
    setSaved(next); // optimistic UI
    try {
      await toggleSaveStartup(startupId, next);
    } catch (err) {
      setSaved(!next); // revert on failure
      console.error("Save failed", err);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToStartup(startupId);
      setApplied(true);
    } catch (err) {
      console.error("Apply failed", err);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="action-bar">
      <button className="btn btn-apply" onClick={handleApply} disabled={applying || applied}>
        {applied ? "Applied ✓" : applying ? "Applying..." : "Apply Now"}
      </button>
      <button className={`btn btn-save ${saved ? "saved" : ""}`} onClick={handleSave}>
        <span className="heart">{saved ? "❤️" : "🤍"}</span>
        <span>{saved ? "Saved" : "Save Startup"}</span>
      </button>
    </div>
  );
};

export default ActionBar;
