/**
 * Redis Cache Configuration
 * 
 * Provides caching functionality for frequently accessed data.
 * Falls back to memory cache if Redis is unavailable.
 * 
 * Installation required:
 * npm install redis
 */

import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;
let memoryCache = new Map<string, { value: unknown; expiresAt: number }>();

export const initializeCache = async (): Promise<void> => {
  try {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    redisClient = createClient({ url: redisUrl });

    redisClient.on("error", (err) => {
      console.warn("Redis error:", err);
      console.log("Falling back to memory cache");
      redisClient = null;
    });

    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.warn("Redis connection failed, using memory cache:", error);
    redisClient = null;
  }
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    if (redisClient) {
      const value = await redisClient.get(key);
      return value ? (JSON.parse(value) as T) : null;
    }

    // Fallback to memory cache
    const cached = memoryCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
    }
    memoryCache.delete(key);
    return null;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: unknown,
  expirationSeconds: number = 3600
): Promise<void> => {
  try {
    const serialized = JSON.stringify(value);

    if (redisClient) {
      await redisClient.setEx(key, expirationSeconds, serialized);
    } else {
      // Fallback to memory cache
      memoryCache.set(key, {
        value,
        expiresAt: Date.now() + expirationSeconds * 1000,
      });
    }
  } catch (error) {
    console.error("Cache set error:", error);
  }
};

export const cacheDelete = async (key: string): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.del(key);
    } else {
      memoryCache.delete(key);
    }
  } catch (error) {
    console.error("Cache delete error:", error);
  }
};

export const cacheClear = async (pattern?: string): Promise<void> => {
  try {
    if (redisClient && pattern) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } else if (redisClient) {
      await redisClient.flushDb();
    } else {
      memoryCache.clear();
    }
  } catch (error) {
    console.error("Cache clear error:", error);
  }
};

export const disconnectCache = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
  }
  memoryCache.clear();
};
