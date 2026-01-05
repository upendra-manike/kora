# Deploying Kora Language

Complete guide on how to publish and deploy Kora on servers.

## Current Deployment Status

### ✅ Already Deployed

1. **npm Package**: Published to npm as `@kora-lang/kora`
2. **GitHub Repository**: Available at `github.com/upendra-manike/kora`
3. **Documentation Website**: Hosted on GitHub Pages at `upendra-manike.github.io/kora`

## Deployment Options

### 1. npm Package (Already Done)

**Status**: ✅ Published

```bash
# Install globally
npm install -g @kora-lang/kora

# Or in project
npm install @kora-lang/kora
```

**Update Process**:
```bash
# Update version in package.json
npm version patch  # or minor, major

# Publish
npm publish --access public
```

### 2. GitHub Pages (Already Done)

**Status**: ✅ Deployed

- URL: https://upendra-manike.github.io/kora/
- Auto-deploys on push to `main` branch
- Located in `docs/` directory

**Update Process**:
```bash
# Make changes to docs/
git add docs/
git commit -m "Update website"
git push
# Auto-deploys via GitHub Actions
```

### 3. Web Playground / Online IDE

Create an interactive web-based compiler.

#### Option A: Simple Static Playground

**Technology**: React + Monaco Editor + WebAssembly

**Structure**:
```
playground/
├── src/
│   ├── App.tsx
│   ├── Editor.tsx
│   ├── Output.tsx
│   └── compiler.ts
├── public/
└── package.json
```

**Deployment**:
- Vercel: `vercel deploy`
- Netlify: `netlify deploy`
- GitHub Pages: Build and deploy `dist/`

#### Option B: Full-Featured Playground

**Technology**: Next.js + Monaco Editor + API Routes

**Features**:
- Code editor with syntax highlighting
- Real-time compilation
- Output preview
- Shareable links
- Examples gallery

**Deployment**:
```bash
# Deploy to Vercel
npm install -g vercel
vercel

# Or deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod
```

### 4. Language Server / API Service

Host the compiler as a REST API.

#### Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│  API Server │
│  (Node.js)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Compiler  │
│   (Kora)    │
└─────────────┘
```

#### Implementation

**server.js**:
```javascript
const express = require('express');
const { Parser, Compiler } = require('@kora-lang/kora');
const app = express();

app.use(express.json());

