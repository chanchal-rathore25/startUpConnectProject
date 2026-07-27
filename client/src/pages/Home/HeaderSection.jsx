import React from 'react'
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function HeaderSection({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        {eyebrow && <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">{eyebrow}</p>}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {action && (
        <Link to={action.href} className="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:gap-2 transition-all">
          {action.label}
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}


export default HeaderSection
