import React from 'react'
import {
  Search,
  Rocket,
  Briefcase,
  Users,
  Code2,
  TrendingUp,
  MapPin,
  ArrowRight,
  UserPlus,
  Building2,
  Handshake,
} from "lucide-react";
import { Link } from "react-router-dom";

function Hero({FEATURED_STARTUPS}) {
  return (
    <section className="relative bg-white border-b border-gray-100 overflow-hidden">
      <style>{`
        @keyframes blob-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.97); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-blob-1 { animation: blob-float 9s ease-in-out infinite; }
        .hero-blob-2 { animation: blob-float 11s ease-in-out infinite reverse; }
        .hero-fade-1 { animation: fade-in-up 0.7s ease both; }
        .hero-fade-2 { animation: fade-in-up 0.7s ease 0.12s both; }
        .hero-fade-3 { animation: fade-in-up 0.7s ease 0.24s both; }
        .hero-fade-4 { animation: fade-in-up 0.7s ease 0.36s both; }
        .hero-fade-5 { animation: fade-in-up 0.7s ease 0.48s both; }
      `}</style>

      {/* animated background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-100/60 blur-3xl hero-blob-1" />
      <div className="pointer-events-none absolute top-10 -right-16 w-80 h-80 rounded-full bg-purple-100/60 blur-3xl hero-blob-2" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="hero-fade-1 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Where startups meet{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">talent and investment</span>
          </h1>
          <p className="hero-fade-2 mt-4 text-base sm:text-lg text-gray-500 max-w-md">
            Connect with founders, developers, and investors building the next big thing — all in one place.
          </p>

          <div className="hero-fade-3 mt-7 max-w-md">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-600/30 focus-within:border-indigo-600 transition-shadow">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input type="text" placeholder="Search startups, jobs, or investors..." className="w-full text-sm text-gray-900 placeholder-gray-400 outline-none" />
            </div>
          </div>

          <div className="hero-fade-4 mt-6 flex flex-col sm:flex-row gap-3">
            <Link to="/signup" className="text-center px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5">
              Join StartupConnect
            </Link>
            <Link to="/startups" className="text-center px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg transition-all hover:-translate-y-0.5">
              Explore Startups
            </Link>
          </div>

          <div className="hero-fade-5 mt-10 flex items-center gap-8">
            <div className="flex items-center gap-2"><Rocket size={16} className="text-indigo-600" /><span className="text-sm text-gray-500"><span className="font-semibold text-gray-900">500+</span> Startups</span></div>
            <div className="flex items-center gap-2"><Briefcase size={16} className="text-indigo-600" /><span className="text-sm text-gray-500"><span className="font-semibold text-gray-900">2,000+</span> Jobs</span></div>
            <div className="flex items-center gap-2"><Users size={16} className="text-indigo-600" /><span className="text-sm text-gray-500"><span className="font-semibold text-gray-900">100+</span> Investors</span></div>
          </div>
        </div>

        <div className="hero-fade-3 hidden md:block">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3 shadow-sm">
            {FEATURED_STARTUPS.slice(0, 2).map((s) => (
              <div key={s.name} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-sm">{s.initials}</span>
                <div><p className="text-sm font-semibold text-gray-900">{s.name}</p><p className="text-xs text-gray-500">{s.tagline}</p></div>
              </div>
            ))}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 text-purple-600"><TrendingUp size={18} /></span>
              <div><p className="text-sm font-semibold text-gray-900">₹2.4Cr raised this week</p><p className="text-xs text-gray-500">Across 12 startups on the platform</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero
