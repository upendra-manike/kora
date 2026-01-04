# Getting Started with Kora

Quick start guide for using the Kora programming language.

## Installation

```bash
npm install -g @kora-lang/kora
```

Verify installation:

```bash
kora --version
```

## Your First Kora Project

### Step 1: Create Project

```bash
kora new my-first-app
cd my-first-app
```

### Step 2: Write Domain

Create `src/domain/product.kora`:

```kora
module domain Product {
  type Product {
    id: UUID
    name: String
    price: Number
    inStock: Boolean
  }
}
```

### Step 3: Create API

Create `src/api/get-product.kora`:

```kora
api getProduct {
  input {
    id: UUID
  }

  output Product

  handler {
    return ProductRepo.find(id)
  }
}
```

### Step 4: Create UI

Create `src/ui/product-page.kora`:

```kora
page ProductPage {
  load(id: UUID) -> Product

  view(product: Product) {
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      {if product.inStock {
        <span>In Stock</span>
      }}
    </div>
  }
}
```

### Step 5: Compile

```bash
kora build
```

### Step 6: Use Generated Code

```typescript
// In your Next.js app
import { ProductPage, loadProductPage } from '@/dist/ui/product-page';

export default async function Page({ params }: { params: { id: string } }) {
  const product = await loadProductPage(params.id);
  return <ProductPage product={product} />;
}
```

## Using Sample Projects

### Option 1: Copy Sample

```bash
# Copy Todo App
cp -r samples/todo-app/src/* my-app/src/
kora build
```

### Option 2: Study Samples

```bash
# Read sample code
cat samples/todo-app/domain/todo.kora
cat samples/todo-app/api/create-todo.kora
```

## Common Commands

```bash
# Create new project
kora new <project-name>

# Compile project
kora build

# Check for errors
kora check <file.kora>

# Development mode (watch)
kora dev
```

## Project Structure

```
my-app/
├── src/
│   ├── domain/      # Data models
│   ├── api/         # API endpoints
│   └── ui/          # UI pages
├── dist/            # Generated TypeScript
└── package.json
```

## Next Steps

1. **Try Samples**: Start with `samples/todo-app/`
2. **Read Documentation**: Check `README.md` and `samples/HOW_TO_USE.md`
3. **Build Your App**: Create your own domain, APIs, and UI
4. **Add Database**: Try `samples/database-crud/`
5. **Add Security**: Try `samples/security-routing/`

## Troubleshooting

### Compiler Errors

```bash
# Check syntax
kora check src/domain/user.kora

# See detailed errors
kora build --verbose
```

### Missing Types

Make sure you've defined types in domain modules before using them.

### Import Errors

Currently, imports are handled automatically. Make sure files are in correct directories.

## Resources

- **Documentation**: `README.md`
- **Samples**: `samples/` directory
- **Website**: https://upendra-manike.github.io/kora/
- **GitHub**: https://github.com/upendra-manike/kora
- **npm**: https://www.npmjs.com/package/@kora-lang/kora

---

**Start building with Kora today!**

