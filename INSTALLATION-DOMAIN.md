# Installation Guide - Production Domain - Copy & Paste

Copy and paste each section into your terminal.

## Update System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget gnupg
```

## Install Node.js 22 LTS & pnpm

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs
sudo npm install -g pnpm
```

## Verify Node.js and pnpm

```bash
node --version
pnpm --version
```

## Install Docker & Docker Compose

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

## Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

## Verify Docker Installation

```bash
docker --version
docker-compose --version
```

## Clone Project

```bash
git clone https://github.com/dmitryponv/scalable-social-platform.git
cd scalable-social-platform
```

## Install Project Dependencies

```bash
pnpm install
```

## Generate SSL Certificates

```bash
mkdir -p ssl
bash scripts/generate-ssl-certs.sh
```

### Google OAuth Setup Instructions

# Visit https://console.cloud.google.com/

# 1. Create/select a project

# 2. Enable "Google+ API"

# 3. Create OAuth 2.0 credentials (Web application)

# 4. Add redirect URIs:

# - https://localhost:5443/auth/google/callback (testing)

# - https://scalable-social-platform.com/auth/google/callback (production)

# 5. Copy your Client ID and Client Secret

# 6. Paste them in the .env file below

## Create .env File (Auto-generate Session Secret)

```bash
# Generate random session secret and create .env file
SESSION_SECRET=$(openssl rand -base64 32)

cat > .env << EOF
NODE_ENV=production
PORT=5000
HTTPS_PORT=5443

# Database
MONGODB_URI=mongodb://mongo:27017/scalable-social-platform

# Cache
REDIS_URL=redis://redis:6379

# Google OAuth (PASTE YOUR CREDENTIALS FROM GOOGLE CLOUD CONSOLE)
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://scalable-social-platform.com/auth/google/callback

# Session security (auto-generated)
SESSION_SECRET=$SESSION_SECRET

# SSL Configuration
ENABLE_HTTPS=true
SSL_KEY_PATH=/app/ssl/server.key
SSL_CERT_PATH=/app/ssl/server.crt
EOF
```

### Update .env with Your Google OAuth Credentials

# nano .env

# Update these values with your actual credentials from Google Cloud Console:

# GOOGLE_CLIENT_ID=your_actual_client_id

# GOOGLE_CLIENT_SECRET=your_actual_secret

# GOOGLE_REDIRECT_URI=https://scalable-social-platform.com/auth/google/callback

## Build Project

```bash
pnpm run build
```

## Verify Installation

```bash
# Check files exist
ls -la ssl/
cat .env | grep -v "^#" | grep -v "^$"

# Check Node.js
node --version

# Check Docker
docker --version
docker-compose --version
```

## Configure Firewall (Optional)

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 5443/tcp
sudo ufw enable
```

### Setup Let's Encrypt SSL (For Production Domain - Optional)

# REQUIREMENTS BEFORE RUNNING:
# 1. Own or control a domain (example: scalable-social-platform.com)
# 2. Point your domain's DNS A record to your server's public IP address
# 3. Verify DNS is working: nslookup scalable-social-platform.com (should show your IP)
# 4. Ensure port 80 is accessible from the internet (not blocked by firewall)

## Get Let's Encrypt Certificate

```bash
sudo apt install -y certbot python3-certbot-nginx

# IMPORTANT: Replace scalable-social-platform.com with YOUR actual domain name
DOMAIN="scalable-social-platform.com"

# Verify DNS points to this server
nslookup $DOMAIN

# Stop docker-compose
docker-compose down

# Kill any lingering nginx processes
sudo killall nginx 2>/dev/null || true
sudo pkill -f nginx 2>/dev/null || true
sleep 2

# Verify port 80 is free
sudo lsof -i :80 || echo "Port 80 is now free"

# Get certificate (this validates domain ownership via DNS)
sudo certbot certonly --standalone -d $DOMAIN --agree-tos --register-unsafely-without-email

# Auto-update .env with production certificate paths
sed -i "s|SSL_KEY_PATH=/app/ssl/server.key|SSL_KEY_PATH=/etc/letsencrypt/live/$DOMAIN/privkey.pem|g" .env
sed -i "s|SSL_CERT_PATH=/app/ssl/server.crt|SSL_CERT_PATH=/etc/letsencrypt/live/$DOMAIN/fullchain.pem|g" .env

# Also update Google OAuth redirect URI
sed -i "s|GOOGLE_REDIRECT_URI=.*|GOOGLE_REDIRECT_URI=https://$DOMAIN/auth/google/callback|g" .env

# Verify .env was updated
grep "SSL_\|GOOGLE_REDIRECT" .env
```

### Updated .env Paths

# Your .env now contains these production certificate paths:
# SSL_KEY_PATH=/etc/letsencrypt/live/scalable-social-platform.com/privkey.pem
# SSL_CERT_PATH=/etc/letsencrypt/live/scalable-social-platform.com/fullchain.pem
# GOOGLE_REDIRECT_URI=https://scalable-social-platform.com/auth/google/callback

## Installation Complete

Proceed to [QUICKSTART.md](QUICKSTART.md) to start the production server.
