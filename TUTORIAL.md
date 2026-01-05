# 🟢 Kora Language Tutorial

A comprehensive guide to building full-stack applications with Kora.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Concepts](#core-concepts)
3. [How Kora Runs](#how-kora-runs)
4. [Domain Modules](#domain-modules)
5. [API Modules](#api-modules)
6. [Page Modules](#page-modules)
7. [CSS Styling](#css-styling)
8. [Building Your First App](#building-your-first-app)
9. [Advanced Patterns](#advanced-patterns)
10. [Best Practices](#best-practices)

---

## Getting Started

### Installation

```bash
# Install globally (recommended)
npm install -g @kora-lang/kora

# Verify installation
kora --version
```

If you encounter issues with global installation, see [FIX_GLOBAL_INSTALL.md](./FIX_GLOBAL_INSTALL.md) for troubleshooting.

### Create Your First Project

The easiest way to get started is to create a new Kora project:

```bash
kora new my-app
cd my-app
```

This creates a complete project structure with:
- `src/` - Kora source files (domain, API, page modules)
- `dist/` - Compiled TypeScript output
- `package.json` - Project configuration
- `README.md` - Project documentation

### Build Your Project

```bash
# Build all Kora files to TypeScript
kora build
```

This compiles all `.kora` files in `src/` to TypeScript in `dist/`.

### Start Development Server

```bash
# Watch for changes and rebuild automatically
kora dev
```

The dev server watches your `.kora` files and rebuilds them when you make changes.

### Your First Kora File

The `kora new` command creates example files. Here's what a page module looks like:

```kora
page HelloWorld {
  view() {
    <div>
      <h1>Hello, Kora!</h1>
      <p>Welcome to full-stack development</p>
    </div>
  }
}
```

After running `kora build`, this generates a React component in `dist/hello-world.ts` that you can use in your React or Next.js app!

---

## Core Concepts

Kora organizes code into three types of modules:

1. **Domain Modules** - Define your data models and business logic
2. **API Modules** - Define your backend endpoints
3. **Page Modules** - Define your UI components

### Module Boundaries

Kora enforces architectural boundaries:

- ✅ **Domain** can import from Domain
- ✅ **API** can import from Domain
- ✅ **Page** can import from Domain
- ❌ **Domain** cannot import from API or Page
- ❌ **API** cannot import from Page

This ensures clean architecture by default!

---

## How Kora Runs

Understanding how Kora code executes is crucial. **Kora compiles to standard TypeScript/JavaScript**, which means it runs on existing runtimes—no custom runtime needed!

### Architecture Overview

```
┌─────────────────────────────────────────┐
│         Kora Source Code                 │
│  Domain | API | Page Modules            │
└──────────────┬──────────────────────────┘
               │
          Kora Compiler
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
TypeScript          TypeScript
Interfaces          React Components
                    API Handlers
    │                     │
    └──────────┬──────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────┐          ┌─────────┐
│ Browser │          │ Node.js │
│ (React) │          │ Server  │
└─────────┘          └─────────┘
```

### UI Runtime (Browser)

**Kora Page Modules** compile to **React components** that run in the browser:

```kora
page ProductPage {
  view(product: Product) {
    <div>
      <h1>{product.name}</h1>
    </div>
  }
}
```

**Compiles to:**
```typescript
import React from 'react';

export function ProductPage({ product }: { product: Product }) {
  return (
    <div>
      <h1>{product.name}</h1>
    </div>
  );
}
```

**How it runs:**
1. Kora compiles `.kora` → `.ts` files
2. Vite/Webpack bundles TypeScript → JavaScript
3. Browser loads React component
4. Component renders in DOM

**Setup:**
```bash
# Build Kora files
kora build --src src --out dist

# Run dev server (Vite)
npm run dev  # Opens http://localhost:3000
```

### Server Runtime (Node.js)

**Kora API Modules** compile to **handler functions** that run on Node.js:

```kora
api getProduct {
  input { id: UUID }
  output Product
  
  handler {
    // Your business logic
  }
}
```

**Compiles to:**
```typescript
export async function getProductHandler(
  input: { id: string }
): Promise<Product | undefined> {
  // Your business logic
}
```

**How it runs:**
1. Kora compiles `.kora` → `.ts` files
2. TypeScript compiles → JavaScript
3. Node.js server imports handler
4. Express/Fastify routes call handler

**Setup:**
```javascript
// server.js
const express = require('express');
const { getProductHandler } = require('./dist/get-product');

const app = express();
app.use(express.json());

app.get('/api/products/:id', async (req, res) => {
  const result = await getProductHandler({ id: req.params.id });
  res.json(result);
});

app.listen(3001);
```

### Full-Stack Flow

Here's how a complete request flows:

```
1. User visits page
   ↓
2. React component loads
   ↓
3. Component calls loadProductPage(id)
   ↓
4. HTTP GET /api/products/:id
   ↓
5. Node.js server receives request
   ↓
6. Server calls getProductHandler({ id })
   ↓
7. Handler queries database
   ↓
8. Returns Product data
   ↓
9. React component renders UI
```

### Development Workflow

**Three terminals:**

```bash
# Terminal 1: Watch and compile Kora
kora dev --src src --out dist

# Terminal 2: Frontend dev server
npm run dev  # Vite on :3000

# Terminal 3: Backend server
npm run server  # Node.js on :3001
```

### Setting Up Server and Ports

#### Frontend Server (Vite)

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // Frontend port
    host: true,        // Allow external access
    open: true,        // Auto-open browser
  },
  build: {
    outDir: 'build',   // Output directory
  },
});
```

**Environment Variables:**
```bash
# .env
VITE_API_URL=http://localhost:3001
VITE_PORT=3000
```

#### Backend Server (Node.js/Express)

**server.js:**
```javascript
import express from 'express';
import { getUserHandler } from './dist/get-user.js';

const app = express();
const PORT = process.env.PORT || 3001; // Default port 3001

app.use(express.json());
app.use(express.static('public')); // Serve static files

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// API routes
app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await getUserHandler({ id: req.params.id });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

**package.json scripts:**
```json
{
  "scripts": {
    "server": "node server.js",
    "server:dev": "nodemon server.js",
    "server:prod": "NODE_ENV=production node server.js"
  }
}
```

**Environment Variables:**
```bash
# .env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://...
API_KEY=your-api-key
```

#### Port Configuration

**Default Ports:**
- Frontend (Vite): `3000`
- Backend (Node.js): `3001`
- Kora Dev Server: Watches files (no port needed)

**Change Ports:**

**Frontend:**
```bash
# Via command line
npm run dev -- --port 4000

# Or in vite.config.ts
server: { port: 4000 }
```

**Backend:**
```bash
# Via environment variable
PORT=4001 npm run server

# Or in server.js
const PORT = process.env.PORT || 4001;
```

#### Full-Stack Setup Example

**Complete setup with custom ports:**

```bash
# 1. Create project
kora new my-app
cd my-app

# 2. Install dependencies
npm install express react react-dom
npm install -D vite @vitejs/plugin-react

# 3. Create server.js (backend)
# (See example above)

# 4. Create vite.config.ts (frontend)
# (See example above)

# 5. Create src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserProfile } from './dist/user-profile';

function App() {
  const user = { id: '1', name: 'John', email: 'john@example.com' };
  return <UserProfile user={user} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Run everything:**
```bash
# Terminal 1: Kora compiler (watches for changes)
kora dev

# Terminal 2: Frontend (port 3000)
npm run dev

# Terminal 3: Backend (port 3001)
npm run server
```

### Production Deployment

**Frontend:**
- Build: `kora build && vite build`
- Deploy `build/` to Vercel, Netlify, or any static host
- Set environment variables in hosting platform

**Backend:**
- Build: `kora build && tsc`
- Set `PORT` environment variable (hosting platform usually provides this)
- Deploy to Railway, Render, Heroku, or any Node.js host

### Key Points

✅ **No custom runtime** - Uses standard React and Node.js  
✅ **Standard output** - TypeScript/JavaScript you can debug  
✅ **Framework agnostic** - Works with any React/Node.js setup  
✅ **Type-safe** - Shared types between UI and server  
✅ **Zero lock-in** - Eject to pure TypeScript anytime  

---

## Domain Modules

Domain modules define your data models and business logic.

### File Structure

Domain modules are typically placed in `src/domain/` directory:

```
my-app/
└── src/
    └── domain/
        ├── user.kora          # User domain module
        ├── product.kora       # Product domain module
        └── order.kora         # Order domain module
```

### Basic Type Definition

**File: `src/domain/user.kora`**

```kora
module domain User {
  type User {
    id: UUID
    name: String
    email: Email
    createdAt: Date
  }
}
```

**After compilation (`kora build`), this creates:**

**File: `dist/user.ts`**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

This TypeScript interface can now be imported in both your API handlers and React components!

### Complex Types

```kora
module domain Blog {
  type Post {
    id: UUID
    title: String
    content: String
    author: User
    tags: String[]
    published: Boolean
    createdAt: Date
    updatedAt: Date?
  }

  type Comment {
    id: UUID
    postId: UUID
    author: User
    content: String
    createdAt: Date
  }
}
```

### Type System

Kora supports:

- **Primitives**: `String`, `Number`, `Boolean`, `Date`, `UUID`, `Email`
- **Arrays**: `String[]`, `User[]`
- **Optionals**: `String?`, `Date?`
- **Custom Types**: Any type defined in domain modules
- **Generics**: `List<T>`, `Map<K, V>` (coming soon)

### Constants

```kora
module domain Config {
  const MAX_POST_LENGTH = 5000
  const DEFAULT_PAGE_SIZE = 20
  const APP_NAME = "My Blog"
}
```

---

## API Modules

API modules define your backend endpoints.

### Basic API

```kora
api getUser {
  input {
    id: UUID
  }

  output User

  handler {
    // Your business logic here
    return UserRepo.findById(id)
  }
}
```

### API with Validation

```kora
api createPost {
  input {
    title: String
    content: String
    authorId: UUID
  }

  output Post

  handler {
    if (title.length == 0) {
      throw Error("Title is required")
    }
    
    if (content.length > MAX_POST_LENGTH) {
      throw Error("Content too long")
    }

    return PostRepo.create({
      title,
      content,
      authorId,
      createdAt: Date.now()
    })
  }
}
```

### API with Complex Logic

```kora
api getPostsByAuthor {
  input {
    authorId: UUID
    page: Number?
    limit: Number?
  }

  output Post[]

  handler {
    const pageNum = page ?? 1
    const pageLimit = limit ?? DEFAULT_PAGE_SIZE
    
    return PostRepo.findByAuthor(authorId, {
      page: pageNum,
      limit: pageLimit
    })
  }
}
```

### Generated Output

The compiler generates:

- TypeScript types for input/output
- API route handlers
- Request/response validation
- Error handling

---

## Page Modules

Page modules define your UI components.

### Basic Page

```kora
page Home {
  view() {
    <div>
      <h1>Welcome</h1>
      <p>This is the home page</p>
    </div>
  }
}
```

### Page with Data Loading

```kora
page PostDetail {
  load(id: UUID) -> Post

  view(post: Post) {
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>By {post.author.name}</p>
      <p>Published: {post.createdAt}</p>
    </div>
  }
}
```

### Page with Multiple Parameters

```kora
page UserProfile {
  load(userId: UUID) -> User

  view(user: User) {
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <img src={user.avatar} alt={user.name} />
    </div>
  }
}
```

### Page with Styling

```kora
page StyledPage {
  styles {
    .container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .title {
      font-size: 2rem;
      color: #333;
      margin-bottom: 1rem;
    }
    
    .content {
      line-height: 1.6;
      color: #666;
    }
  }

  view() {
    <div className="container">
      <h1 className="title">Styled Page</h1>
      <p className="content">This page has scoped CSS styles!</p>
    </div>
  }
}
```

### JSX Syntax

Kora supports full JSX:

```kora
page ProductList {
  load() -> Product[]

  view(products: Product[]) {
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span>${product.price}</span>
          </li>
        ))}
      </ul>
    </div>
  }
}
```

---

## CSS Styling

Kora supports multiple CSS approaches:

### Component-Scoped Styles

```kora
page Button {
  styles {
    .button {
      padding: 0.5rem 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .button:hover {
      background: #0056b3;
    }
  }

  view() {
    <button className="button">Click Me</button>
  }
}
```

### Global Styles

```kora
styles global {
  :root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --font-family: 'Inter', sans-serif;
  }
  
  body {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
  }
  
  h1, h2, h3 {
    color: var(--primary-color);
  }
}
```

### Responsive Design

```kora
page ResponsivePage {
  styles {
    .container {
      padding: 1rem;
    }
    
    @media (min-width: 768px) {
      .container {
        padding: 2rem;
      }
    }
    
    @media (min-width: 1024px) {
      .container {
        padding: 3rem;
        max-width: 1200px;
        margin: 0 auto;
      }
    }
  }

  view() {
    <div className="container">
      <h1>Responsive Page</h1>
    </div>
  }
}
```

---

## Building Your First App

Let's build a simple Todo app!

### Step 1: Define Domain

Create `domain/todo.kora`:

```kora
module domain Todo {
  type Todo {
    id: UUID
    title: String
    completed: Boolean
    createdAt: Date
  }
}
```

### Step 2: Create APIs

Create `api/todos.kora`:

```kora
api getTodos {
  output Todo[]

  handler {
    return TodoRepo.findAll()
  }
}

api createTodo {
  input {
    title: String
  }

  output Todo

  handler {
    return TodoRepo.create({
      title,
      completed: false,
      createdAt: Date.now()
    })
  }
}

api toggleTodo {
  input {
    id: UUID
  }

  output Todo

  handler {
    const todo = TodoRepo.findById(id)
    todo.completed = !todo.completed
    return TodoRepo.update(todo)
  }
}
```

### Step 3: Build UI

Create `page/todos.kora`:

```kora
page Todos {
  load() -> Todo[]

  view(todos: Todo[]) {
    <div>
      <h1>My Todos</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox" 
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  }
}
```

### Step 4: Compile and Run

```bash
# Compile all files
kora build

# Or compile individually
kora compile domain/todo.kora -o dist/domain/todo.ts
kora compile api/todos.kora -o dist/api/todos.ts
kora compile page/todos.kora -o dist/page/todos.tsx
```

### Step 5: Use in Your App

```typescript
// In your Next.js or React app
import { Todos } from './dist/page/todos'

export default function App() {
  return <Todos />
}
```

---

## Advanced Patterns

### Error Handling

```kora
api getUser {
  input {
    id: UUID
  }

  output User

  handler {
    const user = UserRepo.findById(id)
    
    if (!user) {
      throw Error("User not found")
    }
    
    return user
  }
}
```

### Conditional Rendering

```kora
page UserProfile {
  load(userId: UUID) -> User?

  view(user: User?) {
    <div>
      {user ? (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  }
}
```

### Lists and Loops

```kora
page ProductList {
  load() -> Product[]

  view(products: Product[]) {
    <div>
      <h1>Products</h1>
      {products.length > 0 ? (
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found</p>
      )}
    </div>
  }
}
```

### Event Handlers

```kora
page Counter {
  view() {
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => count++}>Increment</button>
      <button onClick={() => count--}>Decrement</button>
    </div>
  }
}
```

---

## Best Practices

### 1. Organize by Feature

```
src/
  domain/
    user.kora
    post.kora
  api/
    user/
      get-user.kora
      create-user.kora
    post/
      get-post.kora
      create-post.kora
  page/
    user/
      profile.kora
    post/
      detail.kora
```

### 2. Keep Domain Pure

- Domain modules should only contain data models and business logic
- No API calls, no UI code, no framework dependencies

### 3. Use Type Safety

- Always define types in domain modules
- Use optional types (`?`) for nullable fields
- Leverage Kora's type system for compile-time safety

### 4. Style Consistently

- Use component-scoped styles for reusable components
- Use global styles for theme variables and base styles
- Keep styles close to components

### 5. Error Handling

- Always validate input in API handlers
- Use descriptive error messages
- Handle optional types in UI

### 6. Performance

- Use `load` functions for data fetching
- Keep API handlers focused and fast
- Minimize re-renders in UI

---

## Next Steps

1. **Create a project** - Use `kora new my-app` to get started
2. **Read the guides**:
   - [CREATE_APP_GUIDE.md](./CREATE_APP_GUIDE.md) - Complete app creation guide
   - [RUNTIME_ARCHITECTURE.md](./RUNTIME_ARCHITECTURE.md) - How UI and server run
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy your Kora apps
3. **Explore examples** - Check the `samples/` directory for real-world patterns
4. **Build something** - Start with a simple todo app, then expand
5. **Join the community** - Get help and share your projects on GitHub

## Quick Reference

### Commands

```bash
# Create new project
kora new <name>

# Build project
kora build

# Start dev server (watch mode)
kora dev

# Compile single file
kora compile <file> -o <output>

# Check syntax
kora check <file>
```

### Project Structure

```
my-app/
├── src/              # Kora source files (.kora)
│   ├── domain/       # Domain modules (data types)
│   ├── api/          # API modules (backend handlers)
│   └── ui/           # Page modules (UI components)
├── dist/             # Compiled TypeScript output
├── package.json      # Project configuration
└── README.md         # Project documentation
```

### Common Patterns

**Domain Module:**
```kora
module domain User {
  type User {
    id: UUID
    name: String
    email: Email
  }
}
```

**API Module:**
```kora
api getUser {
  input { id: UUID }
  output User
  
  handler {
    // Your business logic
  }
}
```

**Page Module:**
```kora
page UserProfile {
  load(id: UUID) -> User
  
  view(user: User) {
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  }
}
```

---

**Happy coding with Kora! 🟢**

