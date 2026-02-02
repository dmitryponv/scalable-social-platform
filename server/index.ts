import "dotenv/config";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./auth";
import { connectDB } from "./config/database";
import { initializeCache } from "./config/cache";
import { initializeGoogleOAuth } from "./config/oauth";

// Route handlers
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, handleLogout, handleGetMe } from "./routes/auth";
import { handleCreatePost, handleGetFeed, handleGetPost, handleLikePost, handleUnlikePost, handleSharePost } from "./routes/posts";
import { handleCreateComment, handleGetComments, handleDeleteComment } from "./routes/comments";
import { handleGetUser, handleGetSuggestions, handleFollowUser, handleUnfollowUser, handleGetFollowers, handleGetFollowing } from "./routes/users";
import { handleGetTrending, handleSearch, handleGetHashtagPosts } from "./routes/trending";

export function createServer() {
  const app = express();

  // Initialize database and external services
  (async () => {
    try {
      await connectDB();
      await initializeCache();
      initializeGoogleOAuth();
    } catch (error) {
      console.error("Failed to initialize services:", error);
    }
  })();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Parse cookies from request headers (since we're using cookie-based sessions)
  app.use((req, res, next) => {
    const cookies: Record<string, string> = {};
    if (req.headers.cookie) {
      req.headers.cookie.split("; ").forEach((cookie) => {
        const [key, value] = cookie.split("=");
        cookies[key] = decodeURIComponent(value);
      });
    }
    req.cookies = cookies;
    next();
  });

  // Authentication middleware
  app.use(authMiddleware);

  // ============ Health Check ============
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ============ Authentication Routes ============
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/me", handleGetMe);

  // ============ Post Routes ============
  app.post("/api/posts", handleCreatePost);
  app.get("/api/posts", handleGetFeed);
  app.get("/api/posts/:id", handleGetPost);
  app.post("/api/posts/:id/like", handleLikePost);
  app.post("/api/posts/:id/unlike", handleUnlikePost);
  app.post("/api/posts/:id/share", handleSharePost);

  // ============ Comment Routes ============
  app.post("/api/posts/:postId/comments", handleCreateComment);
  app.get("/api/posts/:postId/comments", handleGetComments);
  app.delete("/api/comments/:id", handleDeleteComment);

  // ============ User Routes ============
  app.get("/api/users/:id", handleGetUser);
  app.get("/api/users/suggestions", handleGetSuggestions);
  app.post("/api/users/:id/follow", handleFollowUser);
  app.post("/api/users/:id/unfollow", handleUnfollowUser);
  app.get("/api/users/:id/followers", handleGetFollowers);
  app.get("/api/users/:id/following", handleGetFollowing);

  // ============ Trending & Search Routes ============
  app.get("/api/trending", handleGetTrending);
  app.get("/api/search", handleSearch);
  app.get("/api/hashtag/:tag", handleGetHashtagPosts);

  // ============ Error Handling ============
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  });

  return app;
}
