import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Users,
  Heart,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchStartups } from "../../api/api.js";

const INDUSTRIES = [
  "All",
  "AI / SaaS",
  "CleanTech",
  "Dev Tools",
  "FinTech",
  "HealthTech",
  "E-commerce",
];

function StartupCard({ startup }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300">

      {/* Top gradient */}
      <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-500" />

      <div className="p-5 -mt-8">

        {/* Logo + Save */}
        <div className="flex items-start justify-between">

          <span className="flex items-center justify-center w-14 h-14 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-900 font-bold text-sm">
            {startup.name?.slice(0, 2).toUpperCase()}
          </span>

          <button
            onClick={() => setSaved((s) => !s)}
            aria-label="Save startup"
            className={`mt-8 p-2 rounded-full transition-colors ${
              saved
                ? "text-red-500 bg-red-50"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            <Heart
              size={17}
              fill={saved ? "currentColor" : "none"}
            />
          </button>

        </div>

        {/* Startup name */}
        <h3 className="mt-3 font-semibold text-gray-900">
          {startup.name}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {startup.tagline}
        </p>

        {/* Industry + Stage */}
        <div className="mt-4 flex items-center gap-3 flex-wrap text-xs">

          <span className="px-2 py-1 font-medium text-indigo-600 bg-indigo-50 rounded-full">
            {startup.industry}
          </span>

          <span className="px-2 py-1 font-medium text-gray-600 bg-gray-100 rounded-full">
            {startup.stage}
          </span>

        </div>

        {/* Location + Team */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">

          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {startup.location}
          </span>

          <span className="flex items-center gap-1">
            <Users size={12} />
            {startup.teamSize || startup.team || "N/A"}
          </span>

        </div>

        {/* Details Button */}
        <Link
          to={`/startups/${startup._id}`}
          className="mt-4 block text-center text-sm font-medium text-white bg-gray-900 group-hover:bg-indigo-600 rounded-lg py-2 transition-colors"
        >
          View Profile
        </Link>

      </div>
    </div>
  );
}

export default function Startups() {

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [activeIndustry, setActiveIndustry] = useState("All");

  // Fetch startups from backend
  useEffect(() => {

    const loadStartups = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await fetchStartups();

        console.log("Startups received:", data);

        setStartups(data || []);

      } catch (err) {

        console.error("Failed to fetch startups:", err);

        setError("Failed to load startups.");

      } finally {

        setLoading(false);

      }

    };

    loadStartups();

  }, []);

  // Search + industry filter
  const filtered = startups.filter((startup) => {

    const matchesIndustry =
      activeIndustry === "All" ||
      startup.industry === activeIndustry;

    const matchesSearch =
      startup.name
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      startup.tagline
        ?.toLowerCase()
        .includes(query.toLowerCase());

    return matchesIndustry && matchesSearch;

  });

  // Loading state
  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <div className="text-center">

          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading startups...
          </p>

        </div>

      </div>
    );

  }

  // Error state
  if (error) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <div className="text-center">

          <p className="text-red-500 font-medium">
            {error}
          </p>

          <p className="text-gray-500 text-sm mt-2">
            Please make sure your backend server is running.
          </p>

        </div>

      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO / HEADER ================= */}

      <section className="bg-white border-b border-gray-100">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Discover startups building the future
          </h1>

          <p className="mt-2 text-gray-500">
            {startups.length} startups actively hiring and raising
          </p>

          {/* Search */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">

            <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-600/30">

              <Search
                size={18}
                className="text-gray-400 shrink-0"
              />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search startups..."
                className="w-full text-sm text-gray-900 placeholder-gray-400 outline-none"
              />

            </div>

            <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:border-gray-300">

              <SlidersHorizontal size={16} />

              Filters

            </button>

          </div>

          {/* Industry filters */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">

            {INDUSTRIES.map((industry) => (

              <button
                key={industry}
                onClick={() => setActiveIndustry(industry)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  activeIndustry === industry
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {industry}
              </button>

            ))}

          </div>

        </div>

      </section>


      {/* ================= STARTUP CARDS ================= */}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {filtered.length > 0 ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((startup) => (

              <StartupCard
                key={startup._id}
                startup={startup}
              />

            ))}

          </div>

        ) : (

          <div className="text-center py-20">

            <TrendingUp
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-gray-500">
              No startups match your search.
            </p>

          </div>

        )}

      </section>

    </div>

  );
}