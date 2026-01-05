# Docker Deployment Guide - Kora Server

Quick reference for deploying Kora server with Docker.

## Web Server Options

### 1. Direct Node.js (Simplest)

**Use**: Development, internal services

```bash
docker-compose -f docker-compose.simple.yml up -d
```

**Access**: `http://localhost:3000`

### 2. Nginx Reverse Proxy (Recommended)

**Use**: Production, best performance

```bash
docker-compose -f docker-compose.nginx.yml up -d
```

**Access**: `http://localhost` (port 80)

**Features**:
- ✅ Reverse proxy
- ✅ Rate limiting
- ✅ Gzip compression
- ✅ Load balancing ready

### 3. Caddy (Modern Alternative)

**Use**: Simple setup, easy SSL upgrade

```bash
docker-compose -f docker-compose.caddy.yml up -d
```

**Access**: `http://localhost` (port 80)

## Quick Start

### Option A: Simple (Direct Node.js)

```bash
cd server
docker-compose -f docker-compose.simple.yml up -d
```

### Option B: With Nginx

```bash
cd server
docker-compose -f docker-compose.nginx.yml up -d
```

## Test Deployment

```bash
# Health check
curl http://localhost/health

# Compile code
curl -X POST http://localhost/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"page Test { view() { <div>Hello</div> } }"}'
```

## Management

```bash
# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose build --no-cache

# Restart
docker-compose restart
```

## Configuration

### Environment Variables

Edit `docker-compose.*.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - ALLOWED_ORIGINS=http://yourdomain.com
```

### Nginx Configuration

Edit `nginx.conf` for custom routing, rate limits, etc.

### Caddy Configuration

Edit `Caddyfile` for custom routing.

## Production Notes

⚠️ **Without SSL**: All traffic is unencrypted. Use for:
- Internal networks
- Development
- Testing
- Behind VPN

For production with SSL, see `DEPLOYMENT.md`.

---

**Choose the setup that fits your needs!**