app.post('/api/compile', (req, res) => {
  try {
    const { code } = req.body;
    const parser = new Parser();
    const compiler = new Compiler();
    
    const ast = parser.parse(code);
    const result = compiler.compile(ast);
    
    res.json({
      success: true,
      typescript: result.typescript,
      css: Object.fromEntries(result.css)
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Kora API Server running on port 3000');
});
```

**Deployment Options**:

1. **Heroku**:
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku create kora-api
git push heroku main
```

2. **Railway**:
```bash
railway init
railway up
```

3. **Render**:
- Connect GitHub repo
- Set build command: `npm install`
- Set start command: `node server.js`

4. **DigitalOcean App Platform**:
- Connect repository
- Auto-detects Node.js
- Deploys automatically

5. **AWS Lambda** (Serverless):
```javascript
// lambda.js
exports.handler = async (event) => {
  const { code } = JSON.parse(event.body);
  // Compile code
  return {
    statusCode: 200,
    body: JSON.stringify({ result })
  };
};
```

### 5. Docker Deployment

Containerize Kora for easy deployment.

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY dist/ ./dist/
COPY src/ ./src/

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  kora-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

**Deployment**:
```bash
# Build
docker build -t kora-lang .

# Run
docker run -p 3000:3000 kora-lang

# Or with compose
docker-compose up -d
```

**Deploy to**:
- Docker Hub
- AWS ECS
- Google Cloud Run
- Azure Container Instances

### 6. Cloud Platform Deployment

#### Vercel (Serverless Functions)

**api/compile.ts**:
```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Parser, Compiler } from '@kora-lang/kora';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    const parser = new Parser();
    const compiler = new Compiler();
    
    const ast = parser.parse(code);
    const result = compiler.compile(ast);
    
    res.json({
      success: true,
      typescript: result.typescript,
      css: Object.fromEntries(result.css)
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}
```

**Deploy**:
```bash
vercel
```

#### Netlify Functions

**netlify/functions/compile.js**:
```javascript
const { Parser, Compiler } = require('@kora-lang/kora');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { code } = JSON.parse(event.body);
    const parser = new Parser();
    const compiler = new Compiler();
    
    const ast = parser.parse(code);
    const result = compiler.compile(ast);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        typescript: result.typescript,
        css: Object.fromEntries(result.css)
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
```

**Deploy**:
```bash
netlify deploy --prod
```

### 7. CDN Distribution

Make Kora available via CDN.

#### Option A: Unpkg (Automatic)

Once published to npm, available at:
```
https://unpkg.com/@kora-lang/kora@latest/dist/index.js
```

#### Option B: jsDelivr

```
https://cdn.jsdelivr.net/npm/@kora-lang/kora@latest/dist/index.js
```

#### Option C: Custom CDN

1. Build bundle:
```bash
npm run build
# Create browser bundle
npx webpack --mode production
```

2. Upload to:
- Cloudflare CDN
- AWS CloudFront
- Google Cloud CDN
- Azure CDN

### 8. VS Code Extension

Publish to VS Code Marketplace.

**Steps**:
1. Create extension with Language Server Protocol
2. Package: `vsce package`
3. Publish: `vsce publish`

**Benefits**:
- Syntax highlighting
- Auto-completion
- Error checking
- Integrated experience

## Recommended Deployment Strategy

### Phase 1: Current (Done)
- ✅ npm package
- ✅ GitHub Pages
- ✅ GitHub repository

### Phase 2: Web Playground (Next)
- Create React/Next.js playground
- Deploy to Vercel/Netlify
- Add shareable links

### Phase 3: API Service
- Create REST API
- Deploy to Railway/Render
- Add rate limiting
- Add authentication (optional)

### Phase 4: Advanced
- VS Code extension
- Language Server Protocol
- Docker images
- CDN distribution

## Quick Start: Deploy API Server

### 1. Create Server

```bash
mkdir kora-server
cd kora-server
npm init -y
npm install express @kora-lang/kora
```

**server.js**:
```javascript
const express = require('express');
const { Parser, Compiler } = require('@kora-lang/kora');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/api/compile', (req, res) => {
  try {
    const { code } = req.body;
    const parser = new Parser();
    const compiler = new Compiler();
    
    const ast = parser.parse(code);
    const result = compiler.compile(ast);
    
    res.json({
      success: true,
      typescript: result.typescript,
      css: Object.fromEntries(result.css)
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kora API Server running on port ${PORT}`);
});
```

### 2. Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### 3. Deploy to Render

1. Go to render.com
2. New → Web Service
3. Connect GitHub repo
4. Set:
   - Build: `npm install`
   - Start: `node server.js`
5. Deploy

### 4. Deploy to Heroku

```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Create app
heroku create kora-api

# Deploy
git push heroku main
```

## Environment Variables

```bash
# .env
PORT=3000
NODE_ENV=production
RATE_LIMIT_PER_MINUTE=60
ALLOWED_ORIGINS=https://yourdomain.com
```

## Security Considerations

1. **Rate Limiting**:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

2. **CORS**:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
```

3. **Input Validation**:
```javascript
if (!code || typeof code !== 'string' || code.length > 100000) {
  return res.status(400).json({ error: 'Invalid input' });
}
```

## Monitoring

1. **Logging**: Use Winston or Pino
2. **Error Tracking**: Sentry
3. **Metrics**: Prometheus + Grafana
4. **Uptime**: UptimeRobot or Pingdom

## Cost Estimates

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Vercel | ✅ Generous | $20/mo |
| Netlify | ✅ Generous | $19/mo |
| Railway | ✅ $5 credit | $5/mo+ |
| Render | ✅ Limited | $7/mo+ |
| Heroku | ❌ None | $7/mo+ |
| DigitalOcean | ❌ None | $5/mo+ |

## Next Steps

1. **Choose deployment target** (Vercel/Netlify recommended)
2. **Create API server** (if needed)
3. **Set up monitoring**
4. **Configure domain** (optional)
5. **Add documentation**

---

**Kora is ready to deploy! Choose the option that fits your needs.**


