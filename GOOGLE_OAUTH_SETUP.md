# Google OAuth 2.0 Setup Guide

This guide walks you through setting up Google OAuth 2.0 authentication for the Social Media App.

## Prerequisites

- Google account
- Access to Google Cloud Console (https://console.cloud.google.com)
- The app running locally or deployed

## Step 1: Create a Google Cloud Project

### 1.1 Go to Google Cloud Console
1. Open https://console.cloud.google.com
2. If you don't have a Google Cloud account, create one

### 1.2 Create a new project
1. Click on the project selector at the top of the page
2. Click "NEW PROJECT"
3. Enter project name: "Social Media App"
4. Click "CREATE"
5. Wait for the project to be created (it may take a minute)

## Step 2: Enable Google+ API

### 2.1 Enable the API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on "Google+ API"
4. Click the "ENABLE" button
5. Wait for it to be enabled

## Step 3: Create OAuth 2.0 Credentials

### 3.1 Go to Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click the "+ CREATE CREDENTIALS" button
3. Select "OAuth client ID"

### 3.2 Configure the OAuth Consent Screen
If this is your first time, you'll need to configure the consent screen:

1. Click "CONFIGURE CONSENT SCREEN"
2. Choose "External" for User Type
3. Click "CREATE"
4. Fill in the required information:
   - **App name**: "Connect - Social Media"
   - **User support email**: Your email address
   - **Developer contact**: Your email address
5. Click "SAVE AND CONTINUE"

### 3.3 Add Scopes
1. Click "ADD OR REMOVE SCOPES"
2. Search for and select:
   - `email`
   - `profile`
   - `openid`
3. Click "UPDATE"
4. Click "SAVE AND CONTINUE"

### 3.4 Add Test Users (Development Only)
1. If in development, add test email addresses
2. Click "ADD USERS"
3. Enter your email and any collaborators' emails
4. Click "SAVE AND CONTINUE"

## Step 4: Create OAuth 2.0 Client ID

### 4.1 Create Client ID
1. Go back to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS"
3. Select "OAuth client ID"
4. Select "Web application" as the Application type
5. Enter the name: "Connect Web App"

### 4.2 Add Authorized Redirect URIs
1. Under "Authorized redirect URIs", click "ADD URI"
2. Add the following URIs based on your environment:

**For Local Development:**
```
http://localhost:5173/auth/google/callback
http://localhost:3000/auth/google/callback
http://127.0.0.1:5173/auth/google/callback
```

**For Testing on VirtualBox:**
```
http://192.168.1.X:5173/auth/google/callback
http://192.168.1.X:3000/auth/google/callback
```

**For Production:**
```
https://yourdomain.com/auth/google/callback
https://www.yourdomain.com/auth/google/callback
```

3. Click "CREATE"

### 4.3 Save Your Credentials
You'll see a popup with your Client ID and Client Secret:
- Copy the **Client ID** and **Client Secret**
- Store them securely (you'll need them next)

## Step 5: Configure Environment Variables

### 5.1 Create/Update .env file
Create a `.env` file in the project root with:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

Replace:
- `your_client_id_here.apps.googleusercontent.com` with your actual Client ID
- `your_client_secret_here` with your actual Client Secret

### 5.2 Environment Variable Details

**GOOGLE_CLIENT_ID**
- Format: `xxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com`
- Where: Find in OAuth 2.0 Client IDs section
- What: Public ID for your app

**GOOGLE_CLIENT_SECRET**
- Format: A long string of characters
- Where: Click on the OAuth client to reveal
- What: Secret key - keep this private!

**GOOGLE_REDIRECT_URI**
- Format: `https://yourdomain.com/auth/google/callback`
- What: Where Google redirects after user approves

## Step 6: Test the Integration

### 6.1 Start the app
```bash
pnpm run dev
```

### 6.2 Test Google OAuth
1. Go to http://localhost:5173
2. Click "Get Started" to go to register page
3. Look for "Continue with Google" button
4. Click it and you should be redirected to Google login
5. Select your test account and approve

### 6.3 Verify it works
After approving:
- You should be redirected back to the app
- You should be logged in automatically
- Your user should be created in the database

## Step 7: Production Deployment

### 7.1 Update Credentials for Production
1. Go to Google Cloud Console
2. Go to "APIs & Services" > "Credentials"
3. Click on your OAuth client
4. Add your production domain URLs to "Authorized redirect URIs"
5. Save

### 7.2 Update Environment Variables for Production
Set these environment variables on your production server:

```bash
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

### 7.3 Deploy
- Deploy your app to your production server
- Verify Google OAuth works on the live site

## Troubleshooting

### "Redirect URI mismatch" error

**Problem**: You get an error saying the redirect URI doesn't match.

**Solution**:
1. Check the exact URL in the error message
2. Go to Google Cloud Console > Credentials
3. Click on your OAuth client
4. Make sure the exact URL from the error is in "Authorized redirect URIs"
5. URLs are case-sensitive and must match exactly

### OAuth button not working

**Problem**: The "Continue with Google" button doesn't work.

**Solution**:
1. Check browser console for errors (F12 > Console)
2. Verify GOOGLE_CLIENT_ID is set in .env
3. Check that the app is running on the correct port
4. Try clearing browser cache and reloading

### "Invalid client" error

**Problem**: You see "Invalid client" when trying to log in.

**Solution**:
1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
2. Make sure there are no extra spaces in the .env file
3. Restart the dev server after changing .env
4. Check that the credentials haven't been regenerated (old ones won't work)

### "Client not authenticated" error

**Problem**: Error mentions client not being authenticated.

**Solution**:
1. Make sure the OAuth consent screen is configured
2. Go to "APIs & Services" > "OAuth consent screen"
3. Verify all required fields are filled
4. Make sure the app is in "External" mode for testing

## Security Best Practices

### For Development
1. Store credentials in .env.local (not in git)
2. Add .env to .gitignore
3. Use test accounts only

### For Production
1. Never commit credentials to git
2. Use environment variables on production server
3. Use strong, unique secrets
4. Regenerate secrets if exposed
5. Monitor for unusual login activity
6. Use HTTPS only in production

### Protecting Your Secrets
```bash
# .gitignore
.env
.env.local
.env.*.local
```

## Additional Resources

- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
- Google Cloud Console: https://console.cloud.google.com
- Google Identity Services: https://developers.google.com/identity/gsi/web

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Check Google Cloud Console for errors
3. Review the app logs for more details
4. Check the browser console (F12) for client-side errors

## Next Steps

After setting up Google OAuth:
1. Test with multiple user accounts
2. Test password reset flow (for non-OAuth users)
3. Test account linking (if implementing)
4. Monitor analytics for OAuth conversion rates
5. Deploy to production with proper credentials
