import React, { useState } from "react";
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
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #ecf9ff 100%)",
      }}
    >
      {/* Navigation */}
      <nav
        className="border-b-2 border-purple-200 bg-white shadow-lg"
        style={{ backdropFilter: "blur(20px)", opacity: 0.8 }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem" }}>
          <div
            className="flex items-center justify-between"
            style={{ height: "4rem" }}
          >
            <Link to="/" className="flex items-center gap-3">
              <div className="gradient-primary w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                <span
                  className="text-white font-bold"
                  style={{ fontSize: "1.125rem", fontWeight: 900 }}
                >
                  C
                </span>
              </div>
              <span className="font-bold text-2xl gradient-primary-text hidden sm:inline">
                Connect
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Header */}
            <div
              className="text-center"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <Sparkles
                className="w-12 h-12 mx-auto"
                style={{ color: "#db2777" }}
              />
              <h1 className="text-4xl font-bold gradient-primary-text">
                Welcome Back
              </h1>
              <p className="text-gray-600 font-semibold">
                Sign in to your account and share your story
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {error && (
                <div
                  style={{
                    background: "#fee2e2",
                    border: "2px solid #fca5a5",
                    borderRadius: "1rem",
                    padding: "1rem",
                    fontSize: "0.875rem",
                    color: "#b91c1c",
                    fontWeight: 600,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-gray-900"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 w-5 h-5"
                    style={{ transform: "translateY(-50%)", color: "#a855f7" }}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full bg-white border-2 border-purple-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900"
                    style={{ placeholderColor: "#9ca3af" }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-gray-900"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold"
                    style={{
                      background: "linear-gradient(90deg, #be123c, #dc2626)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 w-5 h-5"
                    style={{ transform: "translateY(-50%)", color: "#ec4899" }}
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full bg-white border-2 border-pink-200 rounded-2xl pl-12 pr-4 py-3 text-gray-900"
                    style={{ placeholderColor: "#9ca3af" }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-social-primary py-3 font-bold text-lg"
                style={{
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      className="w-5 h-5"
                      style={{ marginLeft: "0.5rem" }}
                    />
                  </>
                )}
              </button>
            </form>

            {/* OAuth Button */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ width: "100%", borderTop: "2px solid #e9d5ff" }}
                  ></div>
                </div>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                  }}
                >
                  <span
                    className="px-2 font-bold text-gray-600"
                    style={{
                      background:
                        "linear-gradient(135deg, #faf5ff, #fdf2f8, #ecf9ff)",
                    }}
                  >
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
                  className="font-bold"
                  style={{
                    background: "linear-gradient(90deg, #9333ea, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Create one
                </Link>
              </p>
            </div>

            {/* Security Features */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                background: "white",
                border: "2px solid #e9d5ff",
                borderRadius: "1.5rem",
                padding: "1.25rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p
                className="text-xs font-bold text-gray-500"
                style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Security
              </p>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center">
                  <Lock className="w-3 h-3" style={{ color: "#9333ea" }} />
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
                  <Lock className="w-3 h-3" style={{ color: "#ec4899" }} />
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
