import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import Header from "../components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md space-y-8">
          <div>
            <p className="text-7xl font-bold gradient-primary-text mb-4">404</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-lg">
              Oops! The page you're looking for doesn't exist. It might have
              been moved or deleted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-social-primary justify-center">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              to="/feed"
              className="btn-social-ghost justify-center border border-border"
            >
              Go to Feed
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
            <p>
              Tried to access:{" "}
              <code className="text-primary font-mono">
                {location.pathname}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
