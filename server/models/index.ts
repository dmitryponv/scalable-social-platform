/**
 * MongoDB Schemas and Models
 *
 * This file defines all MongoDB schemas and models for the social media app.
 *
 * Installation required:
 * npm install mongoose bcryptjs
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import bcryptjs from "bcryptjs";

// ============ User Schema ============
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  handle: string;
  avatar?: string;
  bio?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: null }, // Null for OAuth users
    handle: { type: String, required: true, unique: true },
    avatar: { type: String },
    bio: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next(); // Skip for OAuth users

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  if (!this.password) return false;
  return bcryptjs.compare(password, this.password);
};

// ============ Post Schema ============
export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  content: string;
  image?: string;
  likedBy: mongoose.Types.ObjectId[];
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    image: { type: String },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    shares: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Index for faster queries
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

// ============ Comment Schema ============
export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

commentSchema.index({ postId: 1, createdAt: -1 });

// ============ Follow Schema ============
export interface IFollow extends Document {
  followerId: mongoose.Types.ObjectId;
  followingId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const followSchema = new Schema<IFollow>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

followSchema.index({ followerId: 1 });
followSchema.index({ followingId: 1 });
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// ============ Session Schema ============
export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Auto-delete expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============ Export Models ============
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);

export const Follow: Model<IFollow> =
  mongoose.models.Follow || mongoose.model<IFollow>("Follow", followSchema);

export const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);
