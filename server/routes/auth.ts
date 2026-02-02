import { RequestHandler } from "express";
import {
  hashPassword,
  comparePassword,
  generateSessionToken,
  isValidEmail,
  isValidPassword,
  isValidHandle,
} from "../auth";
import { generateId, getUserByEmail, getUserByHandle, createSession, deleteSession, createUser } from "../db";
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, LogoutResponse } from "@shared/api";

/**
 * POST /api/auth/register
 * Register a new user
 */
export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body as RegisterRequest;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      } as RegisterResponse);
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      } as RegisterResponse);
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      } as RegisterResponse);
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      } as RegisterResponse);
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      } as RegisterResponse);
    }

    // Generate handle from name
    let handle = name.toLowerCase().replace(/\s+/g, "_");
    let counter = 1;
    while (await getUserByHandle(handle)) {
      handle = `${name.toLowerCase().replace(/\s+/g, "_")}_${counter}`;
      counter++;
    }

    // Create user
    const newUser = await createUser({
      name,
      email,
      password,
      handle,
    });

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
      } as RegisterResponse);
    }

    // Create session
    const sessionToken = await createSession(newUser.id);

    // Set session cookie (httpOnly for security)
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      user: newUser,
    } as RegisterResponse);
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    } as RegisterResponse);
  }
};

/**
 * POST /api/auth/login
 * Log in a user
 */
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      } as LoginResponse);
    }

    // Find user (with password hash for comparison)
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as LoginResponse);
    }

    // Check password using bcrypt (User model's comparePassword method)
    const { User } = await import("../models/index");
    const userDoc = await User.findOne({ email: email.toLowerCase() });
    if (!userDoc || !(await userDoc.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as LoginResponse);
    }

    // Create session
    const sessionToken = await createSession(user.id);

    // Set session cookie
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        handle: user.handle,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    } as LoginResponse);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    } as LoginResponse);
  }
};

/**
 * POST /api/auth/logout
 * Log out a user
 */
export const handleLogout: RequestHandler = async (req, res) => {
  try {
    const sessionToken = req.cookies?.sessionToken;
    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    res.clearCookie("sessionToken");

    return res.json({
      success: true,
    } as LogoutResponse);
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export const handleGetMe: RequestHandler = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  return res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      handle: req.user.handle,
      avatar: req.user.avatar,
      bio: req.user.bio,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  });
};

/**
 * GET /api/auth/google
 * Get Google OAuth URL
 */
export const handleGoogleAuthUrl: RequestHandler = async (req, res) => {
  try {
    const { getGoogleAuthUrl } = await import("../config/oauth");
    const url = getGoogleAuthUrl();
    return res.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("Google auth URL error:", error);
    return res.status(500).json({
      success: false,
      message: "Google OAuth not configured",
    });
  }
};

/**
 * POST /api/auth/google/callback
 * Handle Google OAuth callback
 */
export const handleGoogleCallback: RequestHandler = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "ID token is required",
      });
    }

    const { verifyGoogleToken, getGoogleClient } = await import("../config/oauth");
    const payload = await verifyGoogleToken(idToken);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Check if user exists with this email
    let user = await getUserByEmail(payload.email);

    // If not, create a new user
    if (!user) {
      // Generate a unique handle from email
      let handle = payload.email.split("@")[0].toLowerCase();
      let counter = 1;
      while (await getUserByHandle(handle)) {
        handle = `${payload.email.split("@")[0].toLowerCase()}_${counter}`;
        counter++;
      }

      user = await createUser({
        name: payload.name,
        email: payload.email,
        handle,
        avatar: payload.picture,
        googleId: payload.sub,
      });

      if (!user) {
        return res.status(500).json({
          success: false,
          message: "Failed to create user",
        });
      }
    }

    // Create session
    const sessionToken = await createSession(user.id);

    // Set session cookie
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        handle: user.handle,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Google callback error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
