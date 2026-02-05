# Production Quick Start (Ubuntu 22.04)

## Complete setup for production deployment on clean Ubuntu machine

## Part 1: System Setup (Ubuntu 22.04)

# Update system
sudo apt update && sudo apt upgrade -y

# Install curl and wget
sudo apt install -y curl wget

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Verify versions
node --version
npm --version
pnpm --version

## Part 2: Docker Setup

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

## Part 3: SSL Certificate Setup

# Generate self-signed certificates (for testing)
bash scripts/generate-ssl-certs.sh

# Verify certificates were created
ls -la ssl/

## Part 4: Google OAuth Setup

# 1. Go to https://console.cloud.google.com/
# 2. Create new project or select existing one
# 3. Enable "Google+ API"
# 4. Create OAuth 2.0 credentials:
#    - Type: Web application
#    - Authorized redirect URIs:
#      - http://localhost:8080/auth/google/callback (dev)
#      - https://localhost:5443/auth/google/callback (local https)
#      - https://yourdomain.com/auth/google/callback (production)
# 5. Copy Client ID and Client Secret

# Create .env file with Google OAuth credentials
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
HTTPS_PORT=5443

# Database
MONGODB_URI=mongodb://mongo:27017/social-media-app

# Cache
REDIS_URL=redis://redis:6379

# Google OAuth (REPLACE WITH YOUR CREDENTIALS)
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://localhost:5443/auth/google/callback

# Session security
SESSION_SECRET=generate-strong-random-string-here

# SSL
ENABLE_HTTPS=true
SSL_KEY_PATH=/app/ssl/server.key
SSL_CERT_PATH=/app/ssl/server.crt
EOF

# Generate secure session secret
# Run this: openssl rand -base64 32
# Copy output and paste into SESSION_SECRET in .env

## Part 5: Start Production Services

# Clean up any stuck containers
docker-compose down -v 2>/dev/null || true
docker system prune -a -f 2>/dev/null || true

# Start all services
docker-compose up -d

# Wait for services to start
sleep 15

# Check status
docker-compose ps

# View logs
docker-compose logs app

## Part 6: Verify Services are Running

# Check app
curl -k https://localhost:5443/api/ping

# Check MongoDB (should show "ok": 1)
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"

# Check Redis (should show "PONG")
docker-compose exec redis redis-cli ping

## Part 7: Database Initialization (optional)

# Access MongoDB shell
docker-compose exec mongo mongosh

# In mongosh, run:
# > use social-media-app
# > db.users.find()
# > exit

## Part 8: Configure Firewall (Optional)

sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 5443/tcp
sudo ufw enable

## Part 9: Setup Let's Encrypt SSL (Production)

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace yourdomain.com)
sudo certbot certonly --standalone -d yourdomain.com

# Update .env with real certificates
# SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
# SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
# GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Restart app
docker-compose restart app

## Part 10: Monitor Services

# View all container logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f mongo
docker-compose logs -f redis

# Check system resources
docker stats

## Part 11: Backup Database

# Backup MongoDB
docker-compose exec mongo mongodump --out /tmp/backup

# Copy backup to host
docker cp social-media-mongo:/tmp/backup ./backups/

## Part 12: Useful Production Commands

# Stop all services
docker-compose down

# Stop and remove all data (caution!)
docker-compose down -v

# Restart specific service
docker-compose restart app

# Rebuild image after code changes
docker-compose up -d --build

# View service status
docker-compose ps

# Execute command in container
docker-compose exec app npm run build

# Access database shell
docker-compose exec mongo mongosh

# Access Redis CLI
docker-compose exec redis redis-cli

# Check open ports
sudo netstat -tlnp | grep LISTEN

## Part 13: Troubleshooting

# Port already in use error
# Kill all Docker containers:
docker kill $(docker ps -q)
docker system prune -a -f

# Restart Docker daemon
sudo systemctl restart docker

# Wait and try again
sleep 10
docker-compose up -d

# Container won't start
docker-compose logs app

# MongoDB connection error
docker-compose restart mongo
sleep 5

# Redis connection error
docker-compose restart redis
sleep 5

# SSL certificate error
bash scripts/generate-ssl-certs.sh
docker-compose restart app

# Clear Docker volumes and start fresh
docker-compose down -v
rm -rf ssl/
bash scripts/generate-ssl-certs.sh
docker-compose up -d

## Part 14: Environment Variables Summary

# Required (set in .env):
# NODE_ENV - production/development
# PORT - HTTP port (5000)
# HTTPS_PORT - HTTPS port (5443)
# MONGODB_URI - MongoDB connection string
# REDIS_URL - Redis connection URL
# GOOGLE_CLIENT_ID - From Google Cloud Console
# GOOGLE_CLIENT_SECRET - From Google Cloud Console
# GOOGLE_REDIRECT_URI - OAuth callback URL
# SESSION_SECRET - Random secure key
# ENABLE_HTTPS - true/false
# SSL_KEY_PATH - Path to SSL private key
# SSL_CERT_PATH - Path to SSL certificate

## Access Your App

# Development HTTP
http://localhost:8080

# Production HTTPS (self-signed cert)
https://localhost:5443
# Click "Advanced" -> "Proceed to localhost (unsafe)"

# Production HTTPS (real domain)
https://yourdomain.com

## Next Steps

1. Update Google OAuth credentials in .env
2. Configure real SSL certificates with Let's Encrypt
3. Set up domain DNS pointing to server IP
4. Update GOOGLE_REDIRECT_URI with real domain
5. Run `docker-compose up -d` to apply changes
6. Monitor logs: `docker-compose logs -f`
7. Set up automated backups
8. Configure monitoring and alerts
