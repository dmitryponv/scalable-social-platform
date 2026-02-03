#!/bin/bash

# Setup Docker environment for the Social Media App

set -e

echo "Social Media App - Docker Setup"
echo "=================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✓ Docker and Docker Compose are installed"
echo ""

# Generate SSL certificates if they don't exist
if [ ! -f "ssl/server.crt" ] || [ ! -f "ssl/server.key" ]; then
    echo "Generating SSL certificates..."
    bash scripts/generate-ssl-certs.sh
else
    echo "✓ SSL certificates already exist"
fi

echo ""
echo "Setup complete! You can now run:"
echo ""
echo "  docker-compose up -d       # Start all services"
echo "  docker-compose down        # Stop all services"
echo "  docker-compose logs -f     # View logs"
echo ""
echo "The app will be available at:"
echo "  HTTPS: https://localhost:5443"
echo "  HTTP:  http://localhost (redirects to HTTPS)"
echo ""
