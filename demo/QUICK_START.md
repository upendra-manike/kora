# Kora Quick Start Demo

Get started with Kora in 5 minutes!

## Installation

```bash
npm install -g @kora-lang/kora
```

## Create Your First Kora App

```bash
kora new my-blog
cd my-blog
```

This creates a project with example files.

## The Kora Workflow

### 1. Define Your Domain

Create `src/domain/post.kora`:

```kora
module domain Post {
  type Post {
    id: UUID
    title: String
    content: String
  }
}
```

### 2. Create an API

Create `src/api/get-post.kora`:

```kora
api getPost {
  input { id: UUID }
  output Post

  handler {
    return PostRepo.find(id)
  }
}
```

### 3. Build a Page

Create `src/ui/post-page.kora`:

```kora
page PostPage {
  load(id: UUID) -> Post

  view(post: Post) {
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  }
}
```

## Compile and Use

```bash
# Check your code
kora check src/domain/post.kora

# Compile to TypeScript
kora build

# Start development
kora dev
```

## What Happens

The Kora compiler automatically:

1. ✅ Generates TypeScript interfaces from domain types
2. ✅ Creates API handler functions
3. ✅ Generates React components from pages
4. ✅ Connects UI to APIs automatically
5. ✅ Ensures type safety across all layers

## Example Output

### Domain → TypeScript

```typescript
export interface Post {
  id: string;
  title: string;
  content: string;
}
```

### API → Handler

```typescript
export async function getPostHandler(
  input: { id: string }
): Promise<Post | undefined> {
  return PostRepo.find(id);
}
```

### Page → React Component

```typescript
export async function loadPostPage(id: string): Promise<Post> {
  // Auto-generated API call
}

export function PostPage({ post }: { post: Post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

## Key Concepts

### 1. Domain Layer
- Defines your data models
- Pure types, no logic
- Shared across the entire app

### 2. API Layer
- Defines endpoints
- Input/output types
- Handler implementation

### 3. UI Layer
- Pages with data loading
- React components
- Automatically connected to APIs

## Try It Now

1. **Create a new project**:
   ```bash
   kora new my-app
   ```

2. **Edit the example files** in `src/`

3. **Compile**:
   ```bash
   kora build
   ```

4. **Check the output** in `dist/`

## Next Steps

- See `demo/blog/` for a complete example
- Read the [full documentation](../README.md)
- Check [CLI reference](../docs/CLI.md)

---

**That's it! You're building with Kora!** 🚀

