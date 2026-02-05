# Installation Guide - Copy & Paste

Copy and paste each section into your terminal.

## Update System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget gnupg
```

## Install Node.js 18 & pnpm

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pnpm
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
git clone https://github.com/your-username/scalable-social-platform.git
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

## Get Google OAuth Credentials

Visit https://console.cloud.google.com/ and:
1. Create/select a project
2. Enable "Google+ API"
3. Create OAuth 2.0 credentials (Web application)
4. Add redirect URIs: `https://localhost:5443/auth/google/callback` and `https://yourdomain.com/auth/google/callback`
5. Copy your Client ID and Client Secret (you'll paste them below)

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

# Google OAuth (PASTE YOUR CREDENTIALS FROM ABOVE)
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Session security (auto-generated)
SESSION_SECRET=$SESSION_SECRET

# SSL Configuration
ENABLE_HTTPS=true
SSL_KEY_PATH=/app/ssl/server.key
SSL_CERT_PATH=/app/ssl/server.crt
EOF
```

## Update .env with Your Google OAuth Credentials

```bash
# Edit .env file and update:
# GOOGLE_CLIENT_ID=your_actual_client_id
# GOOGLE_CLIENT_SECRET=your_actual_secret
# GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

nano .env
# Or use your preferred editor: vi .env, code .env, etc.
```

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

## Setup Let's Encrypt SSL (For Production Domain - Optional)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Replace yourdomain.com with your actual domain
sudo certbot certonly --standalone -d yourdomain.com

# Then update .env:
# SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
# SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
# nano .env
```

## Installation Complete

Proceed to [QUICKSTART.md](QUICKSTART.md) to start the production server.
