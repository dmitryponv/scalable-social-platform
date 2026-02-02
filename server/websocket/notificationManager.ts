/**
 * WebSocket Notification Manager
 * 
 * Handles real-time notifications using WebSockets
 * Supports multiple notification types and user subscriptions
 */

import { Server as SocketIOServer, Socket } from "socket.io";
import mongoose, { Schema, Document, Model } from "mongoose";

export type NotificationType =
  | "post_liked"
  | "comment_added"
  | "user_followed"
  | "post_mentioned"
  | "new_message"
  | "system";

export interface INotification extends Document {
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: Date;
  expiresAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: { type: String, required: true, index: true },
    senderId: { type: String },
    type: {
      type: String,
      enum: [
        "post_liked",
        "comment_added",
        "user_followed",
        "post_mentioned",
        "new_message",
        "system",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false, index: true },
    createdAt: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
);

// TTL index to auto-delete old notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

/**
 * Notification Manager
 */
export class NotificationManager {
  private io: SocketIOServer;
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupConnectionHandlers();
  }

  /**
   * Setup WebSocket connection handlers
   */
  private setupConnectionHandlers(): void {
    this.io.on("connection", (socket: Socket) => {
      const userId = socket.handshake.auth.userId;

      if (!userId) {
        socket.disconnect();
        return;
      }

      // Register user socket
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(socket.id);

      // Join user's notification room
      socket.join(`user:${userId}`);

      // Handle disconnect
      socket.on("disconnect", () => {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            this.userSockets.delete(userId);
          }
        }
      });

      // Handle mark as read
      socket.on("notification:read", async (notificationId: string) => {
        try {
          await Notification.updateOne(
            { _id: notificationId, recipientId: userId },
            { read: true }
          );
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      });

      // Handle mark all as read
      socket.on("notification:read-all", async () => {
        try {
          await Notification.updateMany(
            { recipientId: userId, read: false },
            { read: true }
          );

          this.io.to(`user:${userId}`).emit("notification:all-read");
        } catch (error) {
          console.error("Error marking all notifications as read:", error);
        }
      });
    });
  }

  /**
   * Send notification to user
   */
  async sendNotification(
    recipientId: string,
    type: NotificationType,
    title: string,
    message: string,
    data: Record<string, any> = {},
    senderId?: string
  ): Promise<INotification> {
    try {
      // Save to database
      const notification = await Notification.create({
        recipientId,
        senderId,
        type,
        title,
        message,
        data,
      });

      // Send via WebSocket if user is online
      this.io.to(`user:${recipientId}`).emit("notification:new", {
        id: notification._id,
        type,
        title,
        message,
        data,
        createdAt: notification.createdAt,
      });

      return notification;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  /**
   * Notify post likes
   */
  async notifyPostLike(postAuthorId: string, likerName: string, postId: string): Promise<void> {
    await this.sendNotification(
      postAuthorId,
      "post_liked",
      "Post Liked",
      `${likerName} liked your post`,
      { postId, likerName }
    );
  }

  /**
   * Notify comments
   */
  async notifyPostComment(postAuthorId: string, commenterName: string, postId: string, commentId: string): Promise<void> {
    await this.sendNotification(
      postAuthorId,
      "comment_added",
      "New Comment",
      `${commenterName} commented on your post`,
      { postId, commentId, commenterName }
    );
  }

  /**
   * Notify follows
   */
  async notifyUserFollow(followedUserId: string, followerName: string, followerId: string): Promise<void> {
    await this.sendNotification(
      followedUserId,
      "user_followed",
      "New Follower",
      `${followerName} followed you`,
      { followerId, followerName }
    );
  }

  /**
   * Notify mentions
   */
  async notifyMention(mentionedUserId: string, mentionerName: string, postId: string): Promise<void> {
    await this.sendNotification(
      mentionedUserId,
      "post_mentioned",
      "Mentioned in Post",
      `${mentionerName} mentioned you in a post`,
      { postId, mentionerName }
    );
  }

  /**
   * Send system notification
   */
  async sendSystemNotification(
    recipientId: string,
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<void> {
    await this.sendNotification(
      recipientId,
      "system",
      title,
      message,
      data || {}
    );
  }

  /**
   * Broadcast to all users
   */
  broadcastToAll(
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>
  ): void {
    this.io.emit("notification:broadcast", {
      type,
      title,
      message,
      data: data || {},
      timestamp: new Date(),
    });
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 20, skip: number = 0): Promise<INotification[]> {
    try {
      const notifications = await Notification.find({ recipientId: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

      return notifications;
    } catch (error) {
      console.error("Error getting user notifications:", error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await Notification.countDocuments({
        recipientId: userId,
        read: false,
      });

      return count;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  /**
   * Get active users count
   */
  getActiveUsersCount(): number {
    return this.userSockets.size;
  }
}
