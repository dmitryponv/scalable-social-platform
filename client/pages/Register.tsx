import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import GoogleOAuthButton from "../components/GoogleOAuthButton";
import Header from "../components/Header";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Registration failed");
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
      <Header />

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <Sparkles className="w-12 h-12 mx-auto text-purple-600" />
              <h1 className="text-4xl font-black gradient-primary-text">
                Create Your Account
              </h1>
              <p className="text-gray-600 font-semibold">
                Join our vibrant community and start sharing
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4 text-sm text-red-700 font-semibold">
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-bold text-gray-900"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-white border-2 border-purple-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-gray-900"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full bg-white border-2 border-pink-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-gray-900"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 8 characters"
                    className="w-full bg-white border-2 border-cyan-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-bold text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full bg-white border-2 border-orange-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                  "Creating Account..."
                ) : (
                  <>
                    Create Account
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm font-semibold">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:underline transition-all"
                >
                  Sign In
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
                    Secure Password Storage
                  </p>
                  <p className="text-xs text-gray-500">
                    Encrypted and securely stored
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Session Cookies
                  </p>
                  <p className="text-xs text-gray-500">
                    Secure encrypted sessions
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
