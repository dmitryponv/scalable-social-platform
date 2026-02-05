# Installation Guide - Choose Your Setup

Select the installation guide that matches your needs:

## Option 1: Local Testing (Recommended for Development)

Use this guide to set up on **localhost** with self-signed SSL certificates.

**Best for:**
- Testing locally on your development machine
- Quick setup without domain requirements
- Testing the full application stack

**Guide:** [INSTALLATION-LOCAL.md](INSTALLATION-LOCAL.md)

```bash
# Quick overview: Sets up Docker, Node.js, and uses self-signed certificates
# Access at: https://localhost:5443 (browser will warn about certificate)
```

---

## Option 2: Production Domain Setup

Use this guide to set up on a **real domain** with Let's Encrypt SSL certificates.

**Best for:**
- Production deployment with a real domain
- Public internet access
- Professional SSL certificates

**Requirements:**
- Own or control a domain (e.g., scalable-social-platform.com)
- Domain's DNS must point to your server's public IP
- Port 80 must be accessible from the internet

**Guide:** [INSTALLATION-DOMAIN.md](INSTALLATION-DOMAIN.md)

```bash
# Quick overview: Same as local, but includes Let's Encrypt SSL setup
# Access at: https://yourdomain.com (valid SSL certificate)
```

---

## Quick Comparison

| Feature | Local | Domain |
|---------|-------|--------|
| Domain required | No | Yes |
| DNS setup | No | Yes |
| SSL certificate | Self-signed | Let's Encrypt |
| Browser warning | Yes | No |
| Setup time | 5 minutes | 15 minutes |
| Cost | Free | Free |
| Best for | Development/Testing | Production |

---

## Start Installation

Choose one and follow the guide:

1. **Local setup** → [INSTALLATION-LOCAL.md](INSTALLATION-LOCAL.md)
2. **Domain setup** → [INSTALLATION-DOMAIN.md](INSTALLATION-DOMAIN.md)

After installation, proceed to [QUICKSTART.md](QUICKSTART.md) to start the server.
