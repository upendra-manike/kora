# Kora Language Walkthrough

A step-by-step walkthrough showing how Kora works from code to running application.

## Overview

This walkthrough demonstrates building a blog application with:
- **3 domain types** (Post, Author, Comment)
- **3 API endpoints** (get, create, list)
- **3 UI pages** (list, detail, create)

## The Kora Philosophy

> **One language, three concerns, zero glue code.**

Traditional stack requires:
- TypeScript interfaces (duplicated)
- API route handlers
- Fetch calls in components
- Type definitions
- Validation logic
- Error handling

**Kora does all of this automatically.**

## Step 1: Define Domain (30 seconds)

**File: `domain/post.kora`**

```kora
module domain Post {
  type Post {
    id: UUID
    title: String
    content: String
    author: Author
  }
}
```

**What happens:**
- ✅ Compiler generates TypeScript interface
- ✅ Type is available everywhere
- ✅ No manual type definition needed

## Step 2: Create API (1 minute)

**File: `api/get-post.kora`**

```kora
api getPost {
  input { id: UUID }
  output Post
  handler {
    return PostRepo.find(id)
  }
}
```

**What happens:**
- ✅ Compiler generates input/output types
- ✅ Creates handler function
- ✅ Generates API route (Next.js/Express)
- ✅ Type-safe from input to output

## Step 3: Build UI (1 minute)

**File: `ui/post-detail.kora`**

```kora
page PostDetail {
  load(id: UUID) -> Post
  view(post: Post) {
    <h1>{post.title}</h1>
    <p>{post.content}</p>
  }
}
```

**What happens:**
- ✅ Compiler generates React component
- ✅ Creates load function (calls API automatically)
- ✅ Connects UI to API
- ✅ Ensures types match

## The Magic: Zero Glue Code

### Traditional Approach

```typescript
// 1. Define type (domain)
interface Post { id: string; title: string; }

// 2. Create API route
export async function GET(req: Request) {
  const { id } = await req.json();
  const post = await PostRepo.find(id);
  return Response.json(post);
}

// 3. Create API client
export async function getPost(id: string): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`);
  return res.json();
}

// 4. Use in component
export function PostDetail({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  useEffect(() => {
    getPost(id).then(setPost);
  }, [id]);
  return <h1>{post?.title}</h1>;
}
```

**Total: ~40 lines, 4 files, manual connections**

### Kora Approach

```kora
// Domain
type Post { id: UUID; title: String; }

// API
api getPost { input { id: UUID }; output Post; handler { ... } }

// UI
page PostDetail {
  load(id: UUID) -> Post
  view(post: Post) { <h1>{post.title}</h1> }
}
```

**Total: ~10 lines, 3 files, automatic connections**

## Compilation Output

### Domain → TypeScript

```typescript
export interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
}
```

### API → Handler + Types

```typescript
export interface getPostInput {
  id: string;
}

export type getPostOutput = Post;

export async function getPostHandler(
  input: getPostInput
): Promise<getPostOutput | undefined> {
  return PostRepo.find(input.id);
}
```

### Page → React Component

```typescript
export async function loadPostDetail(
  id: string
): Promise<Post> {
  // Auto-generated API call
  const response = await fetch('/api/getPost', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
  return response.json();
}

export function PostDetail({ post }: { post: Post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

## Try It Yourself

### 1. Install Kora

```bash
npm install -g @kora-lang/kora
```

### 2. Create Project

```bash
kora new my-blog
cd my-blog
```

### 3. Write Kora Code

Copy files from `demo/blog/` to your `src/` directory.

### 4. Compile

```bash
kora build
```

### 5. Use Generated Code

Import from `dist/` in your Next.js/React app.

## Key Takeaways

1. **Domain First** - Define your data models
2. **API Second** - Create endpoints with types
3. **UI Last** - Build pages that use APIs
4. **Compiler Handles the Rest** - Connections, types, routes

## Benefits

✅ **75% less code** - No boilerplate  
✅ **100% type safe** - Compile-time guarantees  
✅ **Zero drift** - Types always match  
✅ **Architectural correctness** - Enforced boundaries  

## Next Steps

- Explore `demo/blog/` for complete example
- Read [COMPLETE_EXAMPLE.md](./COMPLETE_EXAMPLE.md)
- Try [QUICK_START.md](./QUICK_START.md)
- Check [README.md](./README.md)

---

**This is Kora - making full-stack development simple and correct by default.**

