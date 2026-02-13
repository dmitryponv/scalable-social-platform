/**
 * Authentication Function Unit Tests
 * Tests for password hashing and validation
 */

import {
  hashPassword,
  comparePassword,
  generateSessionToken,
  isValidEmail,
  isValidPassword,
  isValidHandle,
} from "../auth";
import { createSession, getSessionUser } from "../db";

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export const authTests = {
  async testHashPassword(): Promise<TestResult> {
    const start = Date.now();
    try {
      const password = "TestPassword123";
      const hash = hashPassword(password);
      const passed = hash && hash !== password;
      return {
        name: "Auth - Hash password",
        passed,
        error: passed ? undefined : "Password was not hashed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Auth - Hash password",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testComparePassword(): Promise<TestResult> {
    const start = Date.now();
    try {
      const password = "TestPassword123";
      const hash = hashPassword(password);
      const matches = comparePassword(password, hash);
      return {
        name: "Auth - Compare password",
        passed: matches,
        error: matches ? undefined : "Password comparison failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Auth - Compare password",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testComparePasswordWrongPassword(): Promise<TestResult> {
    const start = Date.now();
    try {
      const password = "TestPassword123";
      const wrongPassword = "WrongPassword123";
      const hash = hashPassword(password);
      const matches = comparePassword(wrongPassword, hash);
      const passed = !matches;
      return {
        name: "Auth - Compare wrong password (should fail)",
        passed,
        error: passed ? undefined : "Wrong password was accepted",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Auth - Compare wrong password (should fail)",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testGenerateSessionToken(): Promise<TestResult> {
    const start = Date.now();
    try {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      const passed = token1 && token2 && token1 !== token2 && token1.length > 20;
      return {
        name: "Auth - Generate session token",
        passed,
        error: passed ? undefined : "Session token generation failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Auth - Generate session token",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testIsValidEmail(): Promise<TestResult> {
    const start = Date.now();
    try {
      const validEmail = isValidEmail("test@example.com");
      const invalidEmail = isValidEmail("invalid-email");
      const passed = validEmail && !invalidEmail;
      return {
        name: "Auth - Validate email format",
        passed,
        error: passed ? undefined : "Email validation failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Auth - Validate email format",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testIsValidPassword(): Promise<TestResult> {
    const start = Date.now();
    try {
      const validPassword = isValidPassword("ValidPassword123");
      const shortPassword = isValidPassword("short");
      const passed = validPassword && !shortPassword;
      return {
        name: "Auth - Validate password strength",
        passed,
        error: passed ? undefined : "Password validation failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Auth - Validate password strength",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testIsValidHandle(): Promise<TestResult> {
    const start = Date.now();
    try {
      const validHandle = isValidHandle("valid_handle");
      const invalidHandle = isValidHandle("in!");
      const passed = validHandle && !invalidHandle;
      return {
        name: "Auth - Validate user handle",
        passed,
        error: passed ? undefined : "Handle validation failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Auth - Validate user handle",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testCreateAndGetSession(): Promise<TestResult> {
    const start = Date.now();
    try {
      const testUserId = "test_user_" + Date.now();
      const token = await createSession(testUserId);

      if (!token) {
        return {
          name: "Auth - Create and retrieve session",
          passed: false,
          error: "Session token not created",
          duration: Date.now() - start,
        };
      }

      const user = await getSessionUser(token);
      const passed = user && user.id === testUserId;

      return {
        name: "Auth - Create and retrieve session",
        passed,
        error: passed ? undefined : "Session retrieval failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Auth - Create and retrieve session",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },
};
