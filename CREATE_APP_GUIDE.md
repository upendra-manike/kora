# How to Create a Kora App

## Quick Start

### 1. Create a New Project

```bash
# Using local build (if global install has issues)
node /path/to/kora/dist/cli.js new my-app

# Or if global install works
kora new my-app
```

This creates:
- `src/` - Kora source files
- `dist/` - Compiled TypeScript output
- `package.json` - Project configuration
- `README.md` - Project documentation
- `.gitignore` - Git ignore rules

### 2. Build the Project

```bash
cd my-app
kora build
```

This compiles all `.kora` files in `src/` to TypeScript in `dist/`.

### 3. Start Development Server

```bash
kora dev
```

This watches for changes and rebuilds automatically.

## Project Structure

```
my-app/
├── src/
│   ├── user.kora          # Domain module (data types)
│   ├── get-user.kora      # API module (backend handler)
│   └── user-profile.kora  # Page module (UI component)
├── dist/
│   ├── user.ts            # Compiled TypeScript
│   ├── get-user.ts
│   └── user-profile.ts
├── package.json
└── README.md
```

## Example Files Created

### Domain Module (`src/user.kora`)
```kora
module domain User {
  type User {
    id: UUID
    name: String
    email: Email
  }
}
```

### API Module (`src/get-user.kora`)
```kora
api getUser {
  input { id: UUID }
  output User

  handler {
    // TODO: Implement
  }
}
```

### Page Module (`src/user-profile.kora`)
```kora
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

## Next Steps

### 1. Implement Your Logic

Edit the files in `src/` to add your business logic:

- **Domain modules**: Define your data models
- **API modules**: Implement backend handlers
- **Page modules**: Build your UI components

### 2. Use Compiled Code

The compiled TypeScript files in `dist/` can be used in:

**Frontend (React):**
```typescript
import { UserProfile, loadUserProfile } from './dist/user-profile';

async function App() {
  const user = await loadUserProfile('123');
  return <UserProfile user={user} />;
}
```

**Backend (Node.js):**
```typescript
import { getUserHandler } from './dist/get-user';

app.get('/api/users/:id', async (req, res) => {
  const result = await getUserHandler({ id: req.params.id });
  res.json(result);
});
```

### 3. Set Up Full Stack

See [RUNTIME_ARCHITECTURE.md](./RUNTIME_ARCHITECTURE.md) for:
- Setting up React frontend
- Setting up Node.js backend
- Connecting UI and server
- Deployment options

## Troubleshooting

### Build Fails

**Error: "Expected ';'"**
- Make sure JSX has a single root element: `<div>...</div>`
- Check syntax in your `.kora` files

**Error: "Cannot find module"**
- Run `kora build` first
- Check that files are in `src/` directory

### Global Install Issues

If `kora` command doesn't work:
```bash
# Use local build directly
node /path/to/kora/dist/cli.js new my-app
```

See [FIX_GLOBAL_INSTALL.md](./FIX_GLOBAL_INSTALL.md) for details.

## Commands Reference

```bash
# Create new project
kora new <name>

# Build project
kora build

# Start dev server (watch mode)
kora dev

# Compile single file
kora compile <file> -o <output>

# Check syntax
kora check <file>
```

## Learn More

- [TUTORIAL.md](./TUTORIAL.md) - Complete tutorial
- [RUNTIME_ARCHITECTURE.md](./RUNTIME_ARCHITECTURE.md) - How Kora runs
- [README.md](./README.md) - Language overview


