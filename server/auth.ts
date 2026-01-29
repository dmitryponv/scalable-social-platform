import { Request, Response, NextFunction } from "express";
import { getSessionUser, deleteSession } from "./db";
import type { AuthUser } from "@shared/api";

/**
 * Simple password hashing (for demo purposes)
 * In production, use bcrypt: npm install bcrypt
 * 
 * Example with bcrypt:
 * import bcrypt from "bcrypt";
 * export const hashPassword = (password: string) => bcrypt.hash(password, 10);
 * export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);
 */

// Simple hash function for demo (DO NOT USE IN PRODUCTION)
// In production, use bcrypt or similar
export const hashPassword = (password: string): string => {
  // For demo only - use bcrypt in production
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36) + password.length;
};

export const comparePassword = (
  password: string,
  hash: string
): boolean => {
  // For demo only - use bcrypt in production
  return hashPassword(password) === hash;
};

// Generate a secure session token
export const generateSessionToken = (): string => {
  return Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2);
};

// Extend Express Request to include user and cookies
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      sessionToken?: string;
      cookies?: Record<string, string>;
    }
  }
}

/**
 * Authentication middleware
 * Checks for valid session token in cookies and sets req.user
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionToken = req.cookies?.sessionToken;

  if (sessionToken) {
    const user = getSessionUser(sessionToken);
    if (user) {
      req.user = user as AuthUser;
      req.sessionToken = sessionToken;
    }
  }

  next();
};

/**
 * Require authentication middleware
 * Use this on protected routes
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Please log in",
    });
  }
  next();
};

/**
 * Validation helpers
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isValidHandle = (handle: string): boolean => {
  const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return handleRegex.test(handle);
};
