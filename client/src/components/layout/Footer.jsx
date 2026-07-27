import React, { useState } from "react";
import {
  Rocket,
  Mail,
  ArrowRight,
  Send,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
/**
 * StartupConnect — Footer
 * -------------------------------------------------
 * Newsletter form should POST to:
 *   POST /api/newsletter/subscribe  { email }
 * -------------------------------------------------
 */

const FOOTER_LINKS = {
  Product: [
    { label: "Browse Startups", href: "/startups" },
    { label: "Find Jobs", href: "/jobs" },
    { label: "For Investors", href: "/investors" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Help Center", href: "/help" },
    { label: "Startup Guide", href: "/guide" },
    { label: "API Docs", href: "/docs" },
    { label: "Community", href: "/community" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

// const SOCIALS = [
//   { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
//   { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
//   { icon: Github, href: "https://github.com", label: "GitHub" },
//   { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
// ];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Replace with real call:
    // await fetch("/api/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) })
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative bg-gray-950 text-gray-400 overflow-hidden">
      <style>{`
        @keyframes footer-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes footer-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .footer-shimmer-bar {
          background: linear-gradient(90deg, transparent, #6366f1, #a855f7, #6366f1, transparent);
          background-size: 200% 100%;
          animation: footer-shimmer 6s linear infinite;
        }
        .footer-orb {
          animation: footer-float 6s ease-in-out infinite;
        }
        .footer-link {
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .footer-link:hover {
          color: #fff;
          transform: translateX(3px);
        }
        .footer-social {
          transition: all 0.25s ease;
        }
        .footer-social:hover {
          transform: translateY(-3px) scale(1.08);
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          color: #fff;
        }
      `}</style>

      {/* animated top border */}
      <div className="h-[2px] w-full footer-shimmer-bar" />

      {/* decorative glow orbs */}
      <div className="pointer-events-none absolute -top-10 left-10 w-56 h-56 rounded-full bg-indigo-600/10 blur-3xl footer-orb" />
      <div
        className="pointer-events-none absolute top-20 right-10 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl footer-orb"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        {/* Newsletter */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-12 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-white">Stay in the loop</h3>
            <p className="mt-1 text-sm text-gray-400 max-w-sm">
              Get the best new startups, jobs, and funding news — once a week, no spam.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full lg:w-auto gap-2 max-w-md">
            <div className="flex-1 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-2.5 focus-within:border-indigo-500 transition-colors">
              <Mail size={16} className="text-gray-500 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors shrink-0"
            >
              {subscribed ? "Subscribed" : "Subscribe"}
              {!subscribed && <Send size={14} />}
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12">
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-sm font-semibold text-white mb-4">{section}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link text-sm text-gray-400 inline-flex items-center gap-1">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Rocket size={16} />
            </span>
            <span className="text-sm font-semibold text-white">StartupConnect</span>
          </a>

          <p className="text-xs text-gray-500 order-3 sm:order-2">
            © 2026 StartupConnect. All rights reserved.
          </p>

          {/* <div className="flex items-center gap-2 order-2 sm:order-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="footer-social flex items-center justify-center w-9 h-9 rounded-full bg-gray-900 text-gray-400 border border-gray-800"
              >
                <Icon size={15} />
              </a>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
}