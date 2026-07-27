import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Rocket,
  Briefcase,
  Users,
  Code2,
  TrendingUp,
  MapPin,
  UserPlus,
  Building2,
  Handshake,
} from "lucide-react";

import { Link } from "react-router-dom";
import RoleCard from "./RoleCard";
import Hero from "./Hero";
import JobCard from "./JobCard";
import StartupCard from "./StartupCard";
import HeaderSection from "./HeaderSection";
import Reveal from "./Reveal";
import { FEATURED_STARTUPS } from "../../Data/featuredStartUps";
import { LATEST_JOBS } from "../../Data/latestJobs";
import { ROLES } from "../../Data/roles";
/**
 * StartupConnect — Guest Home Page (animated)
 * -------------------------------------------------
 * Data below is placeholder — replace with:
 *   GET /api/startups?featured=true
 *   GET /api/jobs?limit=3
 * -------------------------------------------------
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Hero FEATURED_STARTUPS={FEATURED_STARTUPS} />
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Reveal><HeaderSection eyebrow="Built for" title="Whoever you are, there's a place for you" /></Reveal>
        <div className="grid sm:grid-cols-3 gap-5">
          {ROLES.map((role, i) => (
            <Reveal key={role.title} delay={i * 100}>
              <RoleCard role={role} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <Reveal><HeaderSection eyebrow="Trending" title="Featured startups" action={{ label: "View all", href: "/startups" }} /></Reveal>
        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURED_STARTUPS.map((s, i) => (
            <Reveal key={s.name} delay={i * 100}>
              <StartupCard startup={s} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Reveal><HeaderSection eyebrow="Hiring now" title="Latest jobs" action={{ label: "View all", href: "/jobs" }} /></Reveal>
        <div className="grid sm:grid-cols-3 gap-5">
          {LATEST_JOBS.map((job, i) => (
            <Reveal key={job.title} delay={i * 100}>
              <JobCard job={job} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Ready to get started?</h2>
            <p className="mt-2 text-gray-500">Create your free account in less than a minute.</p>
            <Link to="/signup" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5">
              <UserPlus size={16} />
              Create free account
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}