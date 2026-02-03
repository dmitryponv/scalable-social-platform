# SSL & Docker Quick Reference

## Generate SSL Certificates (Development)

```bash
bash scripts/generate-ssl-certs.sh
```

This creates self-signed certificates in `ssl/` directory (valid for 365 days).

## Start with Docker (Production-Ready)

```bash
# First time setup
bash scripts/setup-docker.sh

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Access the App

| URL                    | Purpose          | Notes                   |
| ---------------------- | ---------------- | ----------------------- |
| https://localhost:5443 | Main app (HTTPS) | Direct HTTPS access     |
| http://localhost       | Main app (HTTP)  | Auto-redirects to HTTPS |
| http://localhost:5000  | Direct HTTP      | For testing only        |

## Environment Setup

Update `.env` for Docker:

```bash
# Enable HTTPS in Docker
ENABLE_HTTPS=true
HTTPS_PORT=5443
SSL_KEY_PATH=/app/ssl/server.key
SSL_CERT_PATH=/app/ssl/server.crt

# Add your credentials
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://localhost:5443/auth/google/callback
```

## Stop Services

```bash
docker-compose down      # Keeps volumes
docker-compose down -v   # Removes all data
```

## Local Development (Without Docker)

For development without Docker, HTTPS is not needed:

```bash
pnpm install
pnpm run dev
```

Then access at `http://localhost:8080`

## Production Deployment

For real HTTPS on production:

1. **Get SSL Certificate**

   ```bash
   # Using Let's Encrypt
   sudo certbot certonly --nginx -d yourdomain.com
   ```

2. **Update .env**

   ```bash
   ENABLE_HTTPS=true
   SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
   SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
   GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
   ```

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

Access at `https://yourdomain.com`

## Common Commands

```bash
# View logs
docker-compose logs -f app

# Access MongoDB
docker-compose exec mongo mongosh

# Access Redis
docker-compose exec redis redis-cli

# Restart a service
docker-compose restart app

# Run a command
docker-compose exec app npm run build

# Clean up
docker-compose down -v
```

## Browser Certificate Warning

When accessing `https://localhost:5443`, your browser will warn about the self-signed certificate. This is normal and expected:

1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"
3. The warning won't appear again

To suppress the warning, install the certificate in your system (advanced users only).

## Files Added

- **Dockerfile** - Production-ready multi-stage build
- **.dockerignore** - Excludes unnecessary files from image
- **docker-compose.yml** - Complete stack (app, MongoDB, Redis, Nginx)
- **nginx.conf** - HTTPS reverse proxy with security headers
- **scripts/generate-ssl-certs.sh** - Auto-generate self-signed certs
- **scripts/setup-docker.sh** - Setup Docker environment
- **DOCKER_HTTPS_SETUP.md** - Complete Docker & HTTPS guide

## Architecture

```
┌─────────────────────────────────────────────┐
│         NGINX (Port 80, 443)                │
│  - HTTPS termination                        │
│  - Load balancing                           │
│  - Rate limiting                            │
│  - Security headers                         │
└────────────────────┬────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼─┐    ┌────▼─┐   ┌───▼──┐
    │ App  │    │Mongo │   │Redis │
    │:5000 │    │:27017│   │:6379 │
    │ HTTPS│    │      │   │Cache │
    └──────┘    └──────┘   └──────┘
```

## Troubleshooting

| Issue                  | Solution                                        |
| ---------------------- | ----------------------------------------------- |
| Port already in use    | `docker kill <container>` or use different port |
| Certificate error      | `bash scripts/generate-ssl-certs.sh`            |
| MongoDB won't connect  | Wait 30 seconds, `docker-compose restart mongo` |
| Redis connection error | `docker-compose restart redis`                  |
| Services not starting  | `docker-compose logs` to see error details      |

## Need Help?

- See **DOCKER_HTTPS_SETUP.md** for comprehensive guide
- Check docker-compose logs: `docker-compose logs -f`
- Read nginx.conf for proxy configuration
- Check .env settings match your environment
