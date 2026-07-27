import React from 'react'
import {MapPin} from "lucide-react";
import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <p className="font-semibold text-gray-900">{job.title}</p>
      <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
      <span className="flex items-center gap-1 text-xs text-gray-400 mt-2"><MapPin size={12} />{job.location}</span>
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {job.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">{tag}</span>
        ))}
      </div>
      <Link to="/jobs" className="mt-4 block text-center text-sm font-medium text-indigo-600 border border-indigo-100 hover:bg-indigo-50 rounded-lg py-2 transition-colors">View details</Link>
    </div>
  );
}

export default JobCard
