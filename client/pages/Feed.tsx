import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      handle: "@sarahchen",
    },
    timestamp: "2 hours ago",
    content:
      "Just launched my new project! Super excited to share it with everyone. Been working on this for months 🚀",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    likes: 324,
    comments: 42,
    shares: 108,
    liked: false,
  },
  {
    id: "2",
    author: {
      name: "Alex Morgan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      handle: "@alexmorgan",
    },
    timestamp: "4 hours ago",
    content:
      "The future of web development is here. Check out this amazing new framework that just dropped! #WebDev #Tech",
    likes: 542,
    comments: 78,
    shares: 234,
    liked: false,
  },
  {
    id: "3",
    author: {
      name: "Jordan Lee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      handle: "@jordanlee",
    },
    timestamp: "6 hours ago",
    content:
      "Finally finished my design system! 16 months of work has paid off. So proud of what we accomplished as a team 🎨",
    likes: 892,
    comments: 156,
    shares: 445,
    liked: false,
  },
];

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({
    "1": [
      {
        id: "c1",
        author: {
          name: "Sam Park",
          handle: "@sampark",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
        },
        content: "This looks amazing! Congrats on the launch 🎉",
        timestamp: "1 hour ago",
      },
    ],
  });
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post: Post = {
        id: `new-${Date.now()}`,
        author: {
          name: "You",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
          handle: "@yourhandle",
        },
        timestamp: "now",
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (newComments[postId]?.trim()) {
      const comment: Comment = {
        id: `c-${Date.now()}`,
        author: {
          name: "You",
          handle: "@yourhandle",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        },
        content: newComments[postId],
        timestamp: "now",
      };
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment],
      }));
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
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
              <button className="btn-social-ghost p-2">
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
                <Link to="/" className="flex items-center gap-3 btn-social-ghost text-foreground">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link to="/feed" className="flex items-center gap-3 btn-social-ghost text-foreground">
                  <Compass className="w-5 h-5" />
                  <span>Explore</span>
                </Link>
                <Link to="/feed" className="flex items-center gap-3 btn-social-ghost text-foreground">
                  <BookMarked className="w-5 h-5" />
                  <span>Bookmarks</span>
                </Link>
                <Link to="/feed" className="flex items-center gap-3 btn-social-ghost text-foreground">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              </div>

              <button className="w-full btn-social-primary justify-center">
                Create Post
              </button>

              {/* Stats */}
              <div className="post-card space-y-4">
                <h3 className="font-bold text-lg">What's trending</h3>
                <div className="space-y-3">
                  {[
                    { tag: "#React", count: "2.5M" },
                    { tag: "#WebDev", count: "1.8M" },
                    { tag: "#TypeScript", count: "1.2M" },
                    { tag: "#Design", count: "956K" },
                  ].map((item) => (
                    <div key={item.tag} className="hover:bg-muted/50 p-2 rounded transition-colors cursor-pointer">
                      <p className="font-semibold text-sm">{item.tag}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} posts
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
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
                      <button
                        type="button"
                        className="btn-social-ghost p-2"
                      >
                        <Image className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        className="btn-social-ghost p-2"
                      >
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
                        {post.author.handle} · {post.timestamp}
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
                    onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
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
                            {comment.timestamp}
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
                  {[
                    { name: "Tech Daily", handle: "@techdaily" },
                    { name: "Code Master", handle: "@codemaster" },
                    { name: "Design Lab", handle: "@designlab" },
                    { name: "Web Weekly", handle: "@webweekly" },
                  ].map((user) => (
                    <div
                      key={user.handle}
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
                      <button className="btn-social-primary px-4 py-1 text-xs">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
