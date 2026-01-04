# Kora Quick Start

Get from zero to running app in under 2 minutes.

## Installation

```bash
npm install -g kora
```

Or use without installing:

```bash
npx kora new my-app
```

## Create Your First App

```bash
kora new my-app
cd my-app
```

This creates a new Kora project with:
- Standard project structure
- Example files to get you started
- All configuration set up

## Start Development

```bash
kora dev
```

This will:
- Compile your Kora code
- Start a development server
- Enable hot reload
- Open your browser automatically

Visit `http://localhost:3000` to see your app.

## Project Structure

```
my-app/
├── src/
│   ├── domain/      # Domain modules (types, business logic)
│   ├── api/         # API endpoints
│   └── ui/          # UI pages and components
├── dist/            # Compiled output (TypeScript/JavaScript)
└── kora.json        # Kora configuration
```

## Your First Kora Code

### 1. Define a Domain Type

Create `src/domain/user.kora`:

```kora
module domain User {
  type User {
    id: UUID
    name: String
    email: Email
  }
}
```

### 2. Create an API

Create `src/api/get-user.kora`:

```kora
api getUser {
  input { id: UUID }
  output User

  handler {
    return UserRepo.find(id)
  }
}
```

### 3. Build a Page

Create `src/ui/profile.kora`:

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

That's it! The compiler automatically:
- Connects the page to the API
- Generates type-safe client code
- Creates the React component
- Sets up the API route

## Next Steps

- Read the [full README](./README.md) for philosophy and concepts
- Check [CLI documentation](./docs/CLI.md) for all commands
- See [examples](./examples/) for more patterns
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute

## Common Commands

```bash
kora new <name>        # Create new project
kora dev               # Start dev server
kora build             # Build for production
kora check             # Check for errors
kora compile <file>    # Compile single file
```

## Need Help?

- Check the [documentation](./docs/)
- See [examples](./examples/)
- Open an issue on GitHub
- Join discussions

Welcome to Kora! 🟢

