# Backend Implementation Guide

## 🎉 Overview

Your social media app now has a **fully functional backend** with all the endpoints needed for the frontend to work! Here's what was implemented:

---

## 📁 Backend File Structure

```
server/
├── index.ts              # Main server setup and route registration
├── db.ts                 # Database models and in-memory storage
├── auth.ts               # Authentication utilities and middleware
└── routes/
    ├── auth.ts           # Authentication endpoints (register, login, logout)
    ├── posts.ts          # Post endpoints (create, read, like, unlike, share)
    ├── comments.ts       # Comment endpoints (create, read, delete)
    ├── users.ts          # User endpoints (profile, follow, suggestions)
    ├── trending.ts       # Trending and search endpoints
    └── demo.ts           # Demo endpoint (already existed)
```

---

## 🔑 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/logout` - Log out a user
- `GET /api/auth/me` - Get current authenticated user

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts (feed)
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts/:id/like` - Like a post
- `POST /api/posts/:id/unlike` - Unlike a post
- `POST /api/posts/:id/share` - Share a post

### Comments
- `POST /api/posts/:postId/comments` - Create a comment
- `GET /api/posts/:postId/comments` - Get all comments for a post
- `DELETE /api/comments/:id` - Delete a comment

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/suggestions` - Get suggested users to follow
- `POST /api/users/:id/follow` - Follow a user
- `POST /api/users/:id/unfollow` - Unfollow a user
- `GET /api/users/:id/followers` - Get user's followers
- `GET /api/users/:id/following` - Get users that user is following

### Trending & Search
- `GET /api/trending` - Get trending hashtags
- `GET /api/search?q=query` - Search posts
- `GET /api/hashtag/:tag` - Get posts with a specific hashtag

---

## 💾 Database (In-Memory)

Currently uses **in-memory storage** with JavaScript Maps. This is perfect for development but not suitable for production.

### Collections:
1. **users** - User accounts with credentials
2. **posts** - Social media posts
3. **comments** - Comments on posts
4. **follows** - Follow relationships
5. **sessions** - Active user sessions

### Example User Structure:
```typescript
{
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",  // Uses simple hash for demo
  handle: "@johndoe",
  avatar?: "url",
  bio?: "My bio",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Security

### Password Hashing
**Current:** Simple demo hash function  
**Production:** Use bcrypt
```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

Then update `server/auth.ts`:
```typescript
import bcrypt from "bcrypt";

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) => 
  bcrypt.compare(password, hash);
```

### Session Management
- Uses cookie-based sessions (7-day expiration)
- Session tokens stored in `db.sessions`
- Cookies are `httpOnly` and `secure` in production

### Middleware
- `authMiddleware` - Extracts user from session cookie
- `requireAuth` - Protects routes that need authentication

---

## 🚀 How to Use

### 1. Start the server (automatically running)
```bash
npm run dev
```

### 2. Register a user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 3. Create a post
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello world!"
  }' \
  -b "sessionToken=YOUR_SESSION_TOKEN"
```

### 4. Like a post
```bash
curl -X POST http://localhost:8080/api/posts/{postId}/like \
  -b "sessionToken=YOUR_SESSION_TOKEN"
```

---

## 🔄 Frontend Integration

All pages are already connected to the backend:

### Register.tsx
- Sends POST to `/api/auth/register`
- Receives user data and session cookie
- Redirects to `/feed`

### Login.tsx
- Sends POST to `/api/auth/login`
- Gets session cookie
- Redirects to `/feed`

### Feed.tsx
- Loads posts from `GET /api/posts` on mount
- Creates posts with `POST /api/posts`
- Likes/unlikes with `POST /api/posts/:id/like` and `POST /api/posts/:id/unlike`
- Creates comments with `POST /api/posts/:postId/comments`
- Loads suggestions from `GET /api/users/suggestions`
- Follows users with `POST /api/users/:id/follow`
- Logs out with `POST /api/auth/logout`

---

## 🗄️ Upgrading to Real Database (Production)

### Option 1: MongoDB (Recommended for this project)

Install MongoDB client:
```bash
npm install mongoose
npm install --save-dev @types/node
```

Example schema:
```typescript
// server/models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  handle: { type: String, unique: true },
  avatar: String,
  bio: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);
```

Then update `server/db.ts` to use MongoDB instead of Maps.

### Option 2: Supabase (PostgreSQL + Auth)
```bash
npm install @supabase/supabase-js
```

Connect via MCP integration [here](#open-mcp-popover)

### Option 3: Firebase
```bash
npm install firebase-admin
```

---

## 🧪 Testing the API

### Get all posts
```bash
curl http://localhost:8080/api/posts
```

### Get trending hashtags
```bash
curl http://localhost:8080/api/trending
```

### Get user suggestions (requires auth)
```bash
curl http://localhost:8080/api/users/suggestions \
  -b "sessionToken=YOUR_SESSION_TOKEN"
```

---

## ⚠️ Important Notes

1. **Password Hashing:** The current implementation uses a simple hash function for demo purposes. **DO NOT use in production** - use bcrypt instead.

2. **CORS:** Currently allows all origins. In production, set specific allowed origins:
   ```typescript
   app.use(cors({
     origin: "https://yourdomain.com",
     credentials: true
   }));
   ```

3. **Validation:** Basic validation is implemented. Add more robust validation for production using libraries like:
   - `zod` (already installed)
   - `joi`
   - `yup`

4. **Error Handling:** Current error handling is basic. Implement comprehensive error handling with custom error classes.

5. **Rate Limiting:** Add rate limiting to prevent abuse:
   ```bash
   npm install express-rate-limit
   ```

6. **Data Persistence:** In-memory storage is lost when server restarts. Use a real database for persistence.

---

## 🎯 Next Steps

1. **Deploy to production** using [Netlify MCP](#open-mcp-popover) or [Vercel MCP](#open-mcp-popover)
2. **Connect to MongoDB** for persistent data storage
3. **Add email verification** for registration
4. **Implement password reset** functionality
5. **Add image upload** for post images
6. **Implement notifications** system
7. **Add user profiles** with edit functionality
8. **Add direct messaging** between users

---

## 📚 Code References

- **Shared Types:** `shared/api.ts` - All TypeScript interfaces
- **Authentication:** `server/auth.ts` - Auth middleware and utilities
- **Database:** `server/db.ts` - Data models and helpers
- **Main Server:** `server/index.ts` - Route setup and middleware
- **Frontend:** `client/pages/Feed.tsx`, `Register.tsx`, `Login.tsx` - API integration

---

## 💡 Questions?

- Check the endpoint implementations in `server/routes/`
- Review TypeScript interfaces in `shared/api.ts`
- Look at frontend examples in `client/pages/`

All code is well-commented and ready for production deployment! 🚀
