/**
 * Google OAuth Configuration
 *
 * Handles Google OAuth 2.0 authentication flow.
 *
 * Setup required:
 * 1. Create a Google Cloud project at https://console.cloud.google.com
 * 2. Create OAuth 2.0 credentials (Web application)
 * 3. Set authorized redirect URIs:
 *    - http://localhost:5173 (development)
 *    - http://localhost:5173/auth/google/callback
 * 4. Add environment variables:
 *    - GOOGLE_CLIENT_ID=your_client_id
 *    - GOOGLE_CLIENT_SECRET=your_client_secret
 *
 * Installation required:
 * npm install google-auth-library
 */

import { OAuth2Client } from "google-auth-library";

let googleClient: OAuth2Client | null = null;

export const initializeGoogleOAuth = (): OAuth2Client | null => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:5173/auth/google/callback";

  if (!clientId || !clientSecret) {
    console.warn(
      "Google OAuth credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
    );
    return null;
  }

  googleClient = new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri,
  });

  console.log("Google OAuth configured successfully");
  return googleClient;
};

export const getGoogleClient = (): OAuth2Client | null => googleClient;

export const getGoogleAuthUrl = (): string => {
  if (!googleClient) {
    throw new Error("Google OAuth client not initialized");
  }

  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  return url;
};

export interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

export const verifyGoogleToken = async (
  token: string,
): Promise<GoogleTokenPayload | null> => {
  if (!googleClient) {
    throw new Error("Google OAuth client not initialized");
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload() as GoogleTokenPayload | undefined;
    return payload || null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const getGoogleAuthCode = async (
  code: string,
): Promise<{
  accessToken: string;
  idToken: string;
  refreshToken: string | null;
  expiresIn: number;
} | null> => {
  if (!googleClient) {
    throw new Error("Google OAuth client not initialized");
  }

  try {
    const { tokens } = await googleClient.getToken(code);
    return {
      accessToken: tokens.access_token || "",
      idToken: tokens.id_token || "",
      refreshToken: tokens.refresh_token || null,
      expiresIn: tokens.expiry_date ? tokens.expiry_date - Date.now() : 3600,
    };
  } catch (error) {
    console.error("Failed to get auth code:", error);
    return null;
  }
};
