/**
 * Unit Tests Route
 * Runs all unit tests and returns results
 */

import { RequestHandler } from "express";
import { cacheTests } from "../tests/cache.test";
import { dbTests } from "../tests/db.test";
import { oauthTests } from "../tests/oauth.test";
import { authTests } from "../tests/auth.test";

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  total: number;
}

export interface TestResponse {
  success: boolean;
  timestamp: string;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  suites: TestSuite[];
}

/**
 * Run all unit tests
 */
export const handleRunTests: RequestHandler = async (req, res) => {
  try {
    console.log("✓ UNITTEST: Starting all unit tests");
    const startTime = Date.now();

    const suites: TestSuite[] = [];

    // Cache Tests
    console.log("✓ UNITTEST: Running cache tests...");
    const cacheResults: TestResult[] = [
      await cacheTests.testCacheSet(),
      await cacheTests.testCacheGet(),
      await cacheTests.testCacheDelete(),
      await cacheTests.testCacheClear(),
      await cacheTests.testCacheExpiration(),
    ];
    const cachePassed = cacheResults.filter((t) => t.passed).length;
    suites.push({
      name: "Cache Tests",
      tests: cacheResults,
      passed: cachePassed,
      total: cacheResults.length,
    });
    console.log(
      `✓ UNITTEST: Cache tests completed - ${cachePassed}/${cacheResults.length} passed`
    );

    // Database Tests
    console.log("✓ UNITTEST: Running database tests...");
    const dbResults: TestResult[] = [
      await dbTests.testGenerateId(),
      await dbTests.testGetUserByEmail(),
      await dbTests.testGetUserByHandle(),
      await dbTests.testCreateUser(),
      await dbTests.testGetAllPosts(),
      await dbTests.testCreatePost(),
      await dbTests.testFollowUser(),
      await dbTests.testUnfollowUser(),
    ];
    const dbPassed = dbResults.filter((t) => t.passed).length;
    suites.push({
      name: "Database Tests",
      tests: dbResults,
      passed: dbPassed,
      total: dbResults.length,
    });
    console.log(
      `✓ UNITTEST: Database tests completed - ${dbPassed}/${dbResults.length} passed`
    );

    // OAuth Tests
    console.log("✓ UNITTEST: Running OAuth tests...");
    const oauthResults: TestResult[] = [
      await oauthTests.testInitializeGoogleOAuth(),
      await oauthTests.testGetGoogleClient(),
      await oauthTests.testGetGoogleAuthUrl(),
      await oauthTests.testOAuthCredentialsCheck(),
    ];
    const oauthPassed = oauthResults.filter((t) => t.passed).length;
    suites.push({
      name: "OAuth Tests",
      tests: oauthResults,
      passed: oauthPassed,
      total: oauthResults.length,
    });
    console.log(
      `✓ UNITTEST: OAuth tests completed - ${oauthPassed}/${oauthResults.length} passed`
    );

    // Auth Tests
    console.log("✓ UNITTEST: Running authentication tests...");
    const authResults: TestResult[] = [
      await authTests.testHashPassword(),
      await authTests.testComparePassword(),
      await authTests.testComparePasswordWrongPassword(),
      await authTests.testGenerateSessionToken(),
      await authTests.testIsValidEmail(),
      await authTests.testIsValidPassword(),
      await authTests.testIsValidHandle(),
      await authTests.testCreateAndGetSession(),
    ];
    const authPassed = authResults.filter((t) => t.passed).length;
    suites.push({
      name: "Authentication Tests",
      tests: authResults,
      passed: authPassed,
      total: authResults.length,
    });
    console.log(
      `✓ UNITTEST: Auth tests completed - ${authPassed}/${authResults.length} passed`
    );

    // Calculate totals
    const totalTests = cacheResults.length +
      dbResults.length +
      oauthResults.length +
      authResults.length;
    const totalPassed = cachePassed + dbPassed + oauthPassed + authPassed;
    const totalFailed = totalTests - totalPassed;

    const duration = Date.now() - startTime;
    console.log(
      `✓ UNITTEST: All tests completed - ${totalPassed}/${totalTests} passed (${duration}ms)`
    );

    const response: TestResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      totalTests,
      totalPassed,
      totalFailed,
      suites,
    };

    res.json(response);
  } catch (error) {
    console.error("✗ UNITTEST: Error running tests:", error);
    res.status(500).json({
      success: false,
      message: "Error running unit tests",
      error: (error as Error).message,
    });
  }
};

/**
 * Get test summary
 */
export const handleGetTestSummary: RequestHandler = async (req, res) => {
  res.json({
    success: true,
    message: "Unit tests endpoint available",
    endpoints: {
      runAllTests: "POST /api/unittests",
      frontend: "GET /unittests",
    },
    availableTests: [
      "Cache Operations (5 tests)",
      "Database Operations (8 tests)",
      "OAuth Configuration (4 tests)",
      "Authentication Functions (8 tests)",
    ],
  });
};
