# CSS Support for Kora

Design and implementation plan for CSS styling in Kora applications.

## Overview

Kora will support CSS in multiple ways:
1. **Inline Styles** - Direct style attributes
2. **Style Modules** - Scoped CSS modules
3. **Global Styles** - Application-wide styles
4. **CSS-in-Kora** - CSS written in Kora syntax

## Design Goals

- ✅ Type-safe styling
- ✅ Scoped styles (no conflicts)
- ✅ Component-level styles
- ✅ Responsive design support
- ✅ Theme support
- ✅ Compile-time optimization

## Approach 1: Style Modules (Recommended)

### Concept

Each UI component can have its own style module, similar to CSS Modules.

### Syntax

```kora
// ui/product-card.kora
page ProductCard {
  styles {
    .card {
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .title {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
    }
    
    .price {
      font-size: 1.25rem;
      color: var(--text-color);
    }
    
    @media (max-width: 768px) {
      .card {
        padding: 0.5rem;
      }
    }
  }
  
  view(product: Product) {
    <div className="card">
      <h2 className="title">{product.name}</h2>
      <p className="price">${product.price}</p>
    </div>
  }
}
```

### Generated Output

```css
/* Generated: dist/ui/product-card.module.css */
.product-card_card__abc123 {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-card_title__abc123 {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.product-card_price__abc123 {
  font-size: 1.25rem;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .product-card_card__abc123 {
    padding: 0.5rem;
  }
}
```

```typescript
// Generated: dist/ui/product-card.tsx
import styles from './product-card.module.css';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{product.name}</h2>
      <p className={styles.price}>${product.price}</p>
    </div>
  );
}
```

## Approach 2: Inline Styles with Type Safety

### Syntax

```kora
page ProductCard {
  view(product: Product) {
    <div style={{
      padding: "1rem",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    }}>
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "var(--primary-color)"
      }}>
        {product.name}
      </h2>
    </div>
  }
}
```

### Generated Output

```typescript
export function ProductCard({ product }: { product: Product }) {
  return (
    <div style={{
      padding: "1rem",
      borderRadius: "0.5rem",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    }}>
      <h2 style={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "var(--primary-color)"
      }}>
        {product.name}
      </h2>
    </div>
  );
}
```

## Approach 3: Global Styles

### Syntax

```kora
// styles/global.kora
styles global {
  :root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --text-color: #212529;
    --bg-color: #ffffff;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    margin: 0;
    padding: 0;
    color: var(--text-color);
    background-color: var(--bg-color);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .btn-primary {
    background-color: var(--primary-color);
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
}
```

### Generated Output

```css
/* dist/styles/global.css */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --text-color: #212529;
  --bg-color: #ffffff;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin: 0;
  padding: 0;
  color: var(--text-color);
  background-color: var(--bg-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}
```

## Approach 4: CSS-in-Kora (Advanced)

### Syntax

```kora
// styles/theme.kora
module styles Theme {
  type Color {
    primary: String
    secondary: String
    text: String
    background: String
  }
  
  type Spacing {
    xs: String
    sm: String
    md: String
    lg: String
    xl: String
  }
  
  constant theme = {
    colors: {
      primary: "#007bff",
      secondary: "#6c757d",
      text: "#212529",
      background: "#ffffff"
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "2rem",
      xl: "4rem"
    }
  }
}

// Usage in component
page ProductCard {
  view(product: Product) {
    <div style={{
      padding: Theme.theme.spacing.md,
      backgroundColor: Theme.theme.colors.background
    }}>
      <h2 style={{
        color: Theme.theme.colors.primary
      }}>
        {product.name}
      </h2>
    </div>
  }
}
```

## Implementation Plan

### Phase 1: Basic CSS Support (v0.2.0)

- [ ] Style blocks in page components
- [ ] CSS module generation
- [ ] Scoped class names
- [ ] Basic CSS properties

### Phase 2: Advanced Features (v0.3.0)

- [ ] Global styles
- [ ] CSS variables
- [ ] Media queries
- [ ] Pseudo-classes (:hover, :focus, etc.)

### Phase 3: Type-Safe Styles (v0.4.0)

- [ ] Type-safe CSS properties
- [ ] Theme system
- [ ] Style composition
- [ ] CSS-in-Kora syntax

### Phase 4: Optimization (v0.5.0)

- [ ] CSS minification
- [ ] Dead code elimination
- [ ] Critical CSS extraction
- [ ] CSS bundling

## Example: Complete Component with Styles

```kora
page TodoItem {
  styles {
    .todo-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-bottom: 1px solid var(--border-color);
      transition: background-color 0.2s;
    }
    
    .todo-item:hover {
      background-color: var(--hover-bg);
    }
    
    .todo-item.completed {
      opacity: 0.6;
      text-decoration: line-through;
    }
    
    .checkbox {
      margin-right: 0.75rem;
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }
    
    .title {
      flex: 1;
      font-size: 1rem;
      color: var(--text-color);
    }
    
    .delete-btn {
      padding: 0.25rem 0.5rem;
      background-color: var(--danger-color);
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    
    .delete-btn:hover {
      background-color: var(--danger-hover);
    }
    
    @media (max-width: 768px) {
      .todo-item {
        padding: 0.5rem;
      }
      
      .title {
        font-size: 0.875rem;
      }
    }
  }
  
  view(todo: Todo) {
    <div className={todo.completed ? "todo-item completed" : "todo-item"}>
      <input 
        type="checkbox" 
        className="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span className="title">{todo.title}</span>
      <button 
        className="delete-btn"
        onClick={() => deleteTodo(todo.id)}
      >
        Delete
      </button>
    </div>
  }
}
```

## Benefits

### 1. Scoped Styles
- No class name conflicts
- Component-level isolation
- Automatic prefixing

### 2. Type Safety
- CSS properties validated
- Theme values type-checked
- Compile-time errors

### 3. Performance
- CSS minification
- Dead code elimination
- Critical CSS extraction

### 4. Developer Experience
- Co-located styles
- Easy to maintain
- Clear component boundaries

## File Structure

```
my-app/
├── src/
│   ├── domain/
│   ├── api/
│   ├── ui/
│   │   ├── product-card.kora    # Component with styles
│   │   └── todo-item.kora       # Component with styles
│   └── styles/
│       └── global.kora          # Global styles
└── dist/
    ├── ui/
    │   ├── product-card.tsx
    │   ├── product-card.module.css
    │   ├── todo-item.tsx
    │   └── todo-item.module.css
    └── styles/
        └── global.css
```

## Migration Path

### Current (No CSS Support)
```kora
page ProductCard {
  view(product: Product) {
    <div className="product-card">
      <h2>{product.name}</h2>
    </div>
  }
}
```

### With CSS Support
```kora
page ProductCard {
  styles {
    .product-card {
      padding: 1rem;
      border-radius: 0.5rem;
    }
  }
  
  view(product: Product) {
    <div className="product-card">
      <h2>{product.name}</h2>
    </div>
  }
}
```

## Next Steps

1. **Design CSS syntax** - Finalize syntax
2. **Implement parser** - Parse style blocks
3. **Generate CSS** - Output CSS modules
4. **Add type checking** - Validate CSS properties
5. **Optimize output** - Minify and optimize

---

**CSS support will make Kora a complete full-stack solution!**

