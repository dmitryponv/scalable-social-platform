# Development Quick Start (No Docker)

## Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

## Step 1: Clean Up (if needed)

# Stop any Docker containers
docker kill $(docker ps -q) 2>/dev/null || true
docker system prune -a -f 2>/dev/null || true

# Restart Docker daemon
sudo systemctl restart docker 2>/dev/null || true

# On Mac: restart Docker Desktop

# Wait 10 seconds
sleep 10

## Step 2: Install Dependencies

pnpm install

## Step 3: Create Environment File

cat > .env << 'EOF'
NODE_ENV=development
PORT=5000

# Database (local dev - not needed for dev server)
MONGODB_URI=mongodb://localhost:27017/social-media-app

# Cache (local dev - not needed for dev server)
REDIS_URL=redis://localhost:6379

# Google OAuth (optional - leave blank to skip)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:8080/auth/google/callback

# Session
SESSION_SECRET=dev-secret-key-change-in-production

# HTTPS (disabled in dev)
ENABLE_HTTPS=false
EOF

## Step 4: Start Development Server

pnpm run dev

## Step 5: Access App

# Browser: http://localhost:8080

## Available Commands

# Run tests
pnpm test

# Build for production
pnpm run build

# Type check
pnpm typecheck

# Format code
pnpm format.fix

## Notes

- Dev server runs at http://localhost:8080
- No database required for testing UI
- To use Google OAuth, add credentials to .env
- Hot reload enabled - changes auto-reflect

## Troubleshooting

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Kill port if in use
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Check if port is free
lsof -i :8080
