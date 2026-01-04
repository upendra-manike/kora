# Kora Architecture Patterns: Monolithic vs Microservices

Complete guide to how Kora supports different deployment architectures.

---

## Quick Answer

**Kora is architecture-agnostic** — it can be used for both **monolithic** and **microservices** architectures. The language enforces **code-level boundaries** (Domain/API/UI layers), but **deployment architecture** is your choice.

---

## What Kora Is (And Isn't)

### ✅ What Kora Is
- **A programming language** that compiles to TypeScript/JavaScript
- **Architectural boundary enforcer** at the code level
- **Full-stack language** (Domain + API + UI in one language)
- **Framework-agnostic** (outputs standard code)

### ❌ What Kora Is NOT
- **Not a deployment framework** — doesn't dictate how you deploy
- **Not a service mesh** — doesn't manage service communication
- **Not a container orchestrator** — doesn't handle containers/Kubernetes
- **Not a runtime** — runs on Node.js, uses existing runtimes

**Key Insight**: Kora controls **how code is structured**, not **how it's deployed**.

---

## Monolithic Architecture

### What It Means
All code runs in a **single process/deployment**:
- One database
- One API server
- One frontend
- Shared memory/state

### How Kora Supports It

#### ✅ Current Support: Excellent

Kora is **perfect for monolithic applications**:

```kora
// All in one codebase
domain/
  - user.kora
  - product.kora
  - order.kora

api/
  - auth.kora
  - products.kora
  - orders.kora

ui/
  - login.kora
  - product-list.kora
  - checkout.kora
```

**Compiles to:**
```typescript
// Single TypeScript project
dist/
  - domain/
  - api/
  - ui/
```

**Deploy as:**
- Single Node.js server (Next.js, Express, etc.)
- Single database
- Single frontend bundle

### Benefits with Kora
- ✅ **Type safety across all layers** — no API drift
- ✅ **Shared domain models** — one source of truth
- ✅ **Fast development** — no service boundaries to manage
- ✅ **Simple deployment** — one process, one database
- ✅ **Easy debugging** — everything in one place

### Example: Monolithic E-commerce

```kora
// domain/product.kora
module domain Product {
  type Product {
    id: UUID
    name: String
    price: Decimal
  }
}

// api/get-product.kora
api getProduct {
  input { id: UUID }
  output Product
  handler {
    return ProductRepo.findById(id)
  }
}

// ui/product-page.kora
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

**Deployment:**
```bash
# Single Next.js app
kora build
next build
next start
```

---

## Microservices Architecture

### What It Means
Code is split into **multiple independent services**:
- Each service has its own database
- Services communicate via APIs
- Independent deployment
- Service boundaries

### How Kora Supports It

#### ⚠️ Current Support: Partial

Kora **can be used** for microservices, but requires **manual service boundaries**:

### Approach 1: Separate Kora Projects (Recommended)

**Each service is a separate Kora project:**

```
services/
  ├── user-service/
  │   ├── domain/
  │   │   └── user.kora
  │   └── api/
  │       └── get-user.kora
  │
  ├── product-service/
  │   ├── domain/
  │   │   └── product.kora
  │   └── api/
  │       └── get-product.kora
  │
  └── order-service/
      ├── domain/
      │   └── order.kora
      └── api/
          └── create-order.kora
```

**Each service:**
- Has its own `kora build`
- Generates its own TypeScript
- Deploys independently
- Has its own database

**Service Communication:**
```typescript
// order-service calls user-service
const user = await fetch('http://user-service/api/user/123')
  .then(r => r.json());
```

### Approach 2: Shared Domain Models

**Share domain definitions across services:**

```kora
// shared-domain/user.kora (published as npm package)
module domain User {
  type User {
    id: UUID
    name: String
  }
}
```

**Each service imports shared types:**
```kora
// user-service/api/get-user.kora
import User from '@company/shared-domain/user.kora'

api getUser {
  input { id: UUID }
  output User
  handler { ... }
}
```

### Benefits with Kora
- ✅ **Type-safe service boundaries** — shared types prevent API drift
- ✅ **Independent compilation** — each service builds separately
- ✅ **Clear domain boundaries** — Domain modules enforce separation
- ✅ **API contracts** — generated TypeScript types as contracts

### Limitations (Current)
- ❌ **No automatic service discovery** — manual service URLs
- ❌ **No service mesh integration** — manual API calls
- ❌ **No distributed tracing** — needs manual instrumentation
- ❌ **No service registry** — manual configuration

### Example: Microservices E-commerce

```kora
// user-service/domain/user.kora
module domain User {
  type User {
    id: UUID
    name: String
    email: Email
  }
}

// product-service/domain/product.kora
module domain Product {
  type Product {
    id: UUID
    name: String
    price: Decimal
  }
}

// order-service/domain/order.kora
module domain Order {
  type Order {
    id: UUID
    userId: UUID  // Reference to user-service
    productId: UUID  // Reference to product-service
    quantity: Int
  }
}
```

**Deployment:**
```bash
# Deploy each service separately
cd user-service && kora build && docker build -t user-service .
cd product-service && kora build && docker build -t product-service .
cd order-service && kora build && docker build -t order-service .

