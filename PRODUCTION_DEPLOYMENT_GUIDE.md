# Production Deployment Guide - Social Media App

Complete guide for deploying the Social Media App to production with load balancing, caching, and scaling.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Setup](#database-setup)
3. [Server Configuration](#server-configuration)
4. [Load Balancing](#load-balancing)
5. [Caching Strategy](#caching-strategy)
6. [Monitoring & Logging](#monitoring--logging)
7. [Security Hardening](#security-hardening)
8. [Scaling Guidelines](#scaling-guidelines)

---

## Pre-Deployment Checklist

### Environment Variables
```bash
# Create .env file with production values
NODE_ENV=production
PORT=5000

# MongoDB (Atlas recommended for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media-app

# Redis (use managed service or Redis Enterprise)
REDIS_URL=redis://:password@redis.example.com:6379

# Google OAuth
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback

# Security
SESSION_SECRET=use-a-strong-random-string-here
JWT_SECRET=another-strong-random-string

# Domain
PRODUCTION_DOMAIN=yourdomain.com

# SSL/TLS
SSL_CERT_PATH=/etc/ssl/certs/yourdomain.crt
SSL_KEY_PATH=/etc/ssl/private/yourdomain.key
```

### Security Review
- [ ] All secrets are strong and unique
- [ ] Credentials are NOT in git repository
- [ ] CORS is configured for your domain only
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] Input validation is in place
- [ ] SQL injection protections verified (using Mongoose)
- [ ] XSS protections enabled
- [ ] CSRF protections configured

### Performance Review
- [ ] Database indexes are created
- [ ] Redis caching is configured
- [ ] CDN is configured for static assets
- [ ] Image optimization is in place
- [ ] API response times are acceptable
- [ ] Load testing has been completed

---

## Database Setup

### MongoDB Atlas Cloud Database

#### 1. Create MongoDB Atlas Cluster
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and new project
3. Create a cluster (M10 or larger for production)
4. Configure backups (daily minimum)
5. Enable IP Whitelist
6. Create database user
```

#### 2. Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/social-media-app?retryWrites=true&w=majority
```

#### 3. Configure Backups
- Enable daily snapshots
- Set retention to 30 days minimum
- Test restore procedures

#### 4. Create Indexes
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/social-media-app"

# Create performance indexes
db.posts.createIndex({ authorId: 1, createdAt: -1 })
db.posts.createIndex({ createdAt: -1 })
db.comments.createIndex({ postId: 1, createdAt: -1 })
db.follows.createIndex({ followerId: 1 })
db.follows.createIndex({ followingId: 1 })
db.users.createIndex({ email: 1 })
db.analytics.createIndex({ userId: 1, timestamp: -1 })
```

### MongoDB Local Installation (Alternative)
```bash
# For dedicated server
curl https://raw.githubusercontent.com/mongodb/mongo/master/evergreen/mongod-new-install.sh | bash

# Create replication set for high availability
# Create 3 MongoDB instances on different servers
```

---

## Server Configuration

### Docker Deployment (Recommended)

#### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --prod

# Copy app code
COPY . .

# Build frontend
RUN pnpm run build:client

# Build server
RUN pnpm run build:server

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/ping', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start app
CMD ["pnpm", "start"]
```

#### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongo:27017/social-media-app
      REDIS_URL: redis://redis:6379
    depends_on:
      - mongo
      - redis
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  mongo:
    image: mongo:6.0
    volumes:
      - mongo_data:/data/db
    restart: always
    command: --replSet rs0
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: always
    command: redis-server --appendonly yes

volumes:
  mongo_data:
  redis_data:
```

#### 3. Deploy with Docker
```bash
# Build and start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

---

## Load Balancing

### Nginx Configuration for Load Balancing

#### 1. Install Nginx
```bash
sudo apt-get update
sudo apt-get install -y nginx
```

#### 2. Configure Upstream Servers
```nginx
# /etc/nginx/sites-available/social-media-app

upstream app_backend {
    # Use least connections algorithm for better distribution
    least_conn;
    
    # App server instances
    server localhost:5000 weight=2;
    server localhost:5001;
    server localhost:5002;
    server localhost:5003;
    
    # Health check
    keepalive 32;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/yourdomain.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;
    gzip_min_length 1000;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Static files with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://app_backend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API Rate Limiting
    location /api/auth {
        limit_req zone=auth burst=10 nodelay;
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Main API
    location /api {
        limit_req zone=api burst=50 nodelay;
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket
    location /socket.io {
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }
    
    # Main app
    location / {
        limit_req zone=general burst=20 nodelay;
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://app_backend;
    }
}
```

#### 3. Enable and Test
```bash
# Test configuration
sudo nginx -t

# Enable site
sudo ln -s /etc/nginx/sites-available/social-media-app /etc/nginx/sites-enabled/

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Monitor
sudo systemctl status nginx
```

---

## Caching Strategy

### Redis Configuration

#### 1. Redis Enterprise Setup
```bash
# For managed Redis service
REDIS_URL=redis://:password@redis.example.com:6379

# Set cache TTLs based on data type
REDIS_CACHE_TTL=3600        # 1 hour for posts
REDIS_SESSION_TTL=604800    # 7 days for sessions
```

#### 2. Cache Invalidation Strategy
```
- Posts: Invalidate on create/edit
- User profiles: Invalidate on update
- Trending: Recalculate every 5 minutes
- Sessions: TTL-based expiration
```

#### 3. Monitoring Cache
```bash
redis-cli info stats
redis-cli DBSIZE
redis-cli SLOWLOG GET 10
```

---

## Monitoring & Logging

### Application Monitoring

#### 1. Sentry for Error Tracking
```bash
# Install Sentry SDK
npm install @sentry/node

# Configure in server
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

#### 2. Prometheus Metrics
```bash
# Install
npm install prom-client

# Expose metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

#### 3. ELK Stack (Elasticsearch, Logstash, Kibana)
```bash
# Centralized logging
# Send all logs to Elasticsearch
# View and analyze in Kibana
```

### Database Monitoring

```bash
# MongoDB Atlas
- Monitor query performance
- Track storage usage
- Set up alerts for slow queries

# Redis
- Monitor memory usage
- Track hit/miss ratios
- Set up memory eviction policies
```

---

## Security Hardening

### 1. HTTPS/TLS
- [ ] Valid SSL certificate (Let's Encrypt or commercial)
- [ ] TLS 1.2+ only
- [ ] HSTS headers enabled
- [ ] Certificate renewal automated

### 2. Environment Variables
- [ ] All secrets in .env (not in code)
- [ ] Use strong random values
- [ ] Rotate secrets regularly
- [ ] Use environment-specific configurations

### 3. Rate Limiting
- [ ] API endpoints rate limited
- [ ] Auth endpoints (5 req/s)
- [ ] General API (100 req/s)
- [ ] DDoS protection enabled

### 4. Input Validation
- [ ] All inputs validated
- [ ] Mongoose schemas enforce types
- [ ] XSS protection enabled
- [ ] SQL injection not possible (using Mongoose)

### 5. CORS Configuration
```javascript
cors({
  origin: process.env.PRODUCTION_DOMAIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
})
```

---

## Scaling Guidelines

### Horizontal Scaling (Multiple Instances)

```bash
# Start 4 Node.js instances
PORT=5000 pnpm start &
PORT=5001 pnpm start &
PORT=5002 pnpm start &
PORT=5003 pnpm start &
```

### Vertical Scaling (More Resources)

**Recommended specs by user count:**
- 0-1,000 users: 2GB RAM, 1-2 CPU cores
- 1,000-10,000 users: 4GB RAM, 2-4 CPU cores
- 10,000-100,000 users: 8GB+ RAM, 4-8 CPU cores
- 100,000+ users: Multi-server setup with load balancing

### Database Scaling

```
- Single server: Up to 100,000 users
- Replica set: Up to 1,000,000 users
- Sharded cluster: Unlimited scaling
```

### Caching Optimization

- Posts list: Cache 10 minutes
- User profiles: Cache 1 hour
- Trending: Cache 5 minutes
- Sessions: Cache 7 days

---

## Monitoring Commands

```bash
# Check Node.js processes
ps aux | grep node

# Monitor system resources
top
# or
htop

# Check port usage
sudo lsof -i :5000

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Database stats
mongosh
> db.stats()

# Redis stats
redis-cli
> INFO stats
> INFO memory
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backups tested
- [ ] SSL certificate installed
- [ ] Nginx load balancer configured
- [ ] Redis cache running
- [ ] Monitoring setup complete
- [ ] Error tracking (Sentry) configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Application health checks passing
- [ ] Database indexes created
- [ ] Load testing completed
- [ ] Disaster recovery plan documented

---

## Support & Troubleshooting

### Common Issues

**High Memory Usage**
```bash
# Check Node.js process
node --max-old-space-size=4096 dist/server.js

# Check Redis memory
redis-cli INFO memory
```

**Slow Queries**
```bash
# MongoDB
db.currentOp(true)

# Redis
SLOWLOG GET 10
```

**Connection Timeouts**
- Increase proxy timeouts
- Check database connection limits
- Verify network connectivity

---

## Next Steps

1. Set up automated backups
2. Configure CDN for static assets
3. Implement auto-scaling
4. Set up continuous deployment
5. Create runbooks for common issues
6. Train team on deployment procedures

For additional help, refer to the Ubuntu Setup Guide and Google OAuth Setup Guide.
