# Quick Ubuntu Deployment - Exact Steps

This guide provides exact commands to deploy the Social Media App on Ubuntu with everything working.

---

## Step 1: Update System (2 minutes)

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git build-essential
```

---

## Step 2: Install Node.js & pnpm (5 minutes)

```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher

# Install pnpm globally
sudo npm install -g pnpm

# Verify pnpm
pnpm --version  # Should show 10.x.x or higher
```

---

## Step 3: Install MongoDB (5 minutes)

### Option A: MongoDB Community Edition (Recommended for testing)

```bash
# Add MongoDB repository
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod

# Test MongoDB connection
mongosh --eval "db.version()"
```

### Option B: Docker MongoDB (Alternative)

```bash
# Install Docker
sudo apt-get install -y docker.io
sudo systemctl start docker

# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6.0

# Test connection
docker logs mongodb
```

---

## Step 4: Install Redis (3 minutes)

```bash
# Install Redis
sudo apt-get install -y redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify Redis is running
sudo systemctl status redis-server

# Test Redis connection
redis-cli ping  # Should return "PONG"
```

---

## Step 5: Clone & Setup Project (3 minutes)

```bash
# Create projects directory
mkdir -p ~/projects
cd ~/projects

# Clone your repository
# Replace with your actual repo URL
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app

# Install project dependencies
pnpm install
```

---

## Step 6: Create Environment Configuration (2 minutes)

```bash
# Create .env file
cat > .env << 'EOF'
# Server
NODE_ENV=development
PORT=5000

# MongoDB (local instance)
MONGODB_URI=mongodb://localhost:27017/social-media-app

# Redis (local instance)
REDIS_URL=redis://localhost:6379

# Google OAuth (optional - add your credentials later)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# Session
SESSION_SECRET=your-super-secret-key-change-this
EOF

cat .env
```

---

## Step 7: Build the Project (3 minutes)

```bash
# Build frontend
pnpm run build:client

# Build server
pnpm run build:server

# Verify build succeeded
ls -la dist/
ls -la dist/spa/
ls -la dist/server/
```

---

## Step 8: Test the App Works (2 minutes)

```bash
# Start the dev server first (for testing)
pnpm run dev

# In another terminal, test the API
curl http://localhost:5000/api/ping

# You should see: {"message":"pong"}

# Stop the dev server
# Press Ctrl+C in the first terminal
```

---

## Step 9: Start Backend Services (1 minute)

```bash
# Terminal 1: Start Node.js app
PORT=5000 pnpm start

# You should see output like:
# VITE v7.1.2 ready in 1141 ms
# Ready for production!

# In a new terminal, verify it's running
curl http://localhost:5000/api/ping
# Should return: {"message":"pong"}
```

---

## Step 10: Verify Everything Works (5 minutes)

### Test Database Connection
```bash
# Connect to MongoDB
mongosh

# In MongoDB shell:
> use social-media-app
> db.users.find()
> exit
```

### Test Redis Connection
```bash
# Connect to Redis
redis-cli

# In Redis shell:
> PING
# Should return: PONG
> DBSIZE
# Should return: (integer) 0
> exit
```

### Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:5000/api/ping
# Returns: {"message":"pong"}

# Test create user (register)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }' \
  -c cookies.txt

# Check response - should show success and user data

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# Should return: {"success":true,"user":{...}}
```

### Test Frontend
```bash
# Open browser and visit
http://localhost:5173

# You should see the colorful landing page
# Click "Get Started" to test registration
# Click "Sign In" to test login
```

---

## Step 11: Set Up PM2 for Background Running (2 minutes)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 config file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'social-media-app',
      script: 'pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
EOF

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 config to auto-start on reboot
pm2 save
sudo env PATH=$PATH:/usr/local/bin pm2 startup -u $USER --hp $HOME

# View PM2 status
pm2 status
pm2 logs
```

---

## Step 12: Setup Nginx Reverse Proxy (5 minutes)

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/social-media-app > /dev/null << 'EOF'
upstream app_backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name _;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Proxy settings
    location / {
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://app_backend;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/social-media-app /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify Nginx is running
sudo systemctl status nginx
```

---

## Step 13: Access the App (1 minute)

```bash
# Get your Ubuntu machine's IP
hostname -I

# In your browser, visit:
# http://<your-ubuntu-ip>

# Or if on same machine:
http://localhost

# You should see the colorful Social Media App landing page!
```

---

## Complete Deployment Verification Checklist

```bash
# Check all services are running
sudo systemctl status mongod
sudo systemctl status redis-server
sudo systemctl status nginx
pm2 status

# Check ports are listening
sudo lsof -i :5000    # Node.js app
sudo lsof -i :27017   # MongoDB
sudo lsof -i :6379    # Redis
sudo lsof -i :80      # Nginx

# Check logs
tail -f /var/log/nginx/access.log
pm2 logs

# Quick API test
curl http://localhost/api/ping
# Should return: {"message":"pong"}
```

