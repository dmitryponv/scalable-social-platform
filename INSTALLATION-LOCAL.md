# Installation Guide - Local (localhost) - Copy & Paste

Copy and paste each section into your terminal. Uses self-signed SSL certificates for localhost testing.

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

## Generate Self-Signed SSL Certificates

```bash
mkdir -p ssl
bash scripts/generate-ssl-certs.sh
```

### Google OAuth Setup Instructions (For localhost testing)

# Visit https://console.cloud.google.com/

# 1. Create/select a project

# 2. Enable "Google+ API"

# 3. Create OAuth 2.0 credentials (Web application)

# 4. Add redirect URI for local testing:

# - https://localhost:5443/auth/google/callback

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
GOOGLE_REDIRECT_URI=https://localhost:5443/auth/google/callback

# Session security (auto-generated)
SESSION_SECRET=$SESSION_SECRET

# SSL Configuration (using self-signed certificates)
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

# GOOGLE_REDIRECT_URI=https://localhost:5443/auth/google/callback

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

## Verify SSL Certificates

```bash
# Check certificate details
openssl x509 -in ssl/server.crt -text -noout | grep -A2 "Subject Alternative Name"
```

## Installation Complete

Proceed to [QUICKSTART.md](QUICKSTART.md) to start the production server.

## Notes for Local Testing

- Uses self-signed certificates (browser will warn about certificate)
- Click "Advanced" → "Proceed to localhost (unsafe)" in browser to access
- Certificate is valid for testing only, not production
- For production with a real domain, use [INSTALLATION-DOMAIN.md](INSTALLATION-DOMAIN.md)
