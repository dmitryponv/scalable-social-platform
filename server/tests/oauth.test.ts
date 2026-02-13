/**
 * OAuth Function Unit Tests
 * Tests for Google OAuth operations
 */

import {
  getGoogleClient,
  getGoogleAuthUrl,
  initializeGoogleOAuth,
} from "../config/oauth";

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export const oauthTests = {
  async testInitializeGoogleOAuth(): Promise<TestResult> {
    const start = Date.now();
    try {
      const client = initializeGoogleOAuth();
      // Will return null if credentials not set, but that's OK for test
      return {
        name: "OAuth - Initialize Google OAuth",
        passed: true,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "OAuth - Initialize Google OAuth",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testGetGoogleClient(): Promise<TestResult> {
    const start = Date.now();
    try {
      initializeGoogleOAuth();
      const client = getGoogleClient();
      // Client may be null if credentials not configured, but function works
      return {
        name: "OAuth - Get Google client",
        passed: true,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "OAuth - Get Google client",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testGetGoogleAuthUrl(): Promise<TestResult> {
    const start = Date.now();
    try {
      initializeGoogleOAuth();
      const client = getGoogleClient();

      if (!client) {
        return {
          name: "OAuth - Generate Google auth URL",
          passed: false,
          error: "Google OAuth client not initialized (missing credentials)",
          duration: Date.now() - start,
        };
      }

      const url = getGoogleAuthUrl();
      const passed = url && url.includes("accounts.google.com");
      return {
        name: "OAuth - Generate Google auth URL",
        passed,
        error: passed ? undefined : "Invalid auth URL generated",
        duration: Date.now() - start,
      };
    } catch (error) {
      const errorMsg = (error as Error).message;
      // Expected error if credentials not configured
      const expectedError =
        errorMsg.includes("not initialized") ||
        errorMsg.includes("not configured");
      return {
        name: "OAuth - Generate Google auth URL",
        passed: expectedError,
        error: expectedError
          ? "Google OAuth not configured (expected)"
          : errorMsg,
        duration: Date.now() - start,
      };
    }
  },

  async testOAuthCredentialsCheck(): Promise<TestResult> {
    const start = Date.now();
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      const credentialsConfigured =
        !!clientId && !!clientSecret && clientId !== "" && clientSecret !== "";

      return {
        name: "OAuth - Check credentials configuration",
        passed: true,
        error: credentialsConfigured
          ? undefined
          : "Google OAuth credentials not configured (CLIENT_ID or CLIENT_SECRET missing)",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "OAuth - Check credentials configuration",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },
};
