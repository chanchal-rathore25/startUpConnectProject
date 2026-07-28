import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

/**
 * StartupConnect — Signup Page
 * -------------------------------------------------
 * signup() AuthContext se aata hai (services/api.js -> signupUser()).
 * Role (developer / founder / investor) yahin decide hota hai, aur
 * usi ke hisaab se Navbar + Profile page render hote hain.
 * -------------------------------------------------
 */
const ROLES = [
  { value: "developer", label: "Developer" },
  { value: "founder", label: "Founder" },
  { value: "investor", label: "Investor" },
];

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "developer" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account ban gaya 🎉");
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message || "Kuch gadbad ho gayi. Dobara try karo.");
      toast.error(err.message || "Signup fail ho gaya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <Rocket size={18} />
          </span>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            StartupConnect
          </span>
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 text-center">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500 text-center">Join as a developer, founder, or investor.</p>

          {error && (
            <div className="mt-4 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                    className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                      form.role === r.value
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Chanchal Sharma"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}