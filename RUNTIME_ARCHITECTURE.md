# Kora Runtime Architecture

## How UI and Server Run

Kora compiles to **standard TypeScript/JavaScript**, which means it runs on existing runtimes:

- **UI**: Runs in the browser as React components
- **Server**: Runs on Node.js as API handlers
- **Domain**: Shared TypeScript types (used by both)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Kora Source Code                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Domain   │  │   API    │  │   Page   │             │
│  │ Modules  │  │ Modules  │  │ Modules  │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└───────┼─────────────┼──────────────┼────────────────────┘
        │             │              │
        │             │              │
    Kora Compiler (kora build)
        │             │              │
        ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ TypeScript│  │TypeScript │  │TypeScript│
│ Interfaces│  │ Handlers  │  │  React   │
│           │  │           │  │Components│
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │              │              │
      │              │              │
      └──────────────┴──────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌─────────┐            ┌─────────┐
    │ Browser │            │ Node.js │
    │ (React) │            │  Server │
    └─────────┘            └─────────┘
         │                       │
         └───────────┬───────────┘
                     │
              HTTP/API Calls
```

---

## 1. UI Runtime (Browser)

### Compilation Output

**Kora Page Module:**
```kora
page ProductPage {
  load(id: UUID) -> Product
  
  view(product: Product) {
    <div>
      <h1>{product.name}</h1>
      <p>{product.price}</p>
    </div>
  }
}
```

**Compiles to:**
```typescript
import React from 'react';
import { Product } from './product'; // Domain type

export async function loadProductPage(id: string): Promise<Product> {
  // TODO: Implement load function
  throw new Error("Not implemented");
}

