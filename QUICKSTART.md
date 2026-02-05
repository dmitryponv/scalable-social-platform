# Quick Start Guide

Choose your setup:

## Option 1: Development (Recommended for Testing)
- Local Node.js dev server
- No Docker needed
- Hot reload enabled
- Fast feedback loop
- **File:** QUICKSTART_DEV.md

```bash
pnpm install
pnpm run dev
# Access: http://localhost:8080
```

## Option 2: Production (Ubuntu Deployment)
- Complete Docker setup with MongoDB, Redis, Nginx
- SSL/TLS encryption
- Google OAuth integration
- Production-ready deployment
- **File:** QUICKSTART_PRODUCTION.md

```bash
bash scripts/generate-ssl-certs.sh
docker-compose up -d
# Access: https://localhost:5443
```

## Port Conflict Issues?

Run the hard reset script:

```bash
bash scripts/hard-reset.sh
sleep 10
docker-compose up -d
```

## All Available Guides

- **QUICKSTART_DEV.md** - Development setup (local server)
- **QUICKSTART_PRODUCTION.md** - Production deployment (Ubuntu + Docker)
- **QUICKSTART.md** - This file (overview)

## Which One Should I Use?

| Need | Use |
|------|-----|
| Testing features locally | QUICKSTART_DEV.md |
| Deploying to production | QUICKSTART_PRODUCTION.md |
| Learning the codebase | QUICKSTART_DEV.md |
| Full stack with databases | QUICKSTART_PRODUCTION.md |
| Just UI development | QUICKSTART_DEV.md |

## Common Issues

### Docker port conflicts
```bash
bash scripts/hard-reset.sh
```

### Can't access app
- Dev: http://localhost:8080
- Production: https://localhost:5443 (ignore SSL warning)

### MongoDB won't connect
```bash
docker-compose down -v
docker-compose up -d
sleep 15
docker-compose ps
```

### Container won't start
```bash
docker-compose logs app
```

## Support

See respective guide for detailed troubleshooting:
- QUICKSTART_DEV.md - Development troubleshooting
- QUICKSTART_PRODUCTION.md - Production troubleshooting
