/**
 * Database Abstraction Layer
 *
 * This file provides an abstraction layer for database operations.
 * Now using MongoDB with Mongoose models.
 */

import mongoose from "mongoose";
import { User, Post, Comment, Follow, Session } from "./models/index";
import { generateSessionToken } from "./auth";
import { cacheGet, cacheSet, cacheDelete, cacheClear } from "./config/cache";

// Helper function to generate unique IDs
export const generateId = (): string =>
  new mongoose.Types.ObjectId().toString();

export interface UserData {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostData {
  id: string;
  authorId: string;
  content: string;
  image?: string;
  likedBy: string[];
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentData {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ User Operations ============

export const getUserById = async (id: string): Promise<UserData | null> => {
  try {
    const cacheKey = `user:${id}`;
    const cached = await cacheGet<UserData>(cacheKey);
    if (cached) return cached;

    const user = await User.findById(id).select("-password");
    if (!user) return null;

    const userData: UserData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      handle: user.handle,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    await cacheSet(cacheKey, userData, 3600); // Cache for 1 hour
    return userData;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const getUserByEmail = async (
  email: string
): Promise<(UserData & { password: string }) | null> => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password || "",
      handle: user.handle,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
};

export const getUserByHandle = async (
  handle: string
): Promise<UserData | null> => {
  try {
    const user = await User.findOne({ handle }).select("-password");
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      handle: user.handle,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error getting user by handle:", error);
    return null;
  }
};

export const getUserByGoogleId = async (
  googleId: string
): Promise<UserData | null> => {
  try {
    const user = await User.findOne({ googleId }).select("-password");
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      handle: user.handle,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error getting user by Google ID:", error);
    return null;
  }
};

export const createUser = async (
  userData: Omit<UserData, "id" | "createdAt" | "updatedAt"> & {
    password?: string;
    googleId?: string;
  }
): Promise<UserData | null> => {
  try {
    const user = new User(userData);
    await user.save();

    await cacheDelete(`user:${user._id}`);

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      handle: user.handle,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const updateUser = async (
  id: string,
  updates: Partial<UserData>
): Promise<UserData | null> => {
  try {
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    if (!user) return null;

    const userData: UserData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      handle: user.handle,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    await cacheDelete(`user:${id}`);
    return userData;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

// ============ Post Operations ============

export const getPostById = async (id: string): Promise<PostData | null> => {
  try {
    const cacheKey = `post:${id}`;
    const cached = await cacheGet<PostData>(cacheKey);
    if (cached) return cached;

    const post = await Post.findById(id);
    if (!post) return null;

    const postData: PostData = {
      id: post._id.toString(),
      authorId: post.authorId.toString(),
      content: post.content,
      image: post.image,
      likedBy: post.likedBy.map((id) => id.toString()),
      shares: post.shares,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    await cacheSet(cacheKey, postData, 1800); // Cache for 30 minutes
    return postData;
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
};

export const getAllPosts = async (
  limit: number = 50,
  skip: number = 0
): Promise<PostData[]> => {
  try {
    const cacheKey = `posts:all:${skip}:${limit}`;
    const cached = await cacheGet<PostData[]>(cacheKey);
    if (cached) return cached;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const postsData = posts.map((post) => ({
      id: post._id.toString(),
      authorId: post.authorId.toString(),
      content: post.content,
      image: post.image,
      likedBy: post.likedBy.map((id) => id.toString()),
      shares: post.shares,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    await cacheSet(cacheKey, postsData, 600); // Cache for 10 minutes
    return postsData;
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
};

export const getUserPosts = async (userId: string): Promise<PostData[]> => {
  try {
    const cacheKey = `posts:user:${userId}`;
    const cached = await cacheGet<PostData[]>(cacheKey);
    if (cached) return cached;

    const posts = await Post.find({ authorId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 });

    const postsData = posts.map((post) => ({
      id: post._id.toString(),
      authorId: post.authorId.toString(),
      content: post.content,
      image: post.image,
      likedBy: post.likedBy.map((id) => id.toString()),
      shares: post.shares,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    await cacheSet(cacheKey, postsData, 1800);
    return postsData;
  } catch (error) {
    console.error("Error getting user posts:", error);
    return [];
  }
};

export const createPost = async (
  authorId: string,
  content: string,
  image?: string
): Promise<PostData | null> => {
  try {
    const post = new Post({
      authorId: new mongoose.Types.ObjectId(authorId),
      content,
      image,
    });
    await post.save();

    await cacheClear("posts:all:*");
    await cacheClear(`posts:user:${authorId}`);

    return {
      id: post._id.toString(),
      authorId: post.authorId.toString(),
      content: post.content,
      image: post.image,
      likedBy: [],
      shares: 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};

export const likePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const post = await Post.findById(postId);
    if (!post) return false;

    const userIdObj = new mongoose.Types.ObjectId(userId);
    if (!post.likedBy.includes(userIdObj)) {
      post.likedBy.push(userIdObj);
      await post.save();
    }

    await cacheDelete(`post:${postId}`);
    return true;
  } catch (error) {
    console.error("Error liking post:", error);
    return false;
  }
};

export const unlikePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const post = await Post.findById(postId);
    if (!post) return false;

    const userIdObj = new mongoose.Types.ObjectId(userId);
    post.likedBy = post.likedBy.filter((id) => !id.equals(userIdObj));
    await post.save();

    await cacheDelete(`post:${postId}`);
    return true;
  } catch (error) {
    console.error("Error unliking post:", error);
    return false;
  }
};

export const sharePost = async (postId: string): Promise<boolean> => {
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!post) return false;
    await cacheDelete(`post:${postId}`);
    return true;
  } catch (error) {
    console.error("Error sharing post:", error);
    return false;
  }
};

// ============ Comment Operations ============

export const getCommentById = async (id: string): Promise<CommentData | null> => {
  try {
    const comment = await Comment.findById(id);
    if (!comment) return null;

    return {
      id: comment._id.toString(),
      postId: comment.postId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  } catch (error) {
    console.error("Error getting comment:", error);
    return null;
  }
};

export const getPostComments = async (postId: string): Promise<CommentData[]> => {
  try {
    const cacheKey = `comments:post:${postId}`;
    const cached = await cacheGet<CommentData[]>(cacheKey);
    if (cached) return cached;

    const comments = await Comment.find({
      postId: new mongoose.Types.ObjectId(postId),
    }).sort({ createdAt: -1 });

    const commentsData = comments.map((comment) => ({
      id: comment._id.toString(),
      postId: comment.postId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    await cacheSet(cacheKey, commentsData, 1800);
    return commentsData;
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
};

export const createComment = async (
  postId: string,
  authorId: string,
  content: string
): Promise<CommentData | null> => {
  try {
    const comment = new Comment({
      postId: new mongoose.Types.ObjectId(postId),
      authorId: new mongoose.Types.ObjectId(authorId),
      content,
    });
    await comment.save();

    await cacheDelete(`comments:post:${postId}`);

    return {
      id: comment._id.toString(),
      postId: comment.postId.toString(),
      authorId: comment.authorId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
};

export const deleteComment = async (id: string): Promise<boolean> => {
  try {
    const comment = await Comment.findById(id);
    if (!comment) return false;

    await Comment.deleteOne({ _id: id });
    await cacheDelete(`comments:post:${comment.postId}`);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
};

// ============ Follow Operations ============

export const getUserFollowing = async (userId: string): Promise<string[]> => {
  try {
    const cacheKey = `following:${userId}`;
    const cached = await cacheGet<string[]>(cacheKey);
    if (cached) return cached;

    const follows = await Follow.find({
      followerId: new mongoose.Types.ObjectId(userId),
    });

    const followingIds = follows.map((f) => f.followingId.toString());
    await cacheSet(cacheKey, followingIds, 3600);
    return followingIds;
  } catch (error) {
    console.error("Error getting following:", error);
    return [];
  }
};

export const getUserFollowers = async (userId: string): Promise<string[]> => {
  try {
    const cacheKey = `followers:${userId}`;
    const cached = await cacheGet<string[]>(cacheKey);
    if (cached) return cached;

    const follows = await Follow.find({
      followingId: new mongoose.Types.ObjectId(userId),
    });

    const followerIds = follows.map((f) => f.followerId.toString());
    await cacheSet(cacheKey, followerIds, 3600);
    return followerIds;
  } catch (error) {
    console.error("Error getting followers:", error);
    return [];
  }
};

export const isUserFollowing = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  try {
    const follow = await Follow.findOne({
      followerId: new mongoose.Types.ObjectId(followerId),
      followingId: new mongoose.Types.ObjectId(followingId),
    });

    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};

export const followUser = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  try {
    const follow = new Follow({
      followerId: new mongoose.Types.ObjectId(followerId),
      followingId: new mongoose.Types.ObjectId(followingId),
    });
    await follow.save();

    await cacheDelete(`following:${followerId}`);
    await cacheDelete(`followers:${followingId}`);
    return true;
  } catch (error) {
    console.error("Error following user:", error);
    return false;
  }
};

export const unfollowUser = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  try {
    await Follow.deleteOne({
      followerId: new mongoose.Types.ObjectId(followerId),
      followingId: new mongoose.Types.ObjectId(followingId),
    });

    await cacheDelete(`following:${followerId}`);
    await cacheDelete(`followers:${followingId}`);
    return true;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return false;
  }
};

// ============ Session Operations ============

export const createSession = async (
  userId: string,
  sessionToken?: string
): Promise<string> => {
  try {
    const token = sessionToken || generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = new Session({
      userId: new mongoose.Types.ObjectId(userId),
      token,
      expiresAt,
    });
    await session.save();

    return token;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const getSessionUser = async (sessionToken: string) => {
  try {
    const session = await Session.findOne({ token: sessionToken });
    if (!session || new Date() > session.expiresAt) {
      if (session) await Session.deleteOne({ _id: session._id });
      return null;
    }

    return getUserById(session.userId.toString());
  } catch (error) {
    console.error("Error getting session user:", error);
    return null;
  }
};

export const deleteSession = async (sessionToken: string): Promise<boolean> => {
  try {
    await Session.deleteOne({ token: sessionToken });
    return true;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
};
