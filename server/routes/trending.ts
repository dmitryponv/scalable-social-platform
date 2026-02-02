import { RequestHandler } from "express";
import { getAllPosts } from "../db";
import type { GetTrendingResponse } from "@shared/api";

/**
 * Extract hashtags from a string
 */
const extractHashtags = (text: string): string[] => {
  const hashtagRegex = /#[a-zA-Z0-9_]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map((tag) => tag.toLowerCase()) : [];
};

/**
 * GET /api/trending
 * Get trending hashtags
 */
export const handleGetTrending: RequestHandler = async (req, res) => {
  try {
    const hashtagCounts = new Map<string, number>();

    // Count hashtags from all posts
    const posts = await getAllPosts();
    for (const post of posts) {
      const tags = extractHashtags(post.content);
      for (const tag of tags) {
        hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1);
      }
    }

    // Convert to array and sort by count
    const trending = Array.from(hashtagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 trending

    // If less than 10, add mock trending tags
    if (trending.length < 10) {
      const mockTrending = [
        { tag: "#React", count: 2500000 },
        { tag: "#WebDev", count: 1800000 },
        { tag: "#TypeScript", count: 1200000 },
        { tag: "#Design", count: 956000 },
        { tag: "#Tech", count: 850000 },
        { tag: "#JavaScript", count: 745000 },
        { tag: "#StartUp", count: 620000 },
        { tag: "#AI", count: 580000 },
        { tag: "#OpenSource", count: 450000 },
        { tag: "#Community", count: 390000 },
      ];

      // Add mock tags only if we don't already have them
      for (const mockTag of mockTrending) {
        if (!trending.find((t) => t.tag === mockTag.tag)) {
          trending.push(mockTag);
        }
        if (trending.length >= 10) break;
      }
    }

    return res.json({
      success: true,
      trending: trending.slice(0, 10),
    } as GetTrendingResponse);
  } catch (error) {
    console.error("Get trending error:", error);
    return res.status(500).json({
      success: false,
      trending: [],
      message: "Internal server error",
    } as GetTrendingResponse);
  }
};

/**
 * GET /api/search
 * Search posts and users
 */
export const handleSearch: RequestHandler = async (req, res) => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      return res.json({
        success: true,
        posts: [],
        users: [],
      });
    }

    const searchLower = query.toLowerCase();

    // Search posts by content
    const posts = getAllPosts()
      .filter((post) =>
        post.content.toLowerCase().includes(searchLower)
      )
      .slice(0, 20); // Limit to 20 results

    return res.json({
      success: true,
      results: {
        postCount: posts.length,
        query,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/hashtag/:tag
 * Get posts with a specific hashtag
 */
export const handleGetHashtagPosts: RequestHandler = async (req, res) => {
  try {
    const { tag } = req.params;
    const searchTag = tag.toLowerCase().startsWith("#")
      ? tag.toLowerCase()
      : `#${tag.toLowerCase()}`;

    const posts = getAllPosts()
      .filter((post) => post.content.toLowerCase().includes(searchTag))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return res.json({
      success: true,
      hashtag: searchTag,
      count: posts.length,
      posts: posts.slice(0, 50), // Limit to 50 posts
    });
  } catch (error) {
    console.error("Get hashtag posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