# Run with Docker Compose or Kubernetes
docker-compose up
```

---

## Hybrid Architecture

### What It Means
Mix of monolithic and microservices:
- Core features in monolith
- Specialized features as services
- Gradual migration path

### How Kora Supports It

**Perfect for hybrid approaches:**

```
monolith/
  ├── domain/
  │   ├── user.kora
  │   └── product.kora
  ├── api/
  └── ui/

services/
  ├── payment-service/  # Separate service
  │   └── domain/
  │       └── payment.kora
  └── analytics-service/  # Separate service
      └── domain/
          └── analytics.kora
```

**Benefits:**
- Start monolithic, extract services later
- Keep related features together
- Isolate complex/scaling services

---

## Comparison Table

| Feature | Monolithic | Microservices |
|---------|-----------|---------------|
| **Kora Support** | ✅ Excellent | ⚠️ Partial |
| **Type Safety** | ✅ Full (shared types) | ⚠️ Partial (shared packages) |
| **Development Speed** | ✅ Fast | ⚠️ Slower (service boundaries) |
| **Deployment** | ✅ Simple (one process) | ⚠️ Complex (multiple services) |
| **Scalability** | ⚠️ Vertical scaling | ✅ Horizontal scaling |
| **Debugging** | ✅ Easy (one codebase) | ⚠️ Harder (distributed) |
| **Database** | ✅ Single database | ✅ Multiple databases |
| **API Contracts** | ✅ Compile-time | ⚠️ Runtime (needs tooling) |
| **Service Discovery** | N/A | ❌ Manual (future: auto) |
| **Distributed Tracing** | N/A | ❌ Manual (future: auto) |

---

## When to Use Each

### Use Monolithic When:
- ✅ **Small to medium team** (< 10 developers)
- ✅ **Simple domain** (clear boundaries)
- ✅ **Fast iteration** needed
- ✅ **Single database** is sufficient
- ✅ **Vertical scaling** works
- ✅ **MVP/startup** phase

### Use Microservices When:
- ✅ **Large team** (10+ developers)
- ✅ **Complex domain** (multiple bounded contexts)
- ✅ **Independent scaling** needed
- ✅ **Different databases** per service
- ✅ **Technology diversity** (different stacks)
- ✅ **Organizational boundaries** (different teams)

### Use Hybrid When:
- ✅ **Growing application** (migrating from monolith)
- ✅ **Some features need isolation**
- ✅ **Gradual migration** strategy
- ✅ **Mixed requirements** (some monolithic, some services)

---

## Future: Enhanced Microservices Support

### Planned Features (Roadmap)

#### 1. Service Discovery
```kora
// Automatic service discovery
api getProduct {
  @service("product-service")
  input { id: UUID }
  output Product
}
```

#### 2. Service Contracts
```kora
// Generate OpenAPI/Swagger from Kora
@contract("product-service")
api getProduct { ... }
```

#### 3. Distributed Tracing
```kora
// Automatic tracing
@trace
api createOrder { ... }
```

#### 4. Service Mesh Integration
```kora
// Service mesh support
@mesh("istio")
api getUser { ... }
```

#### 5. Multi-Service Compilation
```bash
# Compile multiple services with dependencies
kora build --services user-service,product-service,order-service
```

---

## Real-World Examples

### Example 1: Startup MVP (Monolithic)
```
my-app/
  ├── domain/
  ├── api/
  └── ui/
  
# Deploy as single Next.js app
```

### Example 2: Enterprise SaaS (Microservices)
```
services/
  ├── auth-service/
  ├── billing-service/
  ├── feature-service/
  └── analytics-service/
  
# Deploy each as separate Docker container
```

### Example 3: E-commerce Platform (Hybrid)
```
monolith/
  ├── catalog/
  ├── cart/
  └── checkout/

services/
  ├── payment-service/  # Isolated for PCI compliance
  └── shipping-service/  # External integration
```

---

## Best Practices

### For Monolithic Applications
1. ✅ **Keep domain modules focused** — clear boundaries even in monolith
2. ✅ **Use Kora's layer enforcement** — Domain → API → UI
3. ✅ **Plan for future extraction** — design services that could be extracted
4. ✅ **Single source of truth** — shared domain models

### For Microservices
1. ✅ **Separate Kora projects** — one per service
2. ✅ **Shared domain packages** — publish common types to npm
3. ✅ **API versioning** — use Kora's type system for contracts
4. ✅ **Independent deployment** — each service builds/deploys separately
5. ✅ **Service boundaries** — align with domain boundaries

### For Hybrid
1. ✅ **Start monolithic** — use Kora's boundaries
2. ✅ **Identify extraction candidates** — services that need isolation
3. ✅ **Gradual migration** — extract one service at a time
4. ✅ **Shared types** — use npm packages for common domain models

---

## Conclusion

**Kora is architecture-agnostic:**

- ✅ **Monolithic**: Excellent support, perfect for most applications
- ⚠️ **Microservices**: Partial support, works but needs manual setup
- ✅ **Hybrid**: Great for gradual migration

**Key Takeaway**: Kora enforces **code-level architecture** (Domain/API/UI layers), but **deployment architecture** (monolithic vs microservices) is your choice based on your needs.

**Recommendation**: 
- Start **monolithic** for MVPs and small teams
- Move to **microservices** when you need independent scaling/teams
- Use **hybrid** for gradual migration

---

**Kora helps you build well-structured code regardless of deployment architecture!**

