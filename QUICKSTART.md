# Quick Start - Copy & Paste Commands

Complete [INSTALLATION.md](INSTALLATION.md) first, then copy-paste below.

## Start Production Server

```bash
# Navigate to project directory
cd /path/to/scalable-social-platform

# Start all services
docker-compose up -d

# Wait for services to start
sleep 15

# Verify all services running
docker-compose ps
```

## Verify Services

```bash
# Check app
curl -k https://localhost:5443/api/ping

# Check MongoDB
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"

# Check Redis
docker-compose exec redis redis-cli ping
```

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

```bash
# Service status
docker-compose ps

# Restart app
docker-compose restart app

# Access MongoDB shell
docker-compose exec mongo mongosh

# Access Redis CLI
docker-compose exec redis redis-cli

# View app logs
docker-compose logs -f app

# Stop all services and remove data
docker-compose down -v
```

## Access Application

HTTPS: https://localhost:5443 (or https://yourdomain.com)

Note: Self-signed cert in testing - click "Advanced" → "Proceed" to access

## Troubleshooting

```bash
# Services won't start
docker-compose logs app

# Port already in use
bash scripts/hard-reset.sh
sleep 10
docker-compose up -d

# MongoDB won't connect
docker-compose restart mongo
sleep 5

# Regenerate SSL certs
bash scripts/generate-ssl-certs.sh
docker-compose restart app
```

See [RESET.md](RESET.md) for more help.
