# Quick Start - Production Server

Start the production server after completing [INSTALLATION.md](INSTALLATION.md).

## Prerequisites

- ✅ System installation completed ([INSTALLATION.md](INSTALLATION.md))
- ✅ `.env` file configured with Google OAuth credentials
- ✅ SSL certificates generated

## Start Production Server

```bash
# Navigate to project directory
cd /path/to/social-media-app

# Start all services (MongoDB, Redis, Nginx, App)
docker-compose up -d

# Wait for services to be ready
sleep 15

# Verify all services are running
docker-compose ps
```

## Access Application

**HTTPS (Secure):**
```
https://localhost:5443
```
Or with your domain: `https://yourdomain.com`

**Note:** Browser will warn about self-signed certificate in testing. Click "Advanced" → "Proceed" to access.

## Verify Services Are Running

```bash
# Check app is responding
curl -k https://localhost:5443/api/ping

# Check MongoDB is accessible
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"

# Check Redis is accessible
docker-compose exec redis redis-cli ping
```

All three should return success messages (PONG, ok: 1, etc.)

## View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mongo
docker-compose logs -f redis
```

## Stop Services

```bash
docker-compose down
```

## Common Commands

| Command | Action |
|---------|--------|
| `docker-compose ps` | Show service status |
| `docker-compose logs -f app` | View app logs in real-time |
| `docker-compose restart app` | Restart app service |
| `docker-compose exec mongo mongosh` | Access MongoDB shell |
| `docker-compose exec redis redis-cli` | Access Redis CLI |
| `docker-compose down` | Stop all services |
| `docker-compose down -v` | Stop and remove all data |

## Troubleshooting

### Services won't start
```bash
docker-compose logs app
```

### Port already in use
See [RESET.md](RESET.md)

### Can't connect to MongoDB
```bash
docker-compose restart mongo
sleep 5
docker-compose ps
```

### SSL certificate issues
```bash
bash scripts/generate-ssl-certs.sh
docker-compose restart app
```

For more help, see [RESET.md](RESET.md) for advanced procedures.
