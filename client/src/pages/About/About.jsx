import React from "react";
import {
  Rocket,
  Target,
  Users,
  Sparkles,
  // Linkedin,
  // Twitter,
  Building2,
  Briefcase,
  Handshake,
} from "lucide-react";

/**
 * StartupConnect — About Page
 * -------------------------------------------------
 * Mostly static/marketing content — no backend needed
 * beyond maybe GET /api/stats for live numbers.
 * -------------------------------------------------
 */

const STATS = [
  { label: "Startups listed", value: "500+" },
  { label: "Jobs posted", value: "2,000+" },
  { label: "Active investors", value: "100+" },
  { label: "Successful hires", value: "1,200+" },
];

const VALUES = [
  {
    icon: Target,
    title: "Focused on outcomes",
    desc: "We measure success by real hires, real funding conversations, and real startups that grow — not vanity metrics.",
  },
  {
    icon: Users,
    title: "Built for every side of the table",
    desc: "Developers, founders, and investors all have different needs. We design for each, not a one-size-fits-all feed.",
  },
  {
    icon: Sparkles,
    title: "Quality over noise",
    desc: "Every startup and job listing is reviewed before it goes live, so you're never wading through spam.",
  },
];

const TEAM = [
  { name: "Aditi Rao", role: "Co-founder & CEO", initials: "AR" },
  { name: "Karan Mehta", role: "Co-founder & CTO", initials: "KM" },
  { name: "Sana Iqbal", role: "Head of Product", initials: "SI" },
  { name: "Rohan Verma", role: "Head of Growth", initials: "RV" },
];

const AUDIENCES = [
  { icon: Briefcase, title: "For Developers", desc: "Skip the mass job boards. Find roles at startups that are actually hiring and actually building." },
  { icon: Building2, title: "For Founders", desc: "List your startup once, get discovered by talent and investors who care about early-stage companies." },
  { icon: Handshake, title: "For Investors", desc: "See traction signals — hiring velocity, team growth, and engagement — before anyone else does." },
];

function StatCard({ stat }) {
  return (
    <>
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
      <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
    </div>
    </>
  );
}

function ValueCard({ value }) {
  const Icon = value.icon;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 mb-4">
        <Icon size={20} />
      </span>
      <p className="font-semibold text-gray-900">{value.title}</p>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{value.desc}</p>
    </div>
  );
}

function TeamCard({ member }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-semibold text-lg">
        {member.initials}
      </div>
      <p className="mt-3 font-semibold text-gray-900 text-sm">{member.name}</p>
      <p className="text-xs text-gray-500">{member.role}</p>
      <div className="mt-2 flex items-center justify-center gap-2 text-gray-400">
        <a href="#" aria-label="LinkedIn" className="hover:text-indigo-600">Linkedin</a>
        <a href="#" aria-label="Twitter" className="hover:text-indigo-600">Twitter</a>
      </div>
    </div>
  );
}

function AudienceCard({ item }) {
  const Icon = item.icon;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 hover:shadow-sm transition-all">
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-4">
        <Icon size={22} />
      </span>
      <p className="font-semibold text-gray-900">{item.title}</p>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* <Navbar role="guest" /> */}

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white mb-5">
            <Rocket size={22} />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            We're building the place where startups actually happen
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            StartupConnect exists because finding the right startup job,
            the right hire, or the right early-stage bet shouldn't take
            weeks of scattered searching across ten different platforms.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-white border border-gray-200 rounded-2xl p-8">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">Our story</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why we started StartupConnect</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            We watched too many talented developers overlook great early-stage
            startups simply because they never showed up on the job boards
            they were checking. At the same time, founders were spending more
            time chasing candidates on generic platforms than actually building
            their product.
          </p>
          <p>
            On the other end, investors were relying on cold intros and
            spreadsheets to track which startups were gaining real momentum —
            hiring, shipping, growing — long before that showed up in a pitch deck.
          </p>
          <p>
            StartupConnect brings all three sides onto one platform, with a
            home experience built around what each of them actually needs to
            see first.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2 text-center">Who it's for</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">One platform, three journeys</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {AUDIENCES.map((item) => (
            <AudienceCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2 text-center">What we believe</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How we build this platform</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {VALUES.map((value) => (
            <ValueCard key={value.title} value={value} />
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2 text-center">The team</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">People behind StartupConnect</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Want to be part of it?</h2>
          <p className="mt-2 text-gray-500">Join as a developer, founder, or investor — it's free.</p>
          <a
            href="/signup"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Create free account
          </a>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <Rocket size={14} />
            </span>
            <span className="text-sm font-semibold text-gray-700">StartupConnect</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 StartupConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}