---

## Troubleshooting

### MongoDB won't start
```bash
# Check if port 27017 is already in use
sudo lsof -i :27017

# Check MongoDB logs
sudo journalctl -u mongod -n 50

# Restart MongoDB
sudo systemctl restart mongod
```

### Redis won't start
```bash
# Check if port 6379 is already in use
sudo lsof -i :6379

# Check Redis logs
sudo systemctl status redis-server

# Restart Redis
sudo systemctl restart redis-server
```

### Node.js app won't start
```bash
# Check if port 5000 is already in use
sudo lsof -i :5000

# Run app in foreground to see errors
cd ~/projects/social-media-app
pnpm start

# Check .env file exists
cat .env

# Check node_modules installed
ls node_modules | wc -l  # Should show many modules
```

### Nginx won't start
```bash
# Test Nginx config
sudo nginx -t

# Check if port 80 is already in use
sudo lsof -i :80

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Database connection errors
```bash
# Test MongoDB connection
mongosh -u admin -p password

# Test Redis connection
redis-cli ping

# Verify .env variables
grep MONGODB_URI .env
grep REDIS_URL .env
```

---

## System Resources Check

```bash
# Check system resources
free -h          # Memory usage
df -h            # Disk usage
top -b -n 1      # CPU and processes

# Recommended for this app:
# RAM: 4GB minimum
# CPU: 2 cores minimum
# Disk: 20GB minimum
```

---

## Production Hardening (Optional)

### Add SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate (replace yourdomain.com)
sudo certbot certonly --nginx -d yourdomain.com

# Update Nginx config to use SSL (see PRODUCTION_DEPLOYMENT_GUIDE.md)
```

### Firewall Setup
```bash
# Enable UFW
sudo ufw enable

# Allow ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS

# Check firewall status
sudo ufw status
```

### Automated Backups
```bash
# Create backup script
cat > ~/backup-mongodb.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --out /backups/mongodb_$DATE
tar -czf /backups/mongodb_$DATE.tar.gz /backups/mongodb_$DATE
EOF

# Make executable
chmod +x ~/backup-mongodb.sh

# Add to crontab for daily backups
crontab -e
# Add line: 0 2 * * * ~/backup-mongodb.sh
```

---

## Summary of Commands (Quick Copy-Paste)

```bash
# Everything at once (takes ~20 minutes)
sudo apt update && sudo apt upgrade -y && sudo apt install -y curl wget git build-essential

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pnpm

curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update && sudo apt-get install -y mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod

sudo apt-get install -y redis-server
sudo systemctl start redis-server && sudo systemctl enable redis-server

mkdir -p ~/projects && cd ~/projects
git clone https://github.com/yourusername/social-media-app.git
cd social-media-app
pnpm install

cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media-app
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
SESSION_SECRET=your-super-secret-key-change-this
EOF

pnpm run build:client
pnpm run build:server

sudo npm install -g pm2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'social-media-app',
    script: 'pnpm',
    args: 'start',
    env: { NODE_ENV: 'production', PORT: 5000 }
  }]
};
EOF

pm2 start ecosystem.config.js
pm2 save

sudo apt-get install -y nginx
# ... then create Nginx config as shown above

# Verify everything works
curl http://localhost/api/ping
```

---

## Access Your App

**After deployment, access the app at:**
- `http://<your-ubuntu-ip>`
- `http://<your-ubuntu-ip>:5000` (direct Node.js)

**The app includes:**
- ✅ Beautiful landing page
- ✅ User registration
- ✅ User login
- ✅ Google OAuth option
- ✅ Full social media features
- ✅ Real-time notifications (WebSocket ready)
- ✅ Analytics tracking
- ✅ Trending/search functionality

---

## Important Notes

1. **Change SESSION_SECRET** - Use a strong random string in production
2. **Add Google OAuth** - Follow GOOGLE_OAUTH_SETUP.md for credentials
3. **Enable HTTPS** - Use Let's Encrypt for SSL in production
4. **Monitor Logs** - Check PM2 logs: `pm2 logs`
5. **Database Backups** - Set up automated MongoDB backups
6. **Scale Up** - Start additional instances on different ports if needed

---

## Support

If something doesn't work:

1. Check service status: `sudo systemctl status <service>`
2. Check logs: `tail -f /var/log/syslog`
3. Test connectivity: `curl http://localhost:5000/api/ping`
4. Check ports: `sudo lsof -i :<port>`

**You now have a fully deployed Social Media App on Ubuntu!** 🎉
