/**
 * Analytics Tracker
 * 
 * Tracks user engagement and interactions
 * Events are stored in MongoDB for analysis
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalyticsEvent extends Document {
  userId?: string;
  sessionId: string;
  eventType: string;
  eventName: string;
  eventData: Record<string, any>;
  userAgent: string;
  ipAddress: string;
  pageUrl?: string;
  timestamp: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    userId: { type: String },
    sessionId: { type: String, required: true, index: true },
    eventType: {
      type: String,
      enum: [
        "page_view",
        "click",
        "form_submit",
        "post_create",
        "post_like",
        "post_comment",
        "user_follow",
        "search",
        "error",
      ],
      required: true,
      index: true,
    },
    eventName: { type: String, required: true },
    eventData: { type: Schema.Types.Mixed },
    userAgent: { type: String },
    ipAddress: { type: String, index: true },
    pageUrl: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

// TTL index to auto-delete events older than 90 days
analyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", analyticsEventSchema);

/**
 * Analytics Tracker Class
 */
export class AnalyticsTracker {
  private sessionId: string;
  private userId?: string;
  private ipAddress: string;
  private userAgent: string;

  constructor(sessionId: string, ipAddress: string, userAgent: string, userId?: string) {
    this.sessionId = sessionId;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.userId = userId;
  }

