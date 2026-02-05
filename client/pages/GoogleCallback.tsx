import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setError(`Authentication failed: ${error}`);
      setLoading(false);
      return;
    }

    if (!code) {
      setError("No authorization code received");
      setLoading(false);
      return;
    }

    // Send code to backend
    const handleCallback = async () => {
      try {
        const response = await fetch("/api/auth/google/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        // Redirect to feed on success
        navigate("/feed");
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center">
        {loading && (
          <>
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
            </div>
            <p className="mt-4 text-gray-600">Signing you in...</p>
          </>
        )}

        {error && (
          <>
            <div className="text-red-600 text-lg font-bold mb-4">
              ❌ {error}
            </div>
            <a
              href="/"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Back to Home
            </a>
          </>
        )}
      </div>
    </div>
  );
}
