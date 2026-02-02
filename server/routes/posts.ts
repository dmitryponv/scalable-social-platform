import { RequestHandler } from "express";
import { generateId, getPostById, getAllPosts, getUserById, getPostComments, createPost, likePost, unlikePost, sharePost } from "../db";
import type { CreatePostRequest, CreatePostResponse, GetFeedResponse, Post, PostEngagementResponse } from "@shared/api";
import type { PostData } from "../db";

/**
 * Helper function to format a post with user info and engagement stats
 */
const formatPost = (post: PostData, currentUserId?: string): Post => {
  return {
    id: post.id,
    authorId: post.authorId,
    author: {
      id: post.authorId,
      name: "User",
      handle: "user",
      avatar: undefined,
      bio: undefined,
    },
    content: post.content,
    image: post.image,
    likes: post.likedBy.length,
    comments: 0, // Will be fetched separately
    shares: post.shares,
    liked: currentUserId ? post.likedBy.includes(currentUserId) : false,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

/**
 * POST /api/posts
 * Create a new post
 */
export const handleCreatePost: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      } as CreatePostResponse);
    }

    const { content, image } = req.body as CreatePostRequest;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      } as CreatePostResponse);
    }

    if (content.trim().length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Post content is too long (max 5000 characters)",
      } as CreatePostResponse);
    }

    const newPost = await createPost(req.user.id, content.trim(), image);

    if (!newPost) {
      return res.status(500).json({
        success: false,
        message: "Failed to create post",
      } as CreatePostResponse);
    }

    return res.status(201).json({
      success: true,
      post: formatPost(newPost, req.user.id),
    } as CreatePostResponse);
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    } as CreatePostResponse);
  }
};

/**
 * GET /api/posts
 * Get all posts for the feed
 */
export const handleGetFeed: RequestHandler = async (req, res) => {
  try {
    const posts = await getAllPosts(50, 0);
    const formattedPosts = posts.map((post) => formatPost(post, req.user?.id));

    return res.json({
      success: true,
      posts: formattedPosts,
    } as GetFeedResponse);
  } catch (error) {
    console.error("Get feed error:", error);
    return res.status(500).json({
      success: false,
      posts: [],
      message: "Internal server error",
    } as GetFeedResponse);
  }
};

/**
 * GET /api/posts/:id
 * Get a single post
 */
export const handleGetPost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.json({
      success: true,
      post: formatPost(post, req.user?.id),
    });
  } catch (error) {
    console.error("Get post error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * POST /api/posts/:id/like
 * Like a post
 */
export const handleLikePost: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      } as PostEngagementResponse);
    }

    const { id } = req.params;
    const post = getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      } as PostEngagementResponse);
    }

    post.likedBy.add(req.user.id);

    return res.json({
      success: true,
      message: "Post liked",
    } as PostEngagementResponse);
  } catch (error) {
    console.error("Like post error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    } as PostEngagementResponse);
  }
};

/**
 * POST /api/posts/:id/unlike
 * Unlike a post
 */
export const handleUnlikePost: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      } as PostEngagementResponse);
    }

    const { id } = req.params;
    const post = getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      } as PostEngagementResponse);
    }

    post.likedBy.delete(req.user.id);

    return res.json({
      success: true,
      message: "Post unliked",
    } as PostEngagementResponse);
  } catch (error) {
    console.error("Unlike post error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    } as PostEngagementResponse);
  }
};

/**
 * POST /api/posts/:id/share
 * Share a post
 */
export const handleSharePost: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      } as PostEngagementResponse);
    }

    const { id } = req.params;
    const post = getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      } as PostEngagementResponse);
    }

    post.shares += 1;

    return res.json({
      success: true,
      message: "Post shared",
    } as PostEngagementResponse);
  } catch (error) {
    console.error("Share post error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    } as PostEngagementResponse);
  }
};
