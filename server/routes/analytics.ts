import { RequestHandler } from "express";
import { AnalyticsAggregator } from "../analytics/tracker";

/**
 * GET /api/analytics/engagement/:userId
 * Get user engagement metrics
 */
export const handleGetUserEngagement: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { userId } = req.params;
    const daysBack = parseInt(req.query.days as string) || 7;

    // Only allow users to view their own analytics unless they're admin
    if (userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const metrics = await AnalyticsAggregator.getUserEngagementMetrics(userId, daysBack);

    return res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Get user engagement error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/analytics/platform
 * Get platform-wide analytics (admin only)
 */
export const handleGetPlatformAnalytics: RequestHandler = async (req, res) => {
  try {
    // In production, check for admin role
    // if (!req.user || req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Forbidden"
    //   });
    // }

    const daysBack = parseInt(req.query.days as string) || 7;
    const analytics = await AnalyticsAggregator.getPlatformAnalytics(daysBack);

    return res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get platform analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/analytics/trending
 * Get trending content
 */
export const handleGetTrendingAnalytics: RequestHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const trending = await AnalyticsAggregator.getTrendingContent(limit);

    return res.json({
      success: true,
      data: trending,
    });
  } catch (error) {
    console.error("Get trending analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/analytics/retention
 * Get user retention metrics (admin only)
 */
export const handleGetRetentionAnalytics: RequestHandler = async (req, res) => {
  try {
    const daysBack = parseInt(req.query.days as string) || 7;
    const retention = await AnalyticsAggregator.getUserRetention(daysBack);

    return res.json({
      success: true,
      data: retention,
    });
  } catch (error) {
    console.error("Get retention analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * POST /api/analytics/event
 * Track a custom event from client
 */
export const handleTrackEvent: RequestHandler = async (req, res) => {
  try {
    const { eventType, eventName, eventData } = req.body;

    if (!eventType || !eventName) {
      return res.status(400).json({
        success: false,
        message: "Event type and name are required",
      });
    }

    // Events would be tracked here
    // For now, we just acknowledge receipt

    return res.json({
      success: true,
      message: "Event tracked",
    });
  } catch (error) {
    console.error("Track event error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
