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
      if (value) {
        console.log(`✓ Cache HIT: Retrieved "${key}" from Redis cache`);
        return JSON.parse(value) as T;
      }
      console.log(`✗ Cache MISS: Key "${key}" not found in Redis`);
      return null;
    }

    // Fallback to memory cache
    const cached = memoryCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      console.log(`✓ Cache HIT: Retrieved "${key}" from memory cache`);
      return cached.value as T;
    }
    console.log(`✗ Cache MISS: Key "${key}" expired or not found in memory cache`);
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
      console.log(`✓ Cache SET: Stored "${key}" in Redis cache (expires in ${expirationSeconds}s)`);
    } else {
      // Fallback to memory cache
      memoryCache.set(key, {
        value,
        expiresAt: Date.now() + expirationSeconds * 1000,
      });
      console.log(`✓ Cache SET: Stored "${key}" in memory cache (expires in ${expirationSeconds}s)`);
    }
  } catch (error) {
    console.error("Cache set error:", error);
  }
};

export const cacheDelete = async (key: string): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.del(key);
      console.log(`✓ Cache DELETE: Removed "${key}" from Redis cache`);
    } else {
      memoryCache.delete(key);
      console.log(`✓ Cache DELETE: Removed "${key}" from memory cache`);
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
        console.log(`✓ Cache CLEAR: Removed ${keys.length} Redis cache entries matching pattern "${pattern}"`);
      } else {
        console.log(`✓ Cache CLEAR: No Redis cache entries found matching pattern "${pattern}"`);
      }
    } else if (redisClient) {
      await redisClient.flushDb();
      console.log(`✓ Cache CLEAR: Flushed entire Redis database`);
    } else {
      const sizeBefore = memoryCache.size;
      memoryCache.clear();
      console.log(`✓ Cache CLEAR: Cleared ${sizeBefore} entries from memory cache`);
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
