import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  Zap,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          // User is logged in, redirect to feed
          navigate("/feed");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show nothing while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div style={{ width: "3rem", height: "3rem", borderWidth: "4px", borderColor: "#e9d5ff", borderTopColor: "#9333ea", borderRadius: "9999px" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #ecf9ff 100%)",
      }}
    >
      {/* Navigation */}
      <nav
        className="border-b-2 border-purple-200 bg-white shadow-lg"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(20px)",
          opacity: 0.8,
        }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem" }}>
          <div
            className="flex items-center justify-between"
            style={{ height: "4rem" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="gradient-primary w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ transition: "transform 0.3s ease" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
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
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-social-ghost text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-social-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{ maxWidth: "80rem", margin: "0 auto", padding: "5rem 1rem" }}
      >
        <div
          className="grid grid-cols-1 gap-12 items-center"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 30rem), 1fr))",
          }}
        >
          {/* Left Content */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div className="inline-block" style={{ width: "fit-content" }}>
                <span
                  className="text-white px-4 py-2 rounded-full text-sm font-bold"
                  style={{
                    background: "linear-gradient(90deg, #a855f7, #ec4899)",
                  }}
                >
                  ✨ Welcome to Connect
                </span>
              </div>
              <h1
                className="font-bold leading-tight"
                style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)" }}
              >
                Share Your{" "}
                <span className="gradient-primary-text block">Colorful</span>
                Story
              </h1>
              <p
                className="text-xl text-gray-600"
                style={{ maxWidth: "32rem", lineHeight: "1.75" }}
              >
                Connect with millions of vibrant creators. Share thoughts,
                discover amazing content, and engage with your community like
                never before.
              </p>
            </div>

            <div className="flex flex-col gap-4" style={{ flexWrap: "wrap" }}>
              <Link
                to="/register"
                className="btn-social-primary text-base px-8 py-4"
                style={{ justifyContent: "center" }}
              >
                <span>Create Account</span>
                <ArrowRight
                  className="w-5 h-5"
                  style={{ transition: "transform 0.3s ease" }}
                />
              </Link>
              <Link
                to="/feed"
                className="btn-social-secondary text-base px-8 py-4"
                style={{ justifyContent: "center" }}
              >
                Explore Now
              </Link>
            </div>

            {/* Stats with Colors */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-purple-200">
              <div className="group">
                <p
                  className="text-3xl font-bold"
                  style={{
                    background: "linear-gradient(90deg, #9333ea, #be123c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  50M+
                </p>
                <p className="text-sm text-gray-500 font-semibold">Users</p>
              </div>
              <div className="group">
                <p
                  className="text-3xl font-bold"
                  style={{
                    background: "linear-gradient(90deg, #0891b2, #1e40af)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  1B+
                </p>
                <p className="text-sm text-gray-500 font-semibold">Posts</p>
              </div>
              <div className="group">
                <p
                  className="text-3xl font-bold"
                  style={{
                    background: "linear-gradient(90deg, #b45309, #7c2d12)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  10B+
                </p>
                <p className="text-sm text-gray-500 font-semibold">Likes</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Floating gradient shapes */}
            <div
              className="absolute rounded-full mix-blend-multiply animate-pulse"
              style={{
                top: "-5rem",
                right: "-5rem",
                width: "18rem",
                height: "18rem",
                background:
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.3))",
                filter: "blur(3rem)",
                opacity: 0.3,
              }}
            ></div>
            <div
              className="absolute rounded-full mix-blend-multiply animate-pulse"
              style={{
                bottom: "-5rem",
                left: "-5rem",
                width: "18rem",
                height: "18rem",
                background:
                  "linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.3))",
                filter: "blur(3rem)",
                opacity: 0.3,
                animationDelay: "2s",
              }}
            ></div>

            <div
              className="relative z-10"
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Post Card 1 - Purple */}
              <div
                className="post-card"
                style={{
                  background: "linear-gradient(135deg, #faf5ff, #fdf2f8)",
                  borderColor: "#d8b4fe",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #ec4899)",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>
                  <div>
                    <p className="font-bold text-gray-900">Sarah Chen</p>
                    <p className="text-xs text-gray-500">Just now</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-4">
                  Just shared my new creative project! 🎨✨
                </p>
                <div
                  style={{
                    height: "7rem",
                    background: "linear-gradient(135deg, #d8b4fe, #fbcfe8)",
                    borderRadius: "1rem",
                    marginBottom: "1rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                ></div>
              </div>

              {/* Post Card 2 - Cyan */}
              <div
                className="post-card"
                style={{
                  background: "linear-gradient(135deg, #ecf9ff, #dbeafe)",
                  borderColor: "#a5f3fc",
                  transform: "translateY(-0.25rem)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>
                  <div>
                    <p className="font-bold text-gray-900">Alex Rivera</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  Amazing community engagement today! 🚀
                </p>
              </div>

              {/* Post Card 3 - Orange */}
              <div
                className="post-card"
                style={{
                  background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
                  borderColor: "#fed7aa",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #fb923c, #ef4444)",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>
                  <div>
                    <p className="font-bold text-gray-900">Jordan Kim</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  Live session with my followers at 5PM! 🎉
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20"
        style={{
          background: "rgba(255, 255, 255, 0.5)",
          borderTop: "2px solid #e9d5ff",
          borderBottom: "2px solid #e9d5ff",
        }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem" }}>
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span
                className="text-white px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  background:
                    "linear-gradient(90deg, #ec4899, #a855f7, #22d3ee)",
                }}
              >
                ✨ Our Features
              </span>
            </div>
            <h2 className="text-4xl font-bold mb-4 gradient-primary-text">
              Packed with Powerful Features
            </h2>
            <p
              className="text-lg text-gray-600"
              style={{ maxWidth: "42rem", margin: "0 auto" }}
            >
              Everything you need to express yourself and connect with your
              community
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature Cards */}
            <div className="feature-card-1 shadow-2xl">
              <MessageCircle className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Share & Post</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Express yourself with rich content, images, and multimedia
                stories.
              </p>
            </div>

            <div className="feature-card-2 shadow-2xl">
              <Heart className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Engage & Like</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Build meaningful connections with likes, comments, and shares.
              </p>
            </div>

            <div className="feature-card-3 shadow-2xl">
              <Zap className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Powered by MongoDB & Redis for ultimate speed and reliability.
              </p>
            </div>

            <div className="feature-card-4 shadow-2xl">
              <Users className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Community</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Discover creators and build your network. Follow anyone.
              </p>
            </div>

            <div className="feature-card-5 shadow-2xl">
              <Star className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Trending</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Stay updated with trending hashtags and viral content.
              </p>
            </div>

            <div className="feature-card-6 shadow-2xl">
              <Share2 className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">Share & Spread</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                Share posts and help content go viral in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{ maxWidth: "80rem", margin: "0 auto", padding: "5rem 1rem" }}
      >
        <div className="relative overflow-hidden">
          {/* Background gradient blobs */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2), rgba(34, 211, 238, 0.2))",
              filter: "blur(2rem)",
            }}
          ></div>

          <div
            className="relative rounded-3xl p-12 text-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #9333ea, #ec4899, #22d3ee)",
            }}
          >
            <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Your Journey Today
            </h2>
            <p
              className="text-white text-xl mb-10"
              style={{ maxWidth: "42rem", margin: "0 auto 2.5rem" }}
              style={{ opacity: 0.9 }}
            >
              Join our vibrant community of creators and discover what you can
              achieve. It's free and takes less than a minute!
            </p>
            <Link
              to="/register"
              className="inline-block font-bold text-lg px-10 py-4 rounded-2xl"
              style={{
                background: "white",
                color: "white",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <span
                style={{
                  background: "linear-gradient(90deg, #9333ea, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                  padding: "1rem 2.5rem",
                  borderRadius: "1rem",
                  fontWeight: 900,
                  color: "white",
                }}
              >
                Create Account Now
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t-2 border-purple-200 py-16"
        style={{
          background: "linear-gradient(180deg, white, rgba(250, 245, 255, 1))",
        }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1rem" }}>
          <div
            className="grid grid-cols-1 gap-8 mb-12"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 12rem), 1fr))",
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="font-bold text-lg gradient-primary-text">
                  Connect
                </span>
              </div>
              <p className="text-gray-600 font-semibold">
                Your vibrant community, your story.
              </p>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-4">Product</p>
              <ul className="space-y-2 text-gray-600 font-semibold">
                <li>
                  <a
                    href="#"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5563")
                    }
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5563")
                    }
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5563")
                    }
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-4">Company</p>
              <ul className="space-y-2 text-gray-600 font-semibold">
                <li>
                  <a
                    href="#"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5563")
                    }
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5563")
                    }
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5563")
                    }
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-4">Legal</p>
              <ul className="space-y-2 text-gray-600 font-semibold">
                <li>
                  <a
                    href="#"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5563")
                    }
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5563")
                    }
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    style={{ color: "#4b5563" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#a855f7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#4b5563")
                    }
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-purple-200 pt-8">
            <p className="text-center text-gray-600 font-semibold">
              © 2024 Connect. Built with 💜💙💗
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
