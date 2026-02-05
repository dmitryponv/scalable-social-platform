import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import GoogleOAuthButton from "../components/GoogleOAuthButton";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      navigate("/feed");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col">
      {/* Navigation */}
      <nav className="border-b-2 border-purple-200 bg-white/80 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="gradient-primary w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">C</span>
              </div>
              <span className="font-black text-2xl gradient-primary-text hidden sm:inline">
                Connect
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <Sparkles className="w-12 h-12 mx-auto text-pink-600" />
              <h1 className="text-4xl font-black gradient-primary-text">
                Welcome Back
              </h1>
              <p className="text-gray-600 font-semibold">
                Sign in to your account and share your story
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4 text-sm text-red-700 font-semibold">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-gray-900"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full bg-white border-2 border-purple-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-gray-900"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600 hover:underline transition-all"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full bg-white border-2 border-pink-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-social-primary py-3 justify-center font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* OAuth Button */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-purple-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 text-gray-600 font-bold">
                    Or continue with
                  </span>
                </div>
              </div>
              <GoogleOAuthButton />
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:underline transition-all"
                >
                  Create one
                </Link>
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-3 bg-white border-2 border-purple-200 rounded-3xl p-5 shadow-lg">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider">
                Security
              </p>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Secure Login
                  </p>
                  <p className="text-xs text-gray-500">Encrypted end-to-end</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Session Tokens
                  </p>
                  <p className="text-xs text-gray-500">
                    Secure cookie sessions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
