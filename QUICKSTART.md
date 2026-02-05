# Quick Start - Copy & Paste Commands

## Clean Up (if port errors)

# Kill any running containers
docker-compose down -v
docker system prune -a -f

# Stop any background processes
pkill -f redis-server
pkill -f mongod
pkill -f node

# Wait 5 seconds for processes to fully terminate
sleep 5

## Step 1: Generate SSL Certificates

bash scripts/generate-ssl-certs.sh

## Step 2: Start Docker Services

docker-compose up -d

## Step 3: Wait for Services to Start

sleep 10

## Step 4: Check Status

docker-compose ps

## Step 5: View Logs (optional - to debug)

docker-compose logs app

## Step 6: Access the App

# HTTPS with Docker
# Browser: https://localhost:5443
# Accept certificate warning (it's self-signed, normal)

## OR: Development Mode (No Docker)

# Stop Docker
docker-compose down

# Install dependencies
pnpm install

# Start dev server
pnpm run dev

# Browser: http://localhost:8080

## Useful Commands

# Stop all services
docker-compose down

# Stop and remove all volumes (resets data)
docker-compose down -v

# View service logs
docker-compose logs app

# Access MongoDB shell
docker-compose exec mongo mongosh

# Access Redis CLI
docker-compose exec redis redis-cli

# Restart a specific service
docker-compose restart app

# Execute command in container
docker-compose exec app npm run build