  /**
   * Track a general event
   */
  async trackEvent(
    eventType: string,
    eventName: string,
    eventData: Record<string, any> = {},
    pageUrl?: string
  ): Promise<void> {
    try {
      await AnalyticsEvent.create({
        userId: this.userId,
        sessionId: this.sessionId,
        eventType,
        eventName,
        eventData,
        userAgent: this.userAgent,
        ipAddress: this.ipAddress,
        pageUrl,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error tracking event:", error);
    }
  }

  /**
   * Track page view
   */
  async trackPageView(pageUrl: string, pageTitle: string): Promise<void> {
    await this.trackEvent("page_view", `Page View: ${pageTitle}`, { pageUrl, pageTitle }, pageUrl);
  }

  /**
   * Track post creation
   */
  async trackPostCreation(postId: string, contentLength: number): Promise<void> {
    await this.trackEvent("post_create", "Post Created", {
      postId,
      contentLength,
      timestamp: Date.now(),
    });
  }

  /**
   * Track post like
   */
  async trackPostLike(postId: string, authorId: string): Promise<void> {
    await this.trackEvent("post_like", "Post Liked", {
      postId,
      authorId,
      timestamp: Date.now(),
    });
  }

  /**
   * Track comment creation
   */
  async trackPostComment(postId: string, commentId: string): Promise<void> {
    await this.trackEvent("post_comment", "Comment Added", {
      postId,
      commentId,
      timestamp: Date.now(),
    });
  }

  /**
   * Track user follow
   */
  async trackUserFollow(followedUserId: string): Promise<void> {
    await this.trackEvent("user_follow", "User Followed", {
      followedUserId,
      timestamp: Date.now(),
    });
  }

  /**
   * Track search
   */
  async trackSearch(searchQuery: string, resultCount: number): Promise<void> {
    await this.trackEvent("search", "Search Query", {
      searchQuery,
      resultCount,
      timestamp: Date.now(),
    });
  }

  /**
   * Track error
   */
  async trackError(errorMessage: string, errorStack?: string): Promise<void> {
    await this.trackEvent("error", "Error Occurred", {
      errorMessage,
      errorStack,
      timestamp: Date.now(),
    });
  }
}

/**
 * Analytics Aggregator
 * Get insights from tracked events
 */
export class AnalyticsAggregator {
  /**
   * Get user engagement metrics
   */
  static async getUserEngagementMetrics(userId: string, daysBack: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const events = await AnalyticsEvent.find({
      userId,
      timestamp: { $gte: startDate },
    });

    const eventCounts = {
      pageViews: 0,
      postsCreated: 0,
      postsLiked: 0,
      commentsAdded: 0,
      usersFollowed: 0,
      searches: 0,
      errors: 0,
    };

    for (const event of events) {
      if (event.eventType === "page_view") eventCounts.pageViews++;
      if (event.eventType === "post_create") eventCounts.postsCreated++;
      if (event.eventType === "post_like") eventCounts.postsLiked++;
      if (event.eventType === "post_comment") eventCounts.commentsAdded++;
      if (event.eventType === "user_follow") eventCounts.usersFollowed++;
      if (event.eventType === "search") eventCounts.searches++;
      if (event.eventType === "error") eventCounts.errors++;
    }

    return {
      userId,
      period: `Last ${daysBack} days`,
      metrics: eventCounts,
      totalEvents: events.length,
    };
  }

  /**
   * Get platform-wide analytics
   */
  static async getPlatformAnalytics(daysBack: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const events = await AnalyticsEvent.find({
      timestamp: { $gte: startDate },
    });

    const uniqueUsers = new Set(events.map((e) => e.userId).filter(Boolean));
    const uniqueSessions = new Set(events.map((e) => e.sessionId));

    const eventCounts = {
      pageViews: 0,
      postsCreated: 0,
      postsLiked: 0,
      commentsAdded: 0,
      usersFollowed: 0,
      searches: 0,
      errors: 0,
    };

    for (const event of events) {
      if (event.eventType === "page_view") eventCounts.pageViews++;
      if (event.eventType === "post_create") eventCounts.postsCreated++;
      if (event.eventType === "post_like") eventCounts.postsLiked++;
      if (event.eventType === "post_comment") eventCounts.commentsAdded++;
      if (event.eventType === "user_follow") eventCounts.usersFollowed++;
      if (event.eventType === "search") eventCounts.searches++;
      if (event.eventType === "error") eventCounts.errors++;
    }

    return {
      period: `Last ${daysBack} days`,
      metrics: eventCounts,
      uniqueUsers: uniqueUsers.size,
      uniqueSessions: uniqueSessions.size,
      totalEvents: events.length,
      engagementRate: (eventCounts.postsCreated + eventCounts.postsLiked + eventCounts.commentsAdded) / uniqueUsers.size || 0,
    };
  }

  /**
   * Get trending content
   */
  static async getTrendingContent(limit: number = 10) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const likeEvents = await AnalyticsEvent.find({
      eventType: "post_like",
      timestamp: { $gte: sevenDaysAgo },
    });

    const postLikes: Record<string, number> = {};
    for (const event of likeEvents) {
      const postId = event.eventData?.postId;
      if (postId) {
        postLikes[postId] = (postLikes[postId] || 0) + 1;
      }
    }

    const trending = Object.entries(postLikes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([postId, count]) => ({
        postId,
        likes: count,
      }));

    return trending;
  }

  /**
   * Get user retention
   */
  static async getUserRetention(daysBack: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const events = await AnalyticsEvent.find({
      timestamp: { $gte: startDate },
      userId: { $ne: null },
    });

    const userActivityMap = new Map<string, Date[]>();

    for (const event of events) {
      if (!event.userId) continue;

      if (!userActivityMap.has(event.userId)) {
        userActivityMap.set(event.userId, []);
      }
      userActivityMap.get(event.userId)!.push(event.timestamp);
    }

    let activeDays = 0;
    const usersActive: Record<number, number> = {};

    for (const [, activities] of userActivityMap) {
      const uniqueDays = new Set(
        activities.map((d) => d.toISOString().split("T")[0])
      ).size;
      activeDays += uniqueDays;

      usersActive[uniqueDays] = (usersActive[uniqueDays] || 0) + 1;
    }

    return {
      totalActiveUsers: userActivityMap.size,
      averageDaysActive: activeDays / userActivityMap.size,
      userActivityDistribution: usersActive,
    };
  }
}
