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
    const user = getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const followers = getUserFollowers(id);
    const following = getUserFollowing(id);

    return res.json({
      success: true,
      user: {
        ...formatUserPublic(user),
        followers: followers.length,
        following: following.length,
        isFollowing: req.user ? isUserFollowing(req.user.id, id) : false,
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

    const userFollowing = new Set(getUserFollowing(req.user.id));
    const suggestions: UserPublic[] = [];

    // Get all users except current user and those already following
    for (const user of db.users.values()) {
      if (user.id !== req.user.id && !userFollowing.has(user.id)) {
        suggestions.push(formatUserPublic(user));
      }
    }

    // Return random 10 suggestions
    const shuffled = suggestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    return res.json({
      success: true,
      users: selected,
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
    const targetUser = getUserById(id);
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
    if (isUserFollowing(req.user.id, id)) {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      } as FollowResponse);
    }

    // Create follow relationship
    const followId = generateId();
    db.follows.set(followId, {
      id: followId,
      followerId: req.user.id,
      followingId: id,
      createdAt: new Date(),
    });

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
    const targetUser = getUserById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as FollowResponse);
    }

    // Find and delete follow relationship
    let found = false;
    for (const [followId, follow] of db.follows.entries()) {
      if (follow.followerId === req.user.id && follow.followingId === id) {
        db.follows.delete(followId);
        found = true;
        break;
      }
    }

    if (!found) {
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
    const user = getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const followerIds = getUserFollowers(id);
    const followers = followerIds
      .map((followerId) => getUserById(followerId))
      .filter((u): u is any => u !== undefined)
      .map(formatUserPublic);

    return res.json({
      success: true,
      followers,
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
    const user = getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const followingIds = getUserFollowing(id);
    const following = followingIds
      .map((followingId) => getUserById(followingId))
      .filter((u): u is any => u !== undefined)
      .map(formatUserPublic);

    return res.json({
      success: true,
      following,
    });
  } catch (error) {
    console.error("Get following error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
