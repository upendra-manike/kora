# 🟢 Kora Programming Language

> **Kora is a full-stack programming language that compiles to JavaScript and enforces architectural boundaries by design.**

---

## Why Kora Exists

Modern full-stack development is **architecturally chaotic**:

- **UI and backend drift apart** — TypeScript interfaces get out of sync, causing runtime errors
- **No enforced boundaries** — Domain logic leaks into UI, API logic into domain
- **Boilerplate everywhere** — Fetch calls, DTOs, validation, type definitions duplicated across layers
- **Framework lock-in** — Your code becomes inseparable from your framework
- **Configuration complexity** — Too many files, too many decisions, too much setup

**Kora solves this at the language level.**

---

## What Kora Solves

| Problem | Kora's Solution |
|---------|----------------|
| **UI & backend type drift** | Shared language + compile-time contracts |
| **Runtime type errors** | Compile-time guarantees, no runtime surprises |
| **Framework lock-in** | Outputs standard TypeScript/JavaScript — eject anytime |
| **Spaghetti architecture** | Enforced module boundaries — illegal imports are compiler errors |
| **Boilerplate hell** | One language, three concerns (Domain/API/UI), zero glue code |
| **Over-configuration** | Convention over configuration — sensible defaults |

---

## What Kora Does NOT Solve

Kora is **not**:

- ❌ A replacement for JavaScript/TypeScript — it compiles to them
- ❌ A React replacement — it generates React components
- ❌ A framework — it's a language that works with existing frameworks
- ❌ A runtime — it runs on Node.js, uses existing runtimes
- ❌ A database ORM — it focuses on architectural boundaries
- ❌ A build tool — it uses standard tooling (esbuild, swc)

**Kora is a language that makes architectural correctness the default.**

---

## The One-Line Philosophy

> **"Kora makes architectural correctness the default."**

You don't need to remember conventions. You can't accidentally break boundaries. The compiler enforces what good architecture should be.

---

## How It Works

```
┌──────────────────────────┐
│       Kora Code          │
│  (UI + Backend + Domain) │
└───────────┬──────────────┘
            │
        Kora Compiler
            │
   ┌────────┴─────────┐
   │                  │
JavaScript / TS     Type Declarations
   │                  │
Node.js Runtime   React / Next / API
```

**Key Insight**: Kora does **not replace JavaScript** — it **controls how JavaScript is generated**.

You can:
- Debug the generated code
- Eject to pure TypeScript anytime
- Use existing tooling
- Integrate with existing codebases

---

## Language Concepts

### 1. Explicit Layers (Language-Level)

Kora files declare architectural intent:

```kora
module domain User {
  type User {
    id: UUID
    name: String
    email: Email
  }
}
```

```kora
module api GetUser {
  input { id: UUID }
  output User

  handler {
    return UserRepo.find(id)
  }
}
```

```kora
page UserProfile {
  load(id: UUID) -> User

  view(user: User) {
    <h1>{user.name}</h1>
    <p>{user.email}</p>
  }
}
```

**Illegal imports are compiler errors, not conventions.**

If a UI module tries to import a domain module directly, the compiler stops you. This is enforced at the language level.

### 2. UI + Backend Are First-Class

No more:
- Fetch boilerplate
- DTO duplication
- Swagger drift
- Manual API client generation

```kora
page Profile {
  load(userId: UserId) -> User
  view(user: User) {
    <ProfileCard user={user} />
  }
}
```

The compiler automatically:
- Generates the API route
- Generates the client function
- Connects UI to backend
- Ensures types match

### 3. Zero Glue Code

Traditional stack:
```typescript
// domain/user.ts
export interface User { ... }

// api/get-user.ts
export async function GET(req) { ... }

// ui/profile.tsx
export function Profile() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch('/api/get-user').then(...)
  }, []);
  // ...
}
```

Kora:
```kora
page Profile {
  load(userId: UserId) -> User
  view(user: User) {
    <ProfileCard user={user} />
  }
}
```

**One language, three concerns, zero glue code.**

---

## Example: Complete App

### Domain Layer

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

### API Layer

```kora
api getUser {
  input { id: UUID }
  output User

  handler {
    return UserRepo.find(id)
  }
}
```

### UI Layer

```kora
page UserProfile {
  load(id: UUID) -> User

  view(user: User) {
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  }
}
```

That's it. The compiler handles:
- Type safety across layers
- API route generation
- Client code generation
- React component generation

---

## Installation

```bash
npm install -g kora
```

Or use without installing:

```bash
npx kora new my-app
```

---

## Quick Start

```bash
# Create a new Kora app
kora new my-app

# Navigate to project
cd my-app

# Start development server
kora dev
```

**From zero to running app in under 2 minutes.**

---

## CLI Commands

```bash
kora new <name>        # Create new Kora project
kora dev               # Start development server with hot reload
kora build             # Build project to TypeScript/JavaScript
kora check             # Check code for errors (architecture + types)
kora compile <file>    # Compile a single Kora file
```

---

## Compatibility

Kora outputs **standard TypeScript/JavaScript**, so it works with:

- ✅ **React** — Generates React components
- ✅ **Next.js** — Full Next.js integration
- ✅ **Node.js** — Standard Node.js APIs
- ✅ **Existing tooling** — ESLint, Prettier, etc.
- ✅ **Existing codebases** — Gradual adoption

---

## Roadmap

### Phase 1: Language Core (Current)
- [x] Grammar definition
- [x] Language keywords
- [ ] Parser implementation
- [ ] Type system
- [ ] Compiler to TypeScript

### Phase 2: Backend
- [ ] API route generation
- [ ] Input validation
- [ ] Error handling
- [ ] Node.js runtime integration

### Phase 3: UI
- [ ] JSX compilation
- [ ] React component generation
- [ ] Next.js adapter
- [ ] Hot reload

### Phase 4: Ecosystem
- [ ] Package manager
- [ ] IDE support (VS Code extension)
- [ ] Documentation site
- [ ] Plugin system

---

## Contributing

Kora is in early development. We welcome contributions!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

Apache 2.0 — See [LICENSE](./LICENSE) file.

---

## Status

**Kora is currently in Phase 1 (Language Core).**

This means:
- ✅ Grammar is defined
- ✅ Language design is locked
- 🚧 Parser is in progress
- 🚧 Compiler is in progress

**Not ready for production use yet.**

---

## Why "Kora"?

Kora means "boundary" or "edge" — fitting for a language that enforces architectural boundaries.

---

## Questions?

- **GitHub Discussions** — Ask questions, share ideas
- **GitHub Issues** — Report bugs, request features
- **RFCs** — Language design proposals (coming soon)

---

## Philosophy

> **Frameworks help teams move fast.  
> Languages help teams move correctly.**

Kora is a **language**, not a framework. That means:
- It compiles to standard code
- It enforces correctness at compile time
- It ages well (like Go or Rust, not like framework trends)
- It's a long-term investment

---

**Built with architectural discipline. Designed for the long term.**
