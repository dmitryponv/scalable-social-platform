# Reset & Cleanup Guide

Use this guide when you need to reset Docker containers, clear ports, or perform complete cleanup.

## Quick Reset (Recommended)

Run the automated hard reset script:

```bash
bash scripts/hard-reset.sh
```

This script:
- Stops all Docker containers
- Removes all containers and volumes
- Clears ports (5000, 5443, 6379, 27017, 80, 443)
- Restarts Docker daemon
- Verifies cleanup was successful

Then restart the application:

```bash
docker-compose up -d
```

## Manual Reset Steps

If the automated script doesn't work, follow these manual steps:

### Step 1: Stop Docker Services

```bash
docker-compose down
docker-compose down -v
```

### Step 2: Kill All Docker Containers

```bash
docker kill $(docker ps -q) 2>/dev/null || true
docker rm $(docker ps -a -q) 2>/dev/null || true
```

### Step 3: Deep Clean Docker

```bash
docker system prune -a -f --volumes
docker rmi $(docker images -q) 2>/dev/null || true
```

### Step 4: Clear Ports Manually

Kill processes on each port:

```bash
# HTTP (5000)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# HTTPS (5443)
lsof -i :5443 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Redis (6379)
lsof -i :6379 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# MongoDB (27017)
lsof -i :27017 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Nginx HTTP (80)
lsof -i :80 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# Nginx HTTPS (443)
lsof -i :443 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
```

### Step 5: Restart Docker Daemon

```bash
sudo systemctl restart docker
```

### Step 6: Verify Ports Are Free

```bash
lsof -i :5000 || echo "Port 5000 is free"
lsof -i :5443 || echo "Port 5443 is free"
lsof -i :6379 || echo "Port 6379 is free"
lsof -i :27017 || echo "Port 27017 is free"
```

### Step 7: Restart Application

```bash
docker-compose up -d
sleep 15
docker-compose ps
```

## Complete Data Reset

**Warning:** This deletes all database data. Use only if you want a fresh database.

```bash
# Stop services
docker-compose down -v

# Remove volumes
docker volume prune -a -f

# Remove SSL certificates to regenerate
rm -rf ssl/
bash scripts/generate-ssl-certs.sh

# Start fresh
docker-compose up -d
```

## Clear Project Build Cache

If you're experiencing build issues:

```bash
# Remove node_modules
rm -rf node_modules
rm -rf pnpm-lock.yaml

# Reinstall
pnpm install

# Clear Docker build cache
docker builder prune -a -f

# Rebuild containers
docker-compose up -d --build
```

## Check System Status

```bash
# Docker status
docker --version
docker ps
docker stats

# Port usage
sudo netstat -tlnp | grep LISTEN

# Disk space
df -h

# Docker volumes
docker volume ls

# Docker images
docker images
```

## View Service Logs Before Reset

Before resetting, capture logs for debugging:

```bash
# All logs
docker-compose logs > logs-backup.txt

# Specific service
docker-compose logs app > app-logs.txt
docker-compose logs mongo > mongo-logs.txt
docker-compose logs redis > redis-logs.txt
```

## Common Issues & Fixes

### Port Already in Use Error
```bash
bash scripts/hard-reset.sh
sleep 10
docker-compose up -d
```

### Connection Refused Error
```bash
docker-compose ps
docker-compose logs app
docker-compose restart app
```

### MongoDB Won't Connect
```bash
docker-compose restart mongo
sleep 10
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

### Redis Connection Lost
```bash
docker-compose restart redis
sleep 5
docker-compose exec redis redis-cli ping
```

### App Container Exits Immediately
```bash
docker-compose logs app
# Check for errors in output
```

### Nginx Not Proxying Requests
```bash
docker-compose restart nginx
docker-compose logs nginx
```

## Environment-Specific Resets

### Reset Development Environment

```bash
pnpm run dev  # Stop with Ctrl+C first
rm -rf node_modules
pnpm install
pnpm run dev
```

### Reset Production Environment

```bash
docker-compose down -v
docker system prune -a -f
docker-compose up -d
```

### Reset SSL Certificates

```bash
rm -rf ssl/
bash scripts/generate-ssl-certs.sh
docker-compose restart app
```

### Reset Database Only

```bash
docker-compose exec mongo mongosh
# In mongosh shell:
# > db.dropDatabase()
# > exit
```

### Reset Redis Cache

```bash
docker-compose exec redis redis-cli FLUSHALL
docker-compose exec redis redis-cli DBSIZE  # Should show 0
```

## Getting Help

If problems persist after reset:

1. Check Docker is running: `sudo systemctl status docker`
2. Review logs: `docker-compose logs -f`
3. Verify .env file exists: `cat .env | grep NODE_ENV`
4. Check disk space: `df -h`
5. Verify firewall rules: `sudo ufw status`

For detailed setup, see [INSTALLATION.md](INSTALLATION.md).
For quick start, see [QUICKSTART.md](QUICKSTART.md).
