import React from 'react'
import {ArrowRight} from "lucide-react";
import { Link } from "react-router-dom";

function RoleCard({ role }) {
  const Icon = role.icon;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-4">
        <Icon size={22} />
      </span>
      <p className="font-semibold text-gray-900">{role.title}</p>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{role.desc}</p>
      <Link to="/signup" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:gap-2 transition-all">
        {role.cta}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}


export default RoleCard
