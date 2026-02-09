import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  Home,
  Compass,
  BookMarked,
  User,
  LogOut,
  MoreHorizontal,
  Image,
  Smile,
  TrendingUp,
  Loader,
} from "lucide-react";
import type { Post, Comment } from "@shared/api";

const TrendingWidget = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const response = await fetch("/api/trending");
        const data = await response.json();
        if (data.success) {
          setTrending(data.trending);
        }
      } catch (err) {
        console.error("Failed to load trending:", err);
      } finally {
        setTrendingLoading(false);
      }
    };

    loadTrending();
  }, []);

  return (
    <div className="post-card space-y-4">
      <h3 className="font-bold text-lg">What's trending</h3>
      {trendingLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-3">
          {trending.map((item) => (
            <div
              key={item.tag}
              className="trending-item p-2 rounded transition-colors cursor-pointer"
            >
              <p className="font-semibold text-sm">{item.tag}</p>
              <p className="text-xs text-muted-foreground">
                {item.count.toLocaleString()} posts
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>(
    {},
  );
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load posts and suggestions on mount
  useEffect(() => {
    loadFeed();
    loadSuggestions();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      } else {
        setError(data.message || "Failed to load feed");
      }
    } catch (err) {
      console.error("Failed to load feed:", err);
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await fetch("/api/users/suggestions", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setSuggestions(data.users);
      }
    } catch (err) {
      console.error("Failed to load suggestions:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  const handleFollowUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setSuggestions((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err) {
      console.error("Failed to follow user:", err);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const endpoint = post.liked
        ? `/api/posts/${postId}/unlike`
        : `/api/posts/${postId}/like`;
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                liked: !p.liked,
                likes: p.liked ? p.likes - 1 : p.likes + 1,
              };
            }
            return p;
          }),
        );
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: newPost,
        }),
      });

      const data = await response.json();

      if (data.success && data.post) {
        setPosts([data.post, ...posts]);
        setNewPost("");
      } else {
        setError(data.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Failed to create post");
    }
  };

  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newComments[postId]?.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: newComments[postId],
        }),
      });

      const data = await response.json();

      if (data.success && data.comment) {
        setPostComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment],
        }));
        setNewComments((prev) => ({ ...prev, [postId]: "" }));
      } else {
        console.error(data.message || "Failed to create comment");
      }
    } catch (err) {
      console.error("Failed to create comment:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card-50 sticky top-0 z-40" style={{ backdropFilter: 'blur(4px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline gradient-primary-text">
                Connect
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6 flex-1 max-w-xs mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-input border border-border rounded-full pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-social-ghost p-2">
                <Heart className="w-5 h-5" />
              </button>
              <button className="btn-social-ghost p-2">
                <User className="w-5 h-5" />
              </button>
              <button onClick={handleLogout} className="btn-social-ghost p-2">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="post-card p-4 space-y-3">
                <Link
                  to="/"
                  className="flex items-center gap-3 btn-social-ghost text-foreground"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/feed"
                  className="flex items-center gap-3 btn-social-ghost text-foreground"
                >
                  <Compass className="w-5 h-5" />
                  <span>Explore</span>
                </Link>
                <Link
                  to="/feed"
                  className="flex items-center gap-3 btn-social-ghost text-foreground"
                >
                  <BookMarked className="w-5 h-5" />
                  <span>Bookmarks</span>
                </Link>
                <Link
                  to="/feed"
                  className="flex items-center gap-3 btn-social-ghost text-foreground"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              </div>

              <button className="w-full btn-social-primary justify-center">
                Create Post
              </button>

              {/* Stats */}
              <TrendingWidget />
            </div>
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {loading ? (
              <div className="post-card flex items-center justify-center py-12">
                <Loader className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading feed...
                </span>
              </div>
            ) : posts.length === 0 ? (
              <div className="post-card text-center py-12">
                <p className="text-muted-foreground">
                  No posts yet. Be the first to share something!
                </p>
              </div>
            ) : null}

            {/* Create Post */}
            <div className="post-card">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0"></div>
                <form onSubmit={handlePostSubmit} className="flex-1 space-y-4">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button type="button" className="btn-social-ghost p-2">
                        <Image className="w-5 h-5" />
                      </button>
                      <button type="button" className="btn-social-ghost p-2">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!newPost.trim()}
                      className="btn-social-primary disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.author.handle} ·{" "}
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button className="btn-social-ghost p-2">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-foreground mb-4">{post.content}</p>

                {/* Post Image */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full rounded-lg mb-4 object-cover max-h-96"
                  />
                )}

                {/* Engagement Stats */}
                <div className="flex gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                  <span>{post.likes} Likes</span>
                  <span>{post.comments} Comments</span>
                  <span>{post.shares} Shares</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 btn-social-ghost justify-center py-2 ${
                      post.liked ? "text-primary" : ""
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${post.liked ? "fill-current" : ""}`}
                    />
                    <span className="text-sm">Like</span>
                  </button>
                  <button
                    onClick={() =>
                      setExpandedPostId(
                        expandedPostId === post.id ? null : post.id,
                      )
                    }
                    className="flex-1 btn-social-ghost justify-center py-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Comment</span>
                  </button>
                  <button className="flex-1 btn-social-ghost justify-center py-2">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedPostId === post.id && (
                  <div className="space-y-4 border-t border-border pt-4">
                    {/* Existing Comments */}
                    {postComments[post.id]?.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="font-semibold text-sm">
                              {comment.author.name}
                            </p>
                            <p className="text-foreground text-sm">
                              {comment.content}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <form
                      onSubmit={(e) => handleCommentSubmit(post.id, e)}
                      className="flex gap-3 mt-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0"></div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={newComments[post.id] || ""}
                          onChange={(e) =>
                            setNewComments((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          placeholder="Write a comment..."
                          className="flex-1 bg-input border border-border rounded-full px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          type="submit"
                          disabled={!newComments[post.id]?.trim()}
                          className="btn-social-primary px-4 py-2 disabled:opacity-50"
                        >
                          Post
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="post-card space-y-4">
                <h3 className="font-bold text-lg">Suggestions For You</h3>
                <div className="space-y-4">
                  {suggestions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No suggestions available
                    </p>
                  ) : (
                    suggestions.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                          <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.handle}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleFollowUser(user.id)}
                          className="btn-social-primary px-4 py-1 text-xs"
                        >
                          Follow
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
