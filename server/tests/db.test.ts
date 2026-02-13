/**
 * Database Function Unit Tests
 * Tests for MongoDB operations
 */

import {
  generateId,
  getUserByEmail,
  getUserByHandle,
  createUser,
  createPost,
  getPostById,
  getAllPosts,
  createComment,
  followUser,
  unfollowUser,
} from "../db";

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export const dbTests = {
  async testGenerateId(): Promise<TestResult> {
    const start = Date.now();
    try {
      const id1 = generateId();
      const id2 = generateId();
      const passed = id1 && id2 && id1 !== id2;
      return {
        name: "DB - Generate unique ID",
        passed,
        error: passed ? undefined : "IDs are not unique",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "DB - Generate unique ID",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testGetUserByEmail(): Promise<TestResult> {
    const start = Date.now();
    try {
      const user = await getUserByEmail("nonexistent@test.com");
      const passed = user === null;
      return {
        name: "DB - Get user by email (non-existent)",
        passed,
        error: passed ? undefined : "Should return null for non-existent user",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "DB - Get user by email (non-existent)",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testGetUserByHandle(): Promise<TestResult> {
    const start = Date.now();
    try {
      const user = await getUserByHandle("nonexistent_handle");
      const passed = user === null;
      return {
        name: "DB - Get user by handle (non-existent)",
        passed,
        error: passed ? undefined : "Should return null for non-existent handle",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "DB - Get user by handle (non-existent)",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testCreateUser(): Promise<TestResult> {
    const start = Date.now();
    try {
      const testEmail = `test_${Date.now()}@test.com`;
      const user = await createUser({
        name: "Test User",
        email: testEmail,
        password: "hashedPassword123",
        handle: `test_user_${Date.now()}`,
      });
      const passed = user && user.email === testEmail;
      return {
        name: "DB - Create user",
        passed,
        error: passed ? undefined : "User creation failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "DB - Create user",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testGetAllPosts(): Promise<TestResult> {
    const start = Date.now();
    try {
      const posts = await getAllPosts();
      const passed = Array.isArray(posts);
      return {
        name: "DB - Get all posts",
        passed,
        error: passed ? undefined : "Posts should be an array",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "DB - Get all posts",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testCreatePost(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Create a test user first
      const testEmail = `post_user_${Date.now()}@test.com`;
      const user = await createUser({
        name: "Post Test User",
        email: testEmail,
        password: "hashedPassword123",
        handle: `post_user_${Date.now()}`,
      });

      if (!user) {
        return {
          name: "DB - Create post",
          passed: false,
          error: "Could not create test user",
          duration: Date.now() - start,
        };
      }

      const post = await createPost(user.id, "This is a test post");
      const passed = post && post.content === "This is a test post";
      return {
        name: "DB - Create post",
        passed,
        error: passed ? undefined : "Post creation failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "DB - Create post",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testFollowUser(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Create two test users
      const user1Email = `follower_${Date.now()}@test.com`;
      const user2Email = `following_${Date.now()}@test.com`;

      const user1 = await createUser({
        name: "Follower User",
        email: user1Email,
        password: "hashedPassword123",
        handle: `follower_${Date.now()}`,
      });

      const user2 = await createUser({
        name: "Following User",
        email: user2Email,
        password: "hashedPassword123",
        handle: `following_${Date.now()}`,
      });

      if (!user1 || !user2) {
        return {
          name: "DB - Follow user",
          passed: false,
          error: "Could not create test users",
          duration: Date.now() - start,
        };
      }

      const success = await followUser(user1.id, user2.id);
      return {
        name: "DB - Follow user",
        passed: success,
        error: success ? undefined : "Follow operation failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "DB - Follow user",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },

  async testUnfollowUser(): Promise<TestResult> {
    const start = Date.now();
    try {
      // Create two test users
      const user1Email = `unfollower_${Date.now()}@test.com`;
      const user2Email = `unfollowing_${Date.now()}@test.com`;

      const user1 = await createUser({
        name: "Unfollower User",
        email: user1Email,
        password: "hashedPassword123",
        handle: `unfollower_${Date.now()}`,
      });

      const user2 = await createUser({
        name: "Unfollowing User",
        email: user2Email,
        password: "hashedPassword123",
        handle: `unfollowing_${Date.now()}`,
      });

      if (!user1 || !user2) {
        return {
          name: "DB - Unfollow user",
          passed: false,
          error: "Could not create test users",
          duration: Date.now() - start,
        };
      }

      await followUser(user1.id, user2.id);
      const success = await unfollowUser(user1.id, user2.id);

      return {
        name: "DB - Unfollow user",
        passed: success,
        error: success ? undefined : "Unfollow operation failed",
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: "DB - Unfollow user",
        passed: false,
        error: (error as Error).message,
        duration: Date.now() - start,
      };
    }
  },
};
