import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  handle?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsChecking(true);
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Auth response:", data);
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
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
          <Link to="/" className="flex items-center gap-3">
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
          </Link>

          <div className="flex items-center gap-4">
            {isChecking ? (
              <span className="text-sm text-gray-500">Checking...</span>
            ) : user ? (
              <>
                <span className="text-sm font-medium text-gray-600">
                  Logged in as <span className="text-purple-600">{user.email}</span>
                </span>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="btn-social-ghost text-sm flex items-center gap-2"
                  style={{ opacity: isLoggingOut ? 0.5 : 1 }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-social-ghost text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-social-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
