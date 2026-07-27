import React from 'react'
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function StartupCard({ startup }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-sm shrink-0">{startup.initials}</span>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{startup.name}</p>
          <p className="text-xs text-gray-500">{startup.industry}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{startup.tagline}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={12} />{startup.location}</span>
        <Link to="/startups" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">View profile</Link>
      </div>
    </div>
  );
}

export default StartupCard
