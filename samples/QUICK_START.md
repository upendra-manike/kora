# Quick Start: Create Projects with Stratum

Get started building real applications with Stratum in minutes!

## Installation

```bash
npm install -g @stratum-lang/stratum
```

## Create Your First Project

### Step 1: Initialize

```bash
stratum new my-todo-app
cd my-todo-app
```

### Step 2: Copy Sample Code

```bash
# Copy Todo App sample
cp -r ../samples/todo-app/src/* src/
```

Or manually copy files:
- `samples/todo-app/domain/todo.stratum` → `src/domain/`
- `samples/todo-app/api/*.stratum` → `src/api/`
- `samples/todo-app/ui/*.stratum` → `src/ui/`

### Step 3: Compile

```bash
# Check for errors
stratum check src/domain/todo.stratum

# Build entire project
stratum build
```

### Step 4: Use Generated Code

The compiled TypeScript is in `dist/`. Import in your app:

```typescript
// Next.js example
import { TodoList, loadTodoList } from '@/dist/ui/todo-list';

export default async function TodosPage() {
  const todos = await loadTodoList();
  return <TodoList todos={todos} />;
}
```

## Available Sample Projects

### 1. Todo App (Beginner) ⭐ Start Here

**Location**: `samples/todo-app/`

**Features**:
- Create, update, delete todos
- Mark as complete
- Filter by status

**Files**:
- 1 domain file
- 4 API files
- 2 UI files

**Perfect for**: Learning Stratum basics

### 2. E-commerce (Intermediate)

**Location**: `samples/ecommerce/`

**Features**:
- Product catalog
- Shopping cart
- Order management
- Search and filters

**Files**:
- 3 domain files
- 4 API files
- 3 UI files

**Perfect for**: Understanding complex relationships

### 3. Blog System (Advanced)

**Location**: `samples/blog-system/`

**Features**:
- Posts and comments
- User management
- Categories and tags
- Content publishing

**Files**:
- 2 domain files
- 3 API files
- 2 UI files

**Perfect for**: Real-world application patterns

## Real-Time Development Workflow

### 1. Create Project

```bash
stratum new my-project
cd my-project
```

### 2. Write Stratum Code

Edit files in `src/`:
- Domain types in `src/domain/`
- APIs in `src/api/`
- UI pages in `src/ui/`

### 3. Compile Continuously

```bash
# Watch mode (auto-compile on changes)
stratum dev

# Or manual compile
stratum build
```

### 4. Use in Your App

Import generated code:

```typescript
// Import types
import type { Todo } from '@/dist/domain/todo';

// Import API handlers
import { createTodoHandler } from '@/dist/api/create-todo';

// Import UI components
import { TodoList } from '@/dist/ui/todo-list';
```

## Example: Building a Todo App

### 1. Define Domain

```stratum
// src/domain/todo.stratum
module domain Todo {
  type Todo {
    id: UUID
    title: String
    completed: Boolean
  }
}
```

### 2. Create API

```stratum
// src/api/create-todo.stratum
api createTodo {
  input { title: String }
  output Todo
  handler {
    return TodoRepo.create(title)
  }
}
```

### 3. Build UI

```stratum
// src/ui/todo-list.stratum
page TodoList {
  load() -> Todo[]
  view(todos: Todo[]) {
    <div>
      {for todo in todos {
        <div key={todo.id}>
          <input type="checkbox" checked={todo.completed} />
          <span>{todo.title}</span>
        </div>
      }}
    </div>
  }
}
```

### 4. Compile

```bash
stratum build
```

### 5. Use

```typescript
import { TodoList, loadTodoList } from '@/dist/ui/todo-list';

export default async function Page() {
  const todos = await loadTodoList();
  return <TodoList todos={todos} />;
}
```

## Tips for Real-Time Development

1. **Use `stratum dev`** - Auto-compiles on file changes
2. **Check often** - Run `stratum check` to catch errors early
3. **Start simple** - Begin with Todo App, then move to complex projects
4. **Study samples** - Use sample projects as templates
5. **Iterate quickly** - Compile → Test → Refine

## Next Steps

1. ✅ Try the **Todo App** sample
2. ✅ Study the **E-commerce** example
3. ✅ Build your own project
4. ✅ Share your work!

---

**You're ready to build with Stratum! Start with the Todo App sample.** 🚀


