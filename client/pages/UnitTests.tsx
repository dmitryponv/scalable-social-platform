import React, { useState } from "react";
import Header from "../components/Header";
import { CheckCircle, XCircle, Play, Loader } from "lucide-react";

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  total: number;
}

interface TestResponse {
  success: boolean;
  timestamp: string;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  suites: TestSuite[];
}

export default function UnitTests() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResponse | null>(null);
  const [error, setError] = useState<string>("");

  const runTests = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/unittests", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to run tests");
      } else {
        setResults(data);
      }
    } catch (err) {
      setError((err as Error).message || "Error running tests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div style={{ maxWidth: "90rem", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            className="font-bold mb-2"
            style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
          >
            Unit Tests Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Run comprehensive unit tests for cache, database, OAuth, and
            authentication functions
          </p>
        </div>

        {/* Run Tests Button */}
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={runTests}
            disabled={loading}
            className="btn-social-primary flex items-center gap-2"
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run All Tests
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "2px solid #fca5a5",
              borderRadius: "1rem",
              padding: "1rem",
              marginBottom: "2rem",
              color: "#b91c1c",
              fontWeight: 600,
            }}
          >
            ✗ Error: {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Summary */}
            <div
              className="post-card"
              style={{
                padding: "2rem",
                background:
                  results.totalFailed === 0
                    ? "linear-gradient(135deg, #ecfdf5, #dbeafe)"
                    : "linear-gradient(135deg, #fdf2f8, #fef3c7)",
                borderColor: results.totalFailed === 0 ? "#86efac" : "#fbbf24",
              }}
            >
              <h2 className="font-bold mb-4" style={{ fontSize: "1.5rem" }}>
                Test Summary
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "2rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      color: "#059669",
                    }}
                  >
                    {results.totalTests}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    Total Tests
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      color: "#10b981",
                    }}
                  >
                    {results.totalPassed}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    Passed
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      color: results.totalFailed === 0 ? "#10b981" : "#ef4444",
                    }}
                  >
                    {results.totalFailed}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    Failed
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      color: "#0891b2",
                    }}
                  >
                    {Math.round(
                      (results.totalPassed / results.totalTests) * 100
                    )}
                    %
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    Success Rate
                  </p>
                </div>
              </div>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }}
              >
                Ran at {new Date(results.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Test Suites */}
            {results.suites.map((suite, suiteIndex) => (
              <div key={suiteIndex} className="post-card">
                <h3
                  className="font-bold mb-4"
                  style={{
                    fontSize: "1.25rem",
                    color:
                      suite.passed === suite.total ? "#10b981" : "#ef4444",
                  }}
                >
                  {suite.name} ({suite.passed}/{suite.total} passed)
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {suite.tests.map((test, testIndex) => (
                    <div
                      key={testIndex}
                      style={{
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        background: test.passed
                          ? "#f0fdf4"
                          : "#fef2f2",
                        border: `2px solid ${
                          test.passed ? "#86efac" : "#fca5a5"
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "1rem",
                        }}
                      >
                        {test.passed ? (
                          <CheckCircle
                            className="w-5 h-5 mt-0.5"
                            style={{ color: "#10b981", flexShrink: 0 }}
                          />
                        ) : (
                          <XCircle
                            className="w-5 h-5 mt-0.5"
                            style={{ color: "#ef4444", flexShrink: 0 }}
                          />
                        )}

                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontWeight: 600,
                              color: test.passed
                                ? "#059669"
                                : "#991b1b",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {test.passed ? "✓" : "✗"} {test.name}
                          </p>
                          {test.error && (
                            <p
                              style={{
                                fontSize: "0.875rem",
                                color: "#6b7280",
                                marginTop: "0.25rem",
                              }}
                            >
                              {test.error}
                            </p>
                          )}
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "#9ca3af",
                              marginTop: "0.5rem",
                            }}
                          >
                            Duration: {test.duration}ms
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!results && !loading && (
          <div
            className="post-card"
            style={{
              padding: "3rem",
              textAlign: "center",
              background: "linear-gradient(135deg, #f9fafb, #f3f4f6)",
              borderColor: "#d1d5db",
            }}
          >
            <p style={{ fontSize: "1.125rem", color: "#6b7280" }}>
              Click "Run All Tests" to execute the unit test suite
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
