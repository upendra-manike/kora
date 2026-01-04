# 🟢 Kora Language Tutorial

A comprehensive guide to building full-stack applications with Kora.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Core Concepts](#core-concepts)
3. [Domain Modules](#domain-modules)
4. [API Modules](#api-modules)
5. [Page Modules](#page-modules)
6. [CSS Styling](#css-styling)
7. [Building Your First App](#building-your-first-app)
8. [Advanced Patterns](#advanced-patterns)
9. [Best Practices](#best-practices)

---

## Getting Started

### Installation

```bash
# Install globally
npm install -g @kora-lang/kora

# Or use with npx
npx @kora-lang/kora new my-app
```

### Your First Kora File

Create a file `hello.kora`:

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

Compile it:

```bash
kora compile hello.kora -o hello.ts
```

This generates a React component you can use in your Next.js or React app!

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

## Domain Modules

Domain modules define your data models and business logic.

### Basic Type Definition

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

- Check out the [Sample Projects](../samples/) for real-world examples
- Read the [Getting Started Guide](./GETTING_STARTED.md)
- Explore [Advanced Features](./ROADMAP.md)
- Join the community on [GitHub](https://github.com/upendra-manike/kora)

---

**Happy coding with Kora! 🟢**

