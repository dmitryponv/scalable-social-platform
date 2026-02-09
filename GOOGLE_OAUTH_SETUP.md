# Google OAuth Setup Guide

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" > "New Project"
3. Enter a project name (e.g., "Social Media App")
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Cloud Console, click the search bar at the top
2. Search for "Google+ API"
3. Click on "Google+ API" and then "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. In Cloud Console, go to **Credentials** (left sidebar)
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the **OAuth consent screen** first:
   - Choose **External** user type
   - Fill in required app information
   - Add scopes: `userinfo.profile` and `userinfo.email`
   - Add test users (your email address)
   - Save

4. Back to creating OAuth Client ID:
   - Select **Web application**
   - Name it "Social Media App"
   - Under "Authorized JavaScript origins", add:
     - `http://localhost:5173` (local development)
     - `http://localhost` (local)
     - `https://localhost:5443` (Docker HTTPS local)
     - Your production domain if applicable
   
   - Under "Authorized redirect URIs", add:
     - `http://localhost:5173/auth/google/callback` (local dev)
     - `https://localhost:5443/auth/google/callback` (Docker)
     - `https://yourdomain.com/auth/google/callback` (production)

5. Click "Create"
6. A dialog appears with your credentials - copy them!

## Step 4: Add Credentials to Your App

### For Local Development:

Edit or create a `.env` file in the root directory:

```bash
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### For Docker (HTTPS):

If running with Docker and HTTPS enabled, use:

```bash
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URI=https://localhost:5443/auth/google/callback
```

### For Production:

Replace with your actual domain:

```bash
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

## Step 5: Verify the Setup

1. Start the dev server: `pnpm run dev`
2. Visit `http://localhost:5173`
3. Click "Get Started" or "Sign In"
4. Click "Continue with Google" button
5. You should see the Google login screen
6. After signing in, you'll be redirected back to your app

## Troubleshooting

### Error: "Google OAuth not configured"
- Make sure your `.env` file has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Restart the dev server after adding credentials

### Error: "redirect_uri_mismatch"
- The `GOOGLE_REDIRECT_URI` doesn't match what's registered in Google Cloud Console
- Make sure the URL in your app matches exactly what you added in "Authorized redirect URIs"
- Restart the dev server after changing the URI

### "Credentials not found" in Console
- Check that environment variables are loaded properly
- For Docker: ensure the `.env` file is in the root directory
- Verify the variable names are exactly: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

## Security Notes

⚠️ **Never commit `.env` file to git** - it contains secrets
- The `.env` file is already in `.gitignore`
- For production, use environment variables from your hosting provider (Netlify, Vercel, etc.)
- Use strong, random values for all secret credentials

## Code Flow

1. User clicks "Continue with Google" button
2. Frontend calls `/api/auth/google` to get Google OAuth URL
3. User redirected to Google login
4. Google redirects back to `/auth/google/callback` with `code` parameter
5. Frontend (GoogleCallback.tsx) sends `code` to backend `/api/auth/google/callback`
6. Backend exchanges `code` for `idToken` and creates user session
7. User redirected to `/feed` page

## References

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OAuth 2.0 Authorization Code Flow](https://developers.google.com/identity/protocols/oauth2/web-server)
