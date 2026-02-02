# Social Media App - Ubuntu VirtualBox Setup Guide

This guide walks you through setting up the complete social media app on Ubuntu VirtualBox with MongoDB, Redis, and Node.js.

## Prerequisites

- VirtualBox installed on your host machine
- Ubuntu 22.04 LTS ISO downloaded
- At least 8GB RAM allocated to the VM
- At least 40GB disk space
- Internet connection

## Step 1: Create and Configure Ubuntu VM

### 1.1 Create a new VM in VirtualBox
```bash
- Name: Social-Media-App
- Type: Linux
- Version: Ubuntu (64-bit)
- Memory: 4GB (4096MB)
- Storage: 30GB dynamically allocated
```

### 1.2 Install Ubuntu 22.04 LTS
- Boot the VM with the Ubuntu ISO
- Follow the installation wizard
- Choose "Install Ubuntu Server"
- Complete the installation with default settings

### 1.3 Update the system
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

## Step 2: Install Node.js and npm

```bash
# Install Node.js 18 LTS (recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18.x.x
npm --version   # Should be v9.x.x or higher

# Install pnpm (recommended package manager)
npm install -g pnpm
pnpm --version
```

## Step 3: Install MongoDB

### 3.1 Add MongoDB repository
```bash
# Import the MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package list
sudo apt-get update
```

### 3.2 Install MongoDB Server
```bash
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### 3.3 Verify MongoDB connection
```bash
mongosh
# You should see a MongoDB shell prompt
# Type: exit to quit
```

## Step 4: Install Redis

```bash
# Install Redis Server
sudo apt-get install -y redis-server

# Start Redis service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify Redis is running
sudo systemctl status redis-server

# Test Redis connection
redis-cli ping
# Should return: PONG
```

## Step 5: Clone and Setup the Project

### 5.1 Clone the repository
```bash
# Create a directory for projects
mkdir ~/projects
cd ~/projects

# Clone the project (replace with your repo)
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app
```

### 5.2 Install project dependencies
```bash
# Install all dependencies
pnpm install

# Or if using npm:
npm install
```

### 5.3 Configure environment variables
```bash
# Create .env file
cat > .env << EOF
# Server configuration
NODE_ENV=development
PORT=5000

# MongoDB configuration
MONGODB_URI=mongodb://localhost:27017/social-media-app

# Redis configuration
REDIS_URL=redis://localhost:6379

# Google OAuth (optional, get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# Session configuration
SESSION_SECRET=your-secret-key-here-change-in-production
EOF
```

## Step 6: Start the Application

### 6.1 Option 1: Development Mode
```bash
# Start the dev server (runs on http://localhost:5173)
pnpm run dev
```

### 6.2 Option 2: Production Build
```bash
# Build the project
pnpm run build

# Start the production server
pnpm start
```

## Step 7: Network Configuration (Optional - For Remote Access)

### 7.1 Get the VM's IP address
```bash
ip addr show
# Look for the inet address (usually 192.168.x.x for NAT networking)
```

### 7.2 Configure port forwarding (if needed)
In VirtualBox VM Settings:
- Network → Advanced → Port Forwarding
- Add rule: Name: "Node App", Protocol: TCP, Host Port: 3000, Guest Port: 5000

### 7.3 Access from host machine
- Open browser on host: `http://localhost:3000` (if port forwarding enabled)
- Or within VM: `http://localhost:5000`

## Step 8: Google OAuth Setup (Optional)

### 8.1 Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback`
   - `http://192.168.x.x:5173/auth/google/callback` (VM IP)

### 8.2 Update environment variables
```bash
# Update .env with your credentials
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret
```

## Database Management

### MongoDB Commands
```bash
# Connect to MongoDB
mongosh

# List databases
show dbs

# Use a specific database
use social-media-app

# List collections
show collections

# Query users
db.users.find().pretty()

# Clear all data (be careful!)
db.dropDatabase()
```

### Redis Commands
```bash
# Connect to Redis
redis-cli

# Check Redis info
info

# View all keys
keys *

# Clear cache
flushdb

# Clear all data
flushall
```

## Troubleshooting

### MongoDB not starting
```bash
# Check MongoDB logs
sudo journalctl -u mongod -n 50

# Restart MongoDB
sudo systemctl restart mongod
```

### Redis connection issues
```bash
# Check Redis status
sudo systemctl status redis-server

# Restart Redis
sudo systemctl restart redis-server

# Test connection with timeout
redis-cli -h localhost -p 6379 ping
```

### Port already in use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### Node.js modules issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Performance Optimization

### MongoDB Index Creation
```bash
# Connect to MongoDB
mongosh social-media-app

# Create indexes for faster queries
db.posts.createIndex({ authorId: 1, createdAt: -1 })
db.posts.createIndex({ createdAt: -1 })
db.comments.createIndex({ postId: 1, createdAt: -1 })
db.follows.createIndex({ followerId: 1 })
db.follows.createIndex({ followingId: 1 })
```

### System Resource Monitoring
```bash
# Monitor CPU and memory usage
top

# Check disk usage
df -h

# Monitor MongoDB
mongosh --eval "db.stats()"
```

## Load Balancing Setup (Advanced)

For production deployment with load balancing:

### Install Nginx
```bash
sudo apt-get install -y nginx

# Enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx as Reverse Proxy
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/default
```

Add the following:
```nginx
upstream social_app {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://social_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Start multiple Node.js instances
```bash
# Terminal 1
PORT=5000 pnpm start

# Terminal 2
PORT=5001 pnpm start

# Terminal 3
PORT=5002 pnpm start
```

## Useful Commands

```bash
# Check all services
sudo systemctl status

# View system logs
journalctl -xe

# Monitor network connections
netstat -tlnp

# Check open ports
ss -tlnp

# Firewall (if needed)
sudo ufw enable
sudo ufw allow 5000/tcp
sudo ufw allow 6379/tcp
sudo ufw allow 27017/tcp
```

## Next Steps

1. Register users and create posts
2. Test all features (likes, comments, follows)
3. Monitor performance with `top` and `htop`
4. Scale horizontally with additional Node.js instances
5. Set up automated backups for MongoDB
6. Configure SSL/TLS for production

## Support

For issues or questions:
- Check the logs: `pnpm run dev` shows real-time errors
- Verify all services are running: `sudo systemctl status`
- Test database connections manually using `mongosh` and `redis-cli`

Happy building! 🎉
