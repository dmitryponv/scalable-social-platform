/**
 * Cache Function Unit Tests
 * Tests for Redis/Memory cache operations
 */

import { cacheGet, cacheSet, cacheDelete, cacheClear } from "../config/cache";

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export const cacheTests = {
  async testCacheSet(): Promise<TestResult> {
    const start = Date.now();
    try {
      await cacheSet("test:key", { data: "test value" }, 60);
      return {
        name: "Cache SET - Store data in cache",
        passed: true,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Cache SET - Store data in cache",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testCacheGet(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Test if SET and GET operations complete without errors
      const uniqueKey = `test:get:${Date.now()}:${Math.floor(Math.random() * 10000)}`;
      const testData = { hello: "world" };

      // Perform SET operation
      await cacheSet(uniqueKey, testData, 120);

      // Wait for write
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Perform GET operation
      const result = await cacheGet<{ hello: string }>(uniqueKey);

      // Check if we got the data back
      const passed = result?.hello === "world";

      return {
        name: "Cache GET - Retrieve data from cache",
        passed,
        error: passed
          ? undefined
          : `Data not found (${result === null ? "cache returned null" : `unexpected value: ${JSON.stringify(result)}`})`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Cache GET - Retrieve data from cache",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testCacheDelete(): Promise<TestResult> {
    const start = Date.now();
    try {
      await cacheSet("test:delete", { data: "to delete" }, 60);
      await cacheDelete("test:delete");
      const result = await cacheGet("test:delete");
      const passed = result === null;
      return {
        name: "Cache DELETE - Remove data from cache",
        passed,
        error: passed ? undefined : "Data was not deleted",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Cache DELETE - Remove data from cache",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testCacheClear(): Promise<TestResult> {
    const start = Date.now();
    try {
      await cacheSet("test:clear:1", { data: "1" }, 60);
      await cacheSet("test:clear:2", { data: "2" }, 60);
      await cacheClear("test:clear:*");
      return {
        name: "Cache CLEAR - Clear pattern from cache",
        passed: true,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Cache CLEAR - Clear pattern from cache",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testCacheExpiration(): Promise<TestResult> {
    const start = Date.now();
    try {
      await cacheSet("test:expire", { data: "expires" }, 1); // 1 second
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const result = await cacheGet("test:expire");
      const passed = result === null;
      return {
        name: "Cache EXPIRATION - Data expires after TTL",
        passed,
        error: passed ? undefined : "Data did not expire",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "Cache EXPIRATION - Data expires after TTL",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },
};
