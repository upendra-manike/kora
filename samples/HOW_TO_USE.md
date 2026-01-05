# How to Create Projects with Stratum

A complete guide to building real applications with the Stratum language.

## Installation

```bash
npm install -g @stratum-lang/stratum
```

## Creating a New Project

### Step 1: Initialize Project

```bash
stratum new my-app
cd my-app
```

This creates:
```
my-app/
├── src/
│   ├── domain/      # Domain types
│   ├── api/         # API endpoints
│   └── ui/          # UI pages
└── dist/            # Compiled output
```

### Step 2: Write Stratum Code

#### Define Domain Types

Create `src/domain/user.stratum`:

```stratum
module domain User {
  type User {
    id: UUID
    name: String
    email: Email
  }
}
```

#### Create API Endpoints

Create `src/api/get-user.stratum`:

```stratum
api getUser {
  input { id: UUID }
  output User
  handler {
    return UserRepo.find(id)
  }
}
```

#### Build UI Pages

Create `src/ui/user-profile.stratum`:

```stratum
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

### Step 3: Compile

```bash
# Check for errors
stratum check src/domain/user.stratum

# Compile entire project
stratum build

# Output goes to dist/
```

### Step 4: Use Generated Code

Import in your Next.js/React app:

```typescript
// app/users/[id]/page.tsx
import { UserProfile, loadUserProfile } from '@/dist/ui/user-profile';

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await loadUserProfile(params.id);
  return <UserProfile user={user} />;
}
```

## Real-World Workflow

### 1. Start with Domain

Always define your data models first:

```stratum
module domain Product {
  type Product {
    id: UUID
    name: String
    price: Number
  }
}
```

### 2. Create APIs

Build endpoints that use your domain:

```stratum
api getProduct {
  input { id: UUID }
  output Product
  handler {
    return ProductRepo.find(id)
  }
}
```

### 3. Build UI

Create pages that connect to APIs:

```stratum
page ProductPage {
  load(id: UUID) -> Product
  view(product: Product) {
    <h1>{product.name}</h1>
    <p>${product.price}</p>
  }
}
```

### 4. Compile and Deploy

```bash
stratum build
# Use dist/ files in your app
```

## Sample Projects

### Todo App (Simple)

Perfect for beginners:
- Basic CRUD operations
- Simple state management
- Form handling

**Location**: `samples/todo-app/`

### E-commerce (Intermediate)

Real-world complexity:
- Multiple domain models
- Complex relationships
- Shopping cart logic

**Location**: `samples/ecommerce/`

### Blog System (Advanced)

Full-featured application:
- Content management
- Comments and replies
- User roles

**Location**: `samples/blog-system/`

## Best Practices

### 1. Domain First

Always start with domain types. They're the foundation.

### 2. Keep APIs Simple

APIs should be thin - delegate to repositories.

### 3. UI Connects Automatically

Don't write fetch calls - Stratum handles it.

### 4. Use Types Everywhere

Leverage Stratum's type system for safety.

### 5. Compile Often

Run `stratum check` frequently to catch errors early.

## Common Patterns

### CRUD Operations

```stratum
// Create
api createItem { input {...} output Item handler {...} }

// Read
api getItem { input { id: UUID } output Item handler {...} }

// Update
api updateItem { input { id: UUID, ... } output Item handler {...} }

// Delete
api deleteItem { input { id: UUID } output Boolean handler {...} }
```

### Lists with Filters

```stratum
api listItems {
  input {
    category: String?
    limit: Number?
    offset: Number?
  }
  output Item[]
  handler {
    return ItemRepo.findByFilters(category, limit, offset)
  }
}
```

### Nested Data

```stratum
type Post {
  id: UUID
  author: User      # Reference
  comments: Comment[] # Array
}
```

## Development Workflow

1. **Write Stratum code** in `src/`
2. **Check syntax**: `stratum check`
3. **Compile**: `stratum build`
4. **Import generated code** in your app
5. **Test and iterate**

## Tips

- ✅ Start simple, add complexity gradually
- ✅ Use sample projects as reference
- ✅ Compile often to catch errors
- ✅ Leverage type safety
- ✅ Let the compiler handle connections

## Next Steps

1. Try the **Todo App** sample
2. Study the **E-commerce** example
3. Build your own project
4. Share your creations!

---

**Happy building with Stratum!** 🚀


