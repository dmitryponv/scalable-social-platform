import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
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

    // Basic validation
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

      // Successfully logged in, redirect to feed
      navigate("/feed");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline gradient-primary-text">
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
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full bg-input border border-border rounded-lg pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline transition-all"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full bg-input border border-border rounded-lg pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-social-primary py-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-primary hover:underline transition-all"
                >
                  Create one
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">
                  Security
                </span>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <Lock className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Secure Login</p>
                  <p className="text-xs text-muted-foreground">
                    Your credentials are encrypted end-to-end
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
                  <Lock className="w-3 h-3 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Session Tokens</p>
                  <p className="text-xs text-muted-foreground">
                    Secure cookie-based sessions for your privacy
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
