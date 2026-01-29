/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// ============ User Types ============
export interface User {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  bio?: string;
}

// ============ Authentication ============
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
}

export interface AuthUser extends User {
  id: string;
}

// ============ Post Types ============
export interface Post {
  id: string;
  authorId: string;
  author: UserPublic;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  content: string;
  image?: string;
}

export interface CreatePostResponse {
  success: boolean;
  post?: Post;
  message?: string;
}

export interface GetFeedResponse {
  success: boolean;
  posts: Post[];
  message?: string;
}

export interface PostEngagementResponse {
  success: boolean;
  message?: string;
}

// ============ Comment Types ============
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: UserPublic;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateCommentResponse {
  success: boolean;
  comment?: Comment;
  message?: string;
}

export interface GetCommentsResponse {
  success: boolean;
  comments: Comment[];
  message?: string;
}

// ============ User Interaction Types ============
export interface FollowResponse {
  success: boolean;
  message?: string;
}

export interface GetSuggestionsResponse {
  success: boolean;
  users: UserPublic[];
  message?: string;
}

// ============ Trending Types ============
export interface TrendingTag {
  tag: string;
  count: number;
}

export interface GetTrendingResponse {
  success: boolean;
  trending: TrendingTag[];
  message?: string;
}

// ============ Error Response ============
export interface ErrorResponse {
  success: false;
  message: string;
  statusCode?: number;
}

// ============ Example response type for /api/demo ============
export interface DemoResponse {
  message: string;
}
