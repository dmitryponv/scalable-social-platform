import { RequestHandler } from "express";
import { getPostById, getPostComments, getCommentById, createComment, deleteComment, type CommentData } from "../db";
import type { CreateCommentRequest, CreateCommentResponse, GetCommentsResponse, Comment } from "@shared/api";

/**
 * Helper function to format a comment with user info
 */
const formatComment = (comment: CommentData): Comment => {
  return {
    id: comment.id,
    postId: comment.postId,
    authorId: comment.authorId,
    author: {
      id: comment.authorId,
      name: "User",
      handle: "user",
      avatar: undefined,
      bio: undefined,
    },
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

/**
 * POST /api/posts/:postId/comments
 * Create a new comment on a post
 */
export const handleCreateComment: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      } as CreateCommentResponse);
    }

    const { postId } = req.params;
    const { content } = req.body as CreateCommentRequest;

    // Validate post exists
    const post = getPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      } as CreateCommentResponse);
    }

    // Validate comment content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      } as CreateCommentResponse);
    }

    if (content.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment is too long (max 1000 characters)",
      } as CreateCommentResponse);
    }

    const commentId = generateId();
    const now = new Date();

    const newComment = {
      id: commentId,
      postId,
      authorId: req.user.id,
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };

    db.comments.set(commentId, newComment);

    return res.status(201).json({
      success: true,
      comment: formatComment(newComment),
    } as CreateCommentResponse);
  } catch (error) {
    console.error("Create comment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    } as CreateCommentResponse);
  }
};

/**
 * GET /api/posts/:postId/comments
 * Get all comments for a post
 */
export const handleGetComments: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate post exists
    const post = getPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        comments: [],
        message: "Post not found",
      } as GetCommentsResponse);
    }

    const comments = getPostComments(postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map(formatComment);

    return res.json({
      success: true,
      comments,
    } as GetCommentsResponse);
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({
      success: false,
      comments: [],
      message: "Internal server error",
    } as GetCommentsResponse);
  }
};

/**
 * GET /api/comments/:id
 * Get a single comment
 */
export const handleGetComment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = getCommentById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.json({
      success: true,
      comment: formatComment(comment),
    });
  } catch (error) {
    console.error("Get comment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * DELETE /api/comments/:id
 * Delete a comment (only by author)
 */
export const handleDeleteComment: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    const comment = getCommentById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is the comment author
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    db.comments.delete(id);

    return res.json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
