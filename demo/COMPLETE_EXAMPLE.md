# Complete Stratum Example: Blog Application

This is a complete, working example of a blog application built with Stratum.

## Project Structure

```
blog/
├── src/
│   ├── domain/
│   │   └── post.stratum          # Domain types
│   ├── api/
│   │   ├── get-post.stratum      # Get single post
│   │   ├── create-post.stratum   # Create new post
│   │   └── list-posts.stratum    # List all posts
│   └── ui/
│       ├── post-list.stratum     # Post list page
│       ├── post-detail.stratum   # Post detail page
│       └── create-post.stratum   # Create post page
└── dist/                       # Compiled output
```

## Step 1: Domain Types

**File: `src/domain/post.stratum`**

```stratum
module domain Post {
  type Post {
    id: UUID
    title: String
    content: String
    author: Author
    createdAt: Date
    published: Boolean
  }

  type Author {
    id: UUID
    name: String
    email: Email
    bio: String?
  }
}
```

**What it compiles to:**

```typescript
export interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: Date;
  published: boolean;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string | null | undefined;
}
```

## Step 2: API Endpoints

### Get Post API

**File: `src/api/get-post.stratum`**

```stratum
api getPost {
  input {
    id: UUID
  }

  output Post

  handler {
    return PostRepo.find(id)
  }
}
```

**What it compiles to:**

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

### Create Post API

**File: `src/api/create-post.stratum`**

```stratum
api createPost {
  input {
    title: String
    content: String
    authorId: UUID
  }

  output Post

  handler {
    let post = {
      id: UUID.generate(),
      title: title,
      content: content,
      author: AuthorRepo.find(authorId),
      createdAt: Date.now(),
      published: false
    }
    return PostRepo.save(post)
  }
}
```

## Step 3: UI Pages

### Post List Page

**File: `src/ui/post-list.stratum`**

```stratum
page PostList {
  load() -> Post[]

  view(posts: Post[]) {
    <div className="post-list">
      <h1>Blog Posts</h1>
      {for post in posts {
        <div key={post.id} className="post-card">
          <h2>{post.title}</h2>
          <p>By {post.author.name}</p>
          <a href={"/posts/" + post.id}>Read more</a>
        </div>
      }}
    </div>
  }
}
```

**What it compiles to:**

```typescript
import React from 'react';

export async function loadPostList(): Promise<Post[]> {
  // Auto-generated: calls listPosts API
  const response = await fetch('/api/listPosts');
  return response.json();
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="post-list">
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <h2>{post.title}</h2>
          <p>By {post.author.name}</p>
          <a href={`/posts/${post.id}`}>Read more</a>
        </div>
      ))}
    </div>
  );
}
```

### Post Detail Page

**File: `src/ui/post-detail.stratum`**

```stratum
page PostDetail {
  load(id: UUID) -> Post

  view(post: Post) {
    <div className="post-detail">
      <h1>{post.title}</h1>
      <div className="meta">
        <span>By {post.author.name}</span>
        <span>{post.createdAt}</span>
      </div>
      <div className="content">
        {post.content}
      </div>
    </div>
  }
}
```

## Compiling the Project

```bash
# Check all files
stratum check src/domain/post.stratum
stratum check src/api/get-post.stratum
stratum check src/ui/post-list.stratum

# Compile entire project
stratum build

# Output goes to dist/
```

## Using in Your App

### Next.js Example

```typescript
// app/posts/page.tsx
import { PostList, loadPostList } from '@/dist/ui/post-list';

export default async function PostsPage() {
  const posts = await loadPostList();
  return <PostList posts={posts} />;
}
```

### React Example

```typescript
// components/PostList.tsx
import { PostList, loadPostList } from '@/dist/ui/post-list';
import { useEffect, useState } from 'react';

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadPostList().then(setPosts);
  }, []);

  return <PostList posts={posts} />;
}
```

## Key Benefits Demonstrated

1. **No Boilerplate**
   - No manual fetch calls
   - No API client generation
   - No type duplication

2. **Type Safety**
   - Types shared across domain/API/UI
   - Compile-time guarantees
   - No runtime type errors

3. **Architectural Boundaries**
   - Domain can't import UI
   - UI can't directly access domain
   - Enforced by compiler

4. **Automatic Connections**
   - UI automatically calls APIs
   - Types automatically match
   - Routes automatically generated

## Running the Complete Example

```bash
# 1. Create project
stratum new blog-demo
cd blog-demo

# 2. Copy files from demo/blog/
cp -r ../demo/blog/src/* src/

# 3. Compile
stratum build

# 4. Use in your Next.js/React app
# Import from dist/
```

## What You Get

- ✅ Type-safe API calls
- ✅ React components
- ✅ TypeScript interfaces
- ✅ API route handlers
- ✅ Zero glue code
- ✅ Architectural correctness

---

**This is the power of Stratum - one language, three concerns, zero glue code!**