export function ProductPage({ product }: { product: Product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.price}</p>
    </div>
  );
}
```

### How It Runs

1. **Build Process:**
   ```bash
   kora build --src src --out dist
   # Compiles .kora files to .ts files
   ```

2. **Bundle with Vite/Webpack:**
   ```bash
   vite build
   # Bundles TypeScript → JavaScript for browser
   ```

3. **Run in Browser:**
   - React runtime loads the component
   - Component renders in DOM
   - Makes API calls to fetch data

### Example Setup

**package.json:**
```json
{
  "scripts": {
    "kora:build": "kora build --src src --out dist",
    "dev": "kora:build && vite",
    "build": "kora:build && vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
```

**src/main.tsx:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProductPage, loadProductPage } from '../dist/product-page';

async function App() {
  // Load data from API
  const product = await loadProductPage('123');
  
  return <ProductPage product={product} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 2. Server Runtime (Node.js)

### Compilation Output

**Kora API Module:**
```kora
api getProduct {
  input { id: UUID }
  output Product
  
  handler {
    // TODO: Implement
  }
}
```

**Compiles to:**
```typescript
import { Product } from './product'; // Domain type

export interface getProductInput {
  id: string;
}

export type getProductOutput = Product;

export async function getProductHandler(
  input: getProductInput
): Promise<getProductOutput | undefined> {
  // TODO: Implement handler
}
```

### How It Runs

1. **Build Process:**
   ```bash
   kora build --src src --out dist
   # Compiles .kora files to .ts files
   ```

2. **Compile TypeScript:**
   ```bash
   tsc dist/*.ts --outDir build --target ES2020 --module commonjs
   # Or use ts-node for development
   ```

3. **Run on Node.js:**
   - Express/Fastify server imports handlers
   - Routes map to handler functions
   - Handlers execute business logic

### Example Setup

**server.js:**
```javascript
const express = require('express');
const { getProductHandler } = require('./dist/get-product');

const app = express();
app.use(express.json());

// API Route
app.get('/api/products/:id', async (req, res) => {
  try {
    const input = { id: req.params.id };
    const result = await getProductHandler(input);
    
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
```

**package.json:**
```json
{
  "scripts": {
    "kora:build": "kora build --src src --out dist",
    "build": "kora:build && tsc",
    "start": "node server.js",
    "dev": "kora:build && nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "typescript": "^5.3.0"
  }
}
```

---

## 3. Full-Stack Application Flow

### Complete Example

**1. Domain Module (Shared Types):**
```kora
// src/domain/product.kora
module domain Product {
  type Product {
    id: UUID
    name: String
    price: Number
  }
}
```

**2. API Module (Server):**
```kora
// src/api/get-product.kora
api getProduct {
  input { id: UUID }
  output Product
  
  handler {
    // Fetch from database
    return fetchProduct(input.id);
  }
}
```

**3. Page Module (UI):**
```kora
// src/ui/product-page.kora
page ProductPage {
  load(id: UUID) -> Product
  
  view(product: Product) {
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  }
}
```

### Runtime Flow

```
┌─────────────┐
│   Browser   │
│  (React UI) │
└──────┬──────┘
       │
       │ 1. User visits /products/123
       │
       ▼
┌─────────────────┐
│ loadProductPage │
│   (compiled)    │
└──────┬──────────┘
       │
       │ 2. HTTP GET /api/products/123
       │
       ▼
┌─────────────┐
│ Node.js API │
│   Server    │
└──────┬──────┘
       │
       │ 3. Route handler calls
       │    getProductHandler({ id: '123' })
       │
       ▼
┌─────────────────┐
│ getProductHandler│
│   (compiled)    │
└──────┬──────────┘
       │
       │ 4. Database query
       │
       ▼
┌─────────────┐
│  Database   │
└─────────────┘
       │
       │ 5. Return Product data
       │
       ▼
┌─────────────┐
│   Browser   │
│ Renders UI  │
└─────────────┘
```

---

## 4. Development Workflow

### Setup

```bash
# 1. Create project
mkdir my-kora-app
cd my-kora-app

# 2. Initialize
npm init -y
npm install react react-dom express

# 3. Install Kora CLI (if published)
npm install -g @kora-lang/kora
# Or use local build
# node ../kora/dist/cli.js build

# 4. Create structure
mkdir -p src/{domain,api,ui} dist
```

### Development

**Terminal 1 - Kora Compiler (watches for changes):**
```bash
kora dev --src src --out dist
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev  # Runs Vite
# Opens http://localhost:3000
```

**Terminal 3 - Backend Server:**
```bash
npm run server  # Runs Node.js API
# Runs on http://localhost:3001
```

### Production Build

```bash
# 1. Build Kora → TypeScript
kora build --src src --out dist

# 2. Build Frontend
cd frontend
vite build
# Output: dist/ (static files)

# 3. Build Backend
cd backend
tsc dist/*.ts --outDir build
# Output: build/ (JavaScript)

# 4. Deploy
# Frontend: Deploy dist/ to CDN (Vercel, Netlify)
# Backend: Deploy build/ + server.js to Node.js host (Railway, Render)
```

---

## 5. Runtime Requirements

### Frontend (Browser)
- **Runtime**: React 18+
- **Bundler**: Vite, Webpack, or esbuild
- **Target**: Modern browsers (ES2020+)

### Backend (Server)
- **Runtime**: Node.js 18+
- **Framework**: Express, Fastify, or any Node.js framework
- **Target**: ES2020 CommonJS or ES Modules

### Shared
- **TypeScript**: For type checking (optional in production)
- **Domain Types**: Shared between frontend and backend

---

## 6. Communication Pattern

### API Client Generation (Future)

Kora will generate API clients automatically:

```kora
// This will generate:
// - TypeScript client functions
// - Type-safe request/response types
// - Error handling
```

**Generated Client:**
```typescript
// dist/api-client.ts (auto-generated)
import { getProductHandler } from './get-product';

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}
```

**Usage in UI:**
```typescript
// src/main.tsx
import { getProduct } from '../dist/api-client';
import { ProductPage } from '../dist/product-page';

async function App() {
  const product = await getProduct('123');
  return <ProductPage product={product} />;
}
```

---

## 7. Deployment Options

### Frontend Deployment
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Cloudflare Pages**: Connect GitHub repo
- **Static Hosting**: Upload `dist/` folder

### Backend Deployment
- **Railway**: `railway up`
- **Render**: Connect GitHub repo
- **Heroku**: `git push heroku main`
- **AWS Lambda**: Serverless functions
- **Docker**: Containerize and deploy anywhere

### Full-Stack Deployment
- **Next.js**: Use Kora with Next.js API routes
- **Remix**: Use Kora with Remix loaders
- **Monorepo**: Separate frontend/backend packages

---

## Summary

**Kora doesn't create a new runtime** — it compiles to standard JavaScript/TypeScript that runs on:

- ✅ **Browser**: React components (standard React runtime)
- ✅ **Server**: Node.js handlers (standard Node.js runtime)
- ✅ **Types**: TypeScript interfaces (shared between both)

**The magic is in the compilation**, not the runtime. You get:
- Enforced architectural boundaries
- Shared types between UI and server
- Zero boilerplate
- Standard output you can debug and modify

**You're not locked in** — the compiled code is standard TypeScript/JavaScript that works with any tooling.

