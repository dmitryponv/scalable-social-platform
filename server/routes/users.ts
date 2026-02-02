import { RequestHandler } from "express";
import { getUserById, getUserFollowing, getUserFollowers, isUserFollowing, followUser, unfollowUser } from "../db";
import type { FollowResponse, GetSuggestionsResponse, UserPublic } from "@shared/api";

/**
 * Helper function to format user as public
 */
const formatUserPublic = (user: any): UserPublic => ({
  id: user.id,
  name: user.name,
  handle: user.handle,
  avatar: user.avatar,
  bio: user.bio,
});

/**
 * GET /api/users/:id
 * Get a user's profile
 */
export const handleGetUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const followers = await getUserFollowers(id);
    const following = await getUserFollowing(id);
    const isFollowing = req.user ? await isUserFollowing(req.user.id, id) : false;

    return res.json({
      success: true,
      user: {
        ...formatUserPublic(user),
        followers: followers.length,
        following: following.length,
        isFollowing,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/users/suggestions
 * Get suggested users to follow (excluding current user and already following)
 */
export const handleGetSuggestions: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        users: [],
        message: "Unauthorized",
      } as GetSuggestionsResponse);
    }

    // In MongoDB, you would query for random users
    // For now, returning empty array as we need to implement user listing in db.ts
    const suggestions: UserPublic[] = [];

    return res.json({
      success: true,
      users: suggestions,
    } as GetSuggestionsResponse);
  } catch (error) {
    console.error("Get suggestions error:", error);
    return res.status(500).json({
      success: false,
      users: [],
      message: "Internal server error",
    } as GetSuggestionsResponse);
  }
};

/**
 * POST /api/users/:id/follow
 * Follow a user
 */
export const handleFollowUser: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      } as FollowResponse);
    }

    const { id } = req.params;

    // Check if target user exists
    const targetUser = await getUserById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as FollowResponse);
    }

    // Can't follow yourself
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You can't follow yourself",
      } as FollowResponse);
    }

    // Check if already following
    const alreadyFollowing = await isUserFollowing(req.user.id, id);
    if (alreadyFollowing) {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      } as FollowResponse);
    }

    // Create follow relationship
    const success = await followUser(req.user.id, id);
    if (!success) {
      return res.status(500).json({
        success: false,
        message: "Failed to follow user",
      } as FollowResponse);
    }

    return res.status(201).json({
      success: true,
      message: "User followed successfully",
    } as FollowResponse);
  } catch (error) {
    console.error("Follow user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    } as FollowResponse);
  }
};

/**
 * POST /api/users/:id/unfollow
 * Unfollow a user
 */
export const handleUnfollowUser: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      } as FollowResponse);
    }

    const { id } = req.params;

    // Check if target user exists
    const targetUser = await getUserById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as FollowResponse);
    }

    // Delete follow relationship
    const success = await unfollowUser(req.user.id, id);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Not following this user",
      } as FollowResponse);
    }

    return res.json({
      success: true,
      message: "User unfollowed successfully",
    } as FollowResponse);
  } catch (error) {
    console.error("Unfollow user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    } as FollowResponse);
  }
};

/**
 * GET /api/users/:id/followers
 * Get list of followers for a user
 */
export const handleGetFollowers: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const followerIds = await getUserFollowers(id);
    const followers = await Promise.all(
      followerIds.map(async (followerId) => await getUserById(followerId))
    );

    const formattedFollowers = followers
      .filter((u): u is Exclude<typeof u, null> => u !== null)
      .map(formatUserPublic);

    return res.json({
      success: true,
      followers: formattedFollowers,
    });
  } catch (error) {
    console.error("Get followers error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/users/:id/following
 * Get list of users that a user is following
 */
export const handleGetFollowing: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const followingIds = await getUserFollowing(id);
    const following = await Promise.all(
      followingIds.map(async (followingId) => await getUserById(followingId))
    );

    const formattedFollowing = following
      .filter((u): u is Exclude<typeof u, null> => u !== null)
      .map(formatUserPublic);

    return res.json({
      success: true,
      following: formattedFollowing,
    });
  } catch (error) {
    console.error("Get following error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
