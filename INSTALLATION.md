# Installation Guide (Ubuntu 22.04)

Complete setup for deploying the application on a blank Linux server.

## Step 1: Update System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget gnupg
```

## Step 2: Install Node.js 18 & pnpm

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pnpm
node --version
pnpm --version
```

## Step 3: Install Docker & Docker Compose

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

docker --version
docker-compose --version
sudo systemctl start docker
sudo systemctl enable docker
```

## Step 4: Clone/Prepare Project

```bash
# If cloning from git:
git clone https://github.com/dmitryponv/scalable-social-platform.git
cd scalable-social-platform

# Or if already in project directory:
cd /path/to/project
```

## Step 5: Install Project Dependencies

```bash
pnpm install
```

## Step 6: Generate SSL Certificates

```bash
mkdir -p ssl
bash scripts/generate-ssl-certs.sh
ls -la ssl/
```

## Step 7: Configure Google OAuth

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web application):
   - Add Authorized redirect URIs:
     - `https://localhost:5443/auth/google/callback` (testing)
     - `https://yourdomain.com/auth/google/callback` (production)
5. Copy your Client ID and Client Secret

## Step 8: Create .env Configuration File

```bash
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
HTTPS_PORT=5443

# Database
MONGODB_URI=mongodb://mongo:27017/social-media-app

# Cache
REDIS_URL=redis://redis:6379

# Google OAuth (replace with your credentials from Step 7)
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Session security (generate: openssl rand -base64 32)
SESSION_SECRET=your_secure_random_string_here

# SSL Configuration
ENABLE_HTTPS=true
SSL_KEY_PATH=/app/ssl/server.key
SSL_CERT_PATH=/app/ssl/server.crt
EOF
```

## Step 9: Generate Secure Session Secret

```bash
openssl rand -base64 32
```

Copy the output and update the `SESSION_SECRET` value in your `.env` file.

## Step 10: Configure Firewall (Optional)

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 5443/tcp
sudo ufw enable
```

## Step 11: Setup Let's Encrypt SSL (For Production Domain)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Replace yourdomain.com with your actual domain
sudo certbot certonly --standalone -d yourdomain.com

# Update .env with production certificates:
# SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
# SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
```

## Step 12: Build Project

```bash
pnpm run build
```

## Step 13: Verify All Components

```bash
# Check Node.js
node --version

# Check Docker
docker --version
docker-compose --version

# Check SSL certificates
ls -la ssl/

# Check .env file
cat .env | grep -v "^#" | grep -v "^$"
```

## Installation Complete ✓

Your system is now ready for deployment. Proceed to [QUICKSTART.md](QUICKSTART.md) to start the production server.

## Installed Components Summary

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| pnpm | Latest | Package manager |
| Docker | Latest | Container runtime |
| Docker Compose | Latest | Multi-container orchestration |
| MongoDB | 7.0 | Database (via Docker) |
| Redis | Latest | Cache layer (via Docker) |
| Nginx | Latest | Reverse proxy (via Docker) |
| certbot | Latest | SSL certificate management |

## Troubleshooting Installation

### pnpm not found after installation
```bash
source ~/.bashrc
pnpm --version
```

### Docker permission denied
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Docker daemon not running
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Port already in use
```bash
bash scripts/hard-reset.sh
```

See [RESET.md](RESET.md) for advanced cleanup procedures.
