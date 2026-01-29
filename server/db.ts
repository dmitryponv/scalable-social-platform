/**
 * Database Models and Storage
 * 
 * In this demo, we use in-memory storage.
 * For production, replace with MongoDB or your preferred database.
 * 
 * MongoDB examples for each model:
 * - Users collection: { _id, name, email, password, handle, avatar, bio, createdAt }
 * - Posts collection: { _id, authorId, content, image, likes: [], comments: [], shares: [], createdAt }
 * - Comments collection: { _id, postId, authorId, content, createdAt }
 * - Follows collection: { _id, followerId, followingId, createdAt }
 */

// In-memory storage (replace with MongoDB in production)
export const db = {
  users: new Map<
    string,
    {
      id: string;
      name: string;
      email: string;
      password: string; // In production, use hashed password
      handle: string;
      avatar?: string;
      bio?: string;
      createdAt: Date;
      updatedAt: Date;
    }
  >(),

  posts: new Map<
    string,
    {
      id: string;
      authorId: string;
      content: string;
      image?: string;
      likedBy: Set<string>; // User IDs that liked this post
      shares: number;
      createdAt: Date;
      updatedAt: Date;
    }
  >(),

  comments: new Map<
    string,
    {
      id: string;
      postId: string;
      authorId: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    }
  >(),

  follows: new Map<
    string,
    {
      id: string;
      followerId: string;
      followingId: string;
      createdAt: Date;
    }
  >(),

  sessions: new Map<
    string,
    {
      userId: string;
      createdAt: Date;
      expiresAt: Date;
    }
  >(),
};

// Helper functions for data access
export const generateId = () => Math.random().toString(36).substring(2, 15);

export const getUserById = (id: string) => db.users.get(id);
export const getUserByEmail = (email: string) => {
  for (const user of db.users.values()) {
    if (user.email === email) return user;
  }
  return undefined;
};
export const getUserByHandle = (handle: string) => {
  for (const user of db.users.values()) {
    if (user.handle === handle) return user;
  }
  return undefined;
};

export const getPostById = (id: string) => db.posts.get(id);
export const getAllPosts = () => Array.from(db.posts.values());
export const getUserPosts = (userId: string) =>
  Array.from(db.posts.values()).filter((post) => post.authorId === userId);

export const getCommentById = (id: string) => db.comments.get(id);
export const getPostComments = (postId: string) =>
  Array.from(db.comments.values()).filter((c) => c.postId === postId);

export const getUserFollowing = (userId: string) =>
  Array.from(db.follows.values())
    .filter((f) => f.followerId === userId)
    .map((f) => f.followingId);

export const getUserFollowers = (userId: string) =>
  Array.from(db.follows.values())
    .filter((f) => f.followingId === userId)
    .map((f) => f.followerId);

export const isUserFollowing = (followerId: string, followingId: string) => {
  for (const follow of db.follows.values()) {
    if (follow.followerId === followerId && follow.followingId === followingId) {
      return true;
    }
  }
  return false;
};

// Session management
export const createSession = (userId: string, sessionToken: string) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  db.sessions.set(sessionToken, {
    userId,
    createdAt: new Date(),
    expiresAt,
  });
  return sessionToken;
};

export const getSessionUser = (sessionToken: string) => {
  const session = db.sessions.get(sessionToken);
  if (!session || new Date() > session.expiresAt) {
    db.sessions.delete(sessionToken);
    return null;
  }
  return getUserById(session.userId);
};

export const deleteSession = (sessionToken: string) => {
  db.sessions.delete(sessionToken);
};
