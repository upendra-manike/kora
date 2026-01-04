# Docker Web Servers for Kora (Without SSL)

Guide to web servers for deploying Kora with Docker without SSL setup.

## Overview

When deploying Kora with Docker, you have several web server options:

1. **Direct Node.js** - Run Express server directly (simplest)
2. **Nginx** - Reverse proxy (most popular)
3. **Apache** - Alternative reverse proxy
4. **Caddy** - Modern web server (auto SSL, but works without)
5. **Traefik** - Container-aware reverse proxy

## Option 1: Direct Node.js (Simplest)

**Best for**: Development, internal services, quick deployments

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY server/ ./server/

EXPOSE 3000

CMD ["node", "server/server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  kora-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

**Pros**:
- ✅ Simplest setup
- ✅ No additional configuration
- ✅ Direct access to Node.js

**Cons**:
- ❌ No static file serving optimization
- ❌ No load balancing
- ❌ Limited caching

## Option 2: Nginx Reverse Proxy (Recommended)

**Best for**: Production, static files, load balancing

### Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP (Port 80)
       ▼
┌─────────────┐
│   Nginx     │
│  (Port 80)  │
└──────┬──────┘
       │ HTTP (Port 3000)
       ▼
┌─────────────┐
│  Node.js    │
│  (Port 3000)│
└─────────────┘
```

### Docker Compose Setup

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - kora-api
    restart: unless-stopped

  kora-api:
    build: .
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

### Nginx Configuration

**nginx.conf**:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream kora_api {
        server kora-api:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # API endpoints
        location /api/ {
            proxy_pass http://kora_api;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check
        location /health {
            proxy_pass http://kora_api/health;
        }

        # Static files (if serving docs)
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

**Pros**:
- ✅ Excellent performance
- ✅ Static file serving
- ✅ Load balancing
- ✅ Caching
- ✅ Rate limiting

**Cons**:
- ⚠️ Requires configuration
- ⚠️ Additional container

## Option 3: Apache Reverse Proxy

**Best for**: Teams familiar with Apache

### Docker Compose

```yaml
version: '3.8'
services:
  apache:
    image: httpd:alpine
    ports:
      - "80:80"
    volumes:
      - ./httpd.conf:/usr/local/apache2/conf/httpd.conf:ro
    depends_on:
      - kora-api
    restart: unless-stopped

  kora-api:
    build: .
    expose:
      - "3000"
    restart: unless-stopped
```

### Apache Configuration

**httpd.conf**:
```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so

<VirtualHost *:80>
    ServerName localhost
    
    ProxyPreserveHost On
    ProxyPass /api/ http://kora-api:3000/api/
    ProxyPassReverse /api/ http://kora-api:3000/api/
    
    ProxyPass /health http://kora-api:3000/health
    ProxyPassReverse /health http://kora-api:3000/health
</VirtualHost>
```

## Option 4: Caddy (Modern Alternative)

**Best for**: Simple configuration, future SSL upgrade

### Docker Compose

```yaml
version: '3.8'
services:
  caddy:
    image: caddy:alpine
    ports:
      - "80:80"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
    depends_on:
      - kora-api
    restart: unless-stopped

  kora-api:
    build: .
    expose:
      - "3000"
    restart: unless-stopped
```

### Caddyfile

```
localhost {
    reverse_proxy /api/* kora-api:3000
    reverse_proxy /health kora-api:3000
}
```

**Pros**:
- ✅ Simple configuration
- ✅ Easy SSL upgrade later
- ✅ Automatic HTTPS (when configured)

## Option 5: Traefik (Container-Aware)

**Best for**: Multiple services, automatic routing

### Docker Compose

```yaml
version: '3.8'
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
    ports:
      - "80:80"
      - "8080:8080"  # Traefik dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    restart: unless-stopped

  kora-api:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.kora.rule=Host(`localhost`)"
      - "traefik.http.routers.kora.entrypoints=web"
      - "traefik.http.services.kora.loadbalancer.server.port=3000"
    expose:
      - "3000"
    restart: unless-stopped
```

## Comparison

| Web Server | Complexity | Performance | Static Files | Load Balancing |
|------------|-----------|-------------|--------------|----------------|
| Direct Node.js | ⭐ Simple | ⭐⭐ Good | ❌ No | ❌ No |
| Nginx | ⭐⭐ Medium | ⭐⭐⭐ Excellent | ✅ Yes | ✅ Yes |
| Apache | ⭐⭐ Medium | ⭐⭐⭐ Excellent | ✅ Yes | ✅ Yes |
| Caddy | ⭐ Simple | ⭐⭐⭐ Excellent | ✅ Yes | ✅ Yes |
| Traefik | ⭐⭐⭐ Complex | ⭐⭐⭐ Excellent | ✅ Yes | ✅ Yes |

## Recommended Setup

### For Development

**Direct Node.js**:
```yaml
services:
  kora-api:
    build: .
    ports:
      - "3000:3000"
```

### For Production (No SSL)

**Nginx + Node.js**:
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - kora-api

  kora-api:
    build: .
    expose:
      - "3000"
```

## Complete Example: Nginx Setup

### Project Structure

```
kora-docker/
├── docker-compose.yml
├── nginx.conf
├── Dockerfile
└── server/
    └── server.js
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    container_name: kora-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - kora-api
    restart: unless-stopped
    networks:
      - kora-network

  kora-api:
    build: .
    container_name: kora-api
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    networks:
      - kora-network

networks:
  kora-network:
    driver: bridge
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Upstream
    upstream kora_api {
        server kora-api:3000;
    }

    server {
        listen 80;
        server_name _;

        # API endpoints
        location /api/ {
            proxy_pass http://kora_api;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check
        location /health {
            proxy_pass http://kora_api/health;
            access_log off;
        }

        # Root
        location / {
            return 200 "Kora API Server";
            add_header Content-Type text/plain;
        }
    }
}
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy built compiler
COPY dist/ ./node_modules/@kora-lang/kora/dist/

# Copy server
COPY server/ ./server/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "server/server.js"]
```

## Deployment Commands

### Build and Run

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Test

```bash
# Health check
curl http://localhost/health

# Compile API
curl -X POST http://localhost/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"page Test { view() { <div>Hello</div> } }"}'
```

## Production Considerations

### 1. Environment Variables

```yaml
services:
  kora-api:
    environment:
      - NODE_ENV=production
      - PORT=3000
      - ALLOWED_ORIGINS=http://yourdomain.com
```

### 2. Resource Limits

```yaml
services:
  kora-api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 3. Logging

```yaml
services:
  kora-api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 4. Health Checks

```yaml
services:
  kora-api:
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Without SSL: Security Notes

⚠️ **Important**: Without SSL, all traffic is unencrypted.

### Recommendations:

1. **Internal Networks Only**: Use for internal services
2. **VPN Access**: Require VPN for access
3. **Firewall Rules**: Restrict access by IP
4. **Rate Limiting**: Implement in Nginx
5. **Authentication**: Add API keys/tokens

### Nginx Rate Limiting

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    server {
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://kora_api;
        }
    }
}
```

## Quick Start

### Simplest (Direct Node.js)

```bash
docker run -p 3000:3000 kora-server
```

### With Nginx

```bash
# Clone and setup
git clone https://github.com/upendra-manike/kora.git
cd kora

# Create nginx.conf (use example above)
# Create docker-compose.yml (use example above)

# Deploy
docker-compose up -d
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80

# Or use different port
ports:
  - "8080:80"
```

### Container Not Starting

```bash
# Check logs
docker-compose logs kora-api

# Check nginx logs
docker-compose logs nginx
```

### Connection Refused

```bash
# Verify containers are running
docker-compose ps

# Check network
docker network inspect kora-docker_kora-network
```

---

**For production without SSL, Nginx reverse proxy is recommended for best performance and features.**

