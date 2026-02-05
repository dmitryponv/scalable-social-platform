#!/bin/bash

# Hard Reset - Complete cleanup for Docker and port conflicts

set -e

echo "========================================"
echo "Hard Reset - Docker Port Conflict Fix"
echo "========================================"

# 1. Kill all Docker containers
echo "Step 1: Killing all Docker containers..."
docker kill $(docker ps -q) 2>/dev/null || true
sleep 2

# 2. Remove all containers
echo "Step 2: Removing all Docker containers..."
docker rm $(docker ps -a -q) 2>/dev/null || true
sleep 2

# 3. Prune everything
echo "Step 3: Pruning Docker system..."
docker system prune -a -f --volumes 2>/dev/null || true
sleep 2

# 4. Kill processes on ports
echo "Step 4: Killing processes on used ports..."
lsof -i :5000 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :5443 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :6379 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :27017 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :80 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
lsof -i :443 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null || true
sleep 2

# 5. Restart Docker daemon
echo "Step 5: Restarting Docker daemon..."
sudo systemctl restart docker 2>/dev/null || true
sleep 5

# 6. Verify Docker is running
echo "Step 6: Verifying Docker is running..."
docker ps >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Docker is running"
else
    echo "✗ Docker failed to start"
    exit 1
fi

# 7. Check ports are free
echo "Step 7: Verifying ports are free..."
for port in 5000 5443 6379 27017 80 443; do
    if ! lsof -i :$port 2>/dev/null | grep LISTEN >/dev/null; then
        echo "✓ Port $port is free"
    else
        echo "✗ Port $port is still in use"
    fi
done

echo ""
echo "========================================"
echo "Reset Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. bash scripts/generate-ssl-certs.sh"
echo "2. docker-compose up -d"
echo "3. docker-compose ps"
echo ""
