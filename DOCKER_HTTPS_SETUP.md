# Docker and HTTPS Setup Guide

Complete guide for containerizing the Social Media App with Docker and enabling HTTPS encryption.

## Table of Contents

1. [Quick Start](#quick-start)
2. [SSL Certificate Generation](#ssl-certificate-generation)
3. [Local Development with Docker](#local-development-with-docker)
4. [Production Deployment](#production-deployment)
5. [Configuration](#configuration)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Docker 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose 2.0+ ([Install Docker Compose](https://docs.docker.com/compose/install/))
- OpenSSL (usually pre-installed on Linux/macOS, available via `choco install openssl` on Windows)

### Setup (5 minutes)

```bash
# 1. Generate self-signed SSL certificates for development
bash scripts/generate-ssl-certs.sh

# 2. Create .env file from example
cp .env.example .env

# 3. Update .env with your settings (optional for local dev)
# ENABLE_HTTPS=true
# GOOGLE_CLIENT_ID=your_client_id
# etc.

# 4. Start all services with Docker Compose
docker-compose up -d

# 5. Verify services are running
docker-compose ps

# 6. Access the app
# HTTPS: https://localhost:5443
# HTTP:  http://localhost (redirects to HTTPS)
```

The app will be available in ~30 seconds after all containers start.

---

## SSL Certificate Generation

### For Development (Self-Signed Certificates)

Self-signed certificates are suitable for local development and testing. They'll trigger a browser warning, which is normal.

#### Automatic Generation

```bash
bash scripts/generate-ssl-certs.sh
```

This creates:

- `ssl/server.key` - Private key
- `ssl/server.crt` - Certificate

Certificate validity: 365 days

#### Manual Generation (if needed)

```bash
mkdir -p ssl

# Generate private key (2048-bit RSA)
openssl genrsa -out ssl/server.key 2048

# Generate certificate
openssl req -new -x509 -key ssl/server.key -out ssl/server.crt -days 365 \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"
```

### For Production (Let's Encrypt)

Use Let's Encrypt for free, automatically-renewed certificates:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Certificate location
# /etc/letsencrypt/live/yourdomain.com/privkey.pem (key)
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem (cert)

# Update .env
SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
ENABLE_HTTPS=true
```

Auto-renewal setup:

```bash
# Test renewal
sudo certbot renew --dry-run

# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Local Development with Docker

### File Structure

```
project-root/
├── Dockerfile              # Multi-stage production build
├── docker-compose.yml      # Complete stack definition
├── .dockerignore          # Excludes unnecessary files from image
├── nginx.conf             # Reverse proxy & load balancing config
├── ssl/
│   ├── server.key         # Private key (generated)
│   └── server.crt         # Certificate (generated)
├── scripts/
│   ├── generate-ssl-certs.sh
│   └── setup-docker.sh
└── server/
    ├── index.ts
    ├── node-build.ts      # Updated with HTTPS support
    └── ...
```

### Starting Services

```bash
# Build and start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f mongo
docker-compose logs -f redis
docker-compose logs -f nginx
```

### Services Available

| Service     | Port  | URL                       | Notes              |
| ----------- | ----- | ------------------------- | ------------------ |
| App (HTTPS) | 5443  | https://localhost:5443    | Main application   |
| App (HTTP)  | 5000  | http://localhost:5000     | Redirects to HTTPS |
| Nginx       | 443   | https://localhost         | SSL reverse proxy  |
| Nginx       | 80    | http://localhost          | Redirects to HTTPS |
| MongoDB     | 27017 | mongodb://localhost:27017 | Database           |
| Redis       | 6379  | redis://localhost:6379    | Cache              |

### Managing Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Restart specific service
docker-compose restart app

# View service status
docker-compose ps

# Execute command in running container
docker-compose exec app sh

# View service logs
docker-compose logs app --tail 100 -f
```

### Database Operations

```bash
# Access MongoDB shell
docker-compose exec mongo mongosh

# MongoDB queries
use social-media-app
db.users.find().limit(5)
db.posts.find().limit(5)

# Exit MongoDB
exit

# Backup database
docker-compose exec mongo mongodump --out /tmp/backup

# Restore database
docker-compose exec mongo mongorestore /tmp/backup
```

### Redis Operations

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Redis commands
INFO                  # Server info
KEYS *               # List all keys
GET session:user1    # Get specific key
FLUSHDB              # Clear all data
EXIT                 # Exit Redis

exit
```

---

## Production Deployment

### Docker Build

```bash
# Build production image
docker build -t social-media-app:latest .

# Run production container
docker run -d \
  --name social-media-app \
  -p 5000:5000 \
  -p 5443:5443 \
  -e ENABLE_HTTPS=true \
  -e MONGODB_URI=mongodb://mongo:27017/social-media-app \
  -e REDIS_URL=redis://redis:6379 \
  -e GOOGLE_CLIENT_ID=your_client_id \
  -e GOOGLE_CLIENT_SECRET=your_client_secret \
  -v /etc/ssl/certs:/app/ssl:ro \
  social-media-app:latest
```

### Docker Compose Production

```bash
# Create production .env
cat > .env.production << EOF
NODE_ENV=production
ENABLE_HTTPS=true
PORT=5000
HTTPS_PORT=5443
MONGODB_URI=mongodb://mongo:27017/social-media-app
REDIS_URL=redis://redis:6379
SSL_KEY_PATH=/app/ssl/server.key
SSL_CERT_PATH=/app/ssl/server.crt
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
SESSION_SECRET=your-strong-random-secret-key
EOF

# Start with production config
docker-compose -f docker-compose.yml --env-file .env.production up -d
```

### Environment Variables for Docker

Update `.env` or pass via `docker-compose`:

```yaml
environment:
  NODE_ENV: production
  ENABLE_HTTPS: "true"
  PORT: 5000
  HTTPS_PORT: 5443
  MONGODB_URI: mongodb://mongo:27017/social-media-app
  REDIS_URL: redis://redis:6379
  SSL_KEY_PATH: /app/ssl/server.key
  SSL_CERT_PATH: /app/ssl/server.crt
  GOOGLE_CLIENT_ID: your_client_id
  GOOGLE_CLIENT_SECRET: your_client_secret
  SESSION_SECRET: your-strong-secret
```

### Health Checks

```bash
# Check container health
docker-compose ps

# Manual health check
curl https://localhost:5443/api/ping -k

# Check all services
docker-compose exec app curl http://localhost:5000/api/ping
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
docker-compose exec redis redis-cli ping
```

---

## Configuration

### Environment Variables

Key variables for Docker deployment:

| Variable        | Default                                      | Description             |
| --------------- | -------------------------------------------- | ----------------------- |
| `ENABLE_HTTPS`  | `false`                                      | Enable HTTPS server     |
| `PORT`          | `5000`                                       | HTTP port               |
| `HTTPS_PORT`    | `5443`                                       | HTTPS port              |
| `SSL_KEY_PATH`  | -                                            | Path to SSL private key |
| `SSL_CERT_PATH` | -                                            | Path to SSL certificate |
| `MONGODB_URI`   | `mongodb://localhost:27017/social-media-app` | MongoDB connection      |
| `REDIS_URL`     | `redis://localhost:6379`                     | Redis connection        |
| `NODE_ENV`      | `development`                                | Node environment        |

### Docker Compose Override

Create `docker-compose.override.yml` for local customizations:

```yaml
version: "3.8"

services:
  app:
    environment:
      LOG_LEVEL: debug
      ANALYTICS_ENABLED: "true"
    ports:
      - "5000:5000"
      - "5443:5443"
```

This file is automatically loaded and merged with `docker-compose.yml`.

### Nginx Configuration

Customize `nginx.conf` for your needs:

- **Rate limiting**: Lines 33-35
- **SSL ciphers**: Lines 97-99
- **Security headers**: Lines 102-107
- **Upstream servers**: Lines 109-112
- **Log format**: Lines 16-19

---

## Troubleshooting

### SSL Certificate Issues

```bash
# Certificate expired or invalid
# Regenerate certificates
bash scripts/generate-ssl-certs.sh
docker-compose restart app nginx

# Browser warnings are normal for self-signed certs
# Click "Advanced" -> "Proceed to localhost" to continue
```

### Container Won't Start

```bash
# Check logs
docker-compose logs app

# Common issues:
# - Port already in use: docker kill <container_id>
# - SSL files missing: bash scripts/generate-ssl-certs.sh
# - Permission denied: sudo chown $(id -u):$(id -g) ssl/
```

### MongoDB Connection Failed

```bash
# Check MongoDB service
docker-compose ps mongo

# Restart MongoDB
docker-compose restart mongo

# Check logs
docker-compose logs mongo

# Common issues:
# - MONGODB_URI incorrect
# - mongo container not ready: wait 30 seconds
# - Volume permission issues: sudo chown -R nobody:nogroup mongo_data/
```

### Redis Connection Failed

```bash
# Check Redis service
docker-compose ps redis

# Clear Redis and restart
docker-compose exec redis redis-cli FLUSHALL
docker-compose restart redis

# Check logs
docker-compose logs redis
```

### HTTPS Not Working

```bash
# Verify certificates exist
ls -la ssl/

# Check certificate validity
openssl x509 -in ssl/server.crt -text -noout

# Test HTTPS connection
curl -k https://localhost:5443/api/ping

# The -k flag ignores certificate validation warnings
```

### High Memory Usage

```bash
# Check memory usage
docker-compose stats

# Optimize MongoDB (if needed)
docker-compose exec mongo mongosh
db.collection.deleteMany({timestamp: {$lt: new Date(Date.now() - 7*24*60*60*1000)}})
```

### Performance Issues

```bash
# Check if containers are restarting
docker-compose ps

# View resource usage
docker stats

# Increase limits in docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

### Clean Up

```bash
# Remove all containers and volumes
docker-compose down -v

# Remove unused Docker images
docker image prune -a

# Remove unused volumes
docker volume prune

# Deep clean (⚠️ removes all Docker data)
docker system prune -a --volumes
```

---

## Security Considerations

### For Development

- Self-signed certificates are fine
- Keep `ENABLE_HTTPS=false` for local dev
- Use weak test secrets

### For Production

- Use Let's Encrypt for real certificates
- Set `ENABLE_HTTPS=true`
- Generate strong `SESSION_SECRET` (32+ characters):
  ```bash
  openssl rand -base64 32
  ```
- Set strong `REDIS_PASSWORD` in docker-compose.yml
- Use environment-specific `.env` files
- Don't commit secrets to version control
- Keep Docker images up to date

### SSL/TLS Best Practices

- Use TLSv1.2+ (configured in nginx.conf)
- Strong cipher suites (HIGH:!aNULL:!MD5)
- HSTS header (max-age=31536000)
- Security headers (X-Frame-Options, CSP, etc.)
- Regular certificate renewal (auto with Let's Encrypt)

---

## Next Steps

1. [Open Preview](#open-preview) to test the app
2. [Connect Netlify MCP](#open-mcp-popover) for production deployment
3. Update Google OAuth credentials for production domain
4. Set up automated backups for MongoDB
5. Configure monitoring and alerts

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [OpenSSL Documentation](https://www.openssl.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Redis Docker Image](https://hub.docker.com/_/redis)
