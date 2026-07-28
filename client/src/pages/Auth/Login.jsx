

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Rocket, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

/**
 * StartupConnect — Login Page
 * -------------------------------------------------
 * login() AuthContext se aata hai, jo services/api.js ke loginUser()
 * ko call karta hai. Abhi mock backend hai (localStorage), real MERN
 * backend real hai — login() seedha /api/auth/login ko hit karta hai.
 * -------------------------------------------------
 */
export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      toast.success(`Welcome back, ${loggedInUser.name.split(" ")[0]} 👋`);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Kuch gadbad ho gayi. Dobara try karo.");
      toast.error(err.message || "Login fail ho gaya.");
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
          <h1 className="text-xl font-bold text-gray-900 text-center">Log in to your account</h1>
          <p className="mt-1 text-sm text-gray-500 text-center">Welcome back. Enter your details to continue.</p>

          {error && (
            <div className="mt-4 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-medium hover:text-indigo-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}