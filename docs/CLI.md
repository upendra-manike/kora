# Kora CLI Reference

The Kora command-line interface provides all the tools you need to work with Kora projects.

## Installation

### Global Installation

```bash
npm install -g kora
```

After installation, the `kora` command will be available globally.

### Using npx (No Installation)

```bash
npx kora <command>
```

This is useful for one-off commands or trying Kora without installing.

---

## Commands

### `kora new <name>`

Creates a new Kora project with a standard structure.

**Usage:**
```bash
kora new my-app
```

**What it does:**
- Creates a new directory with the project name
- Sets up the standard Kora project structure:
  ```
  my-app/
  ├── src/
  │   ├── domain/      # Domain modules
  │   ├── api/         # API modules
  │   └── ui/          # UI/Page modules
  ├── dist/            # Compiled output
  ├── kora.json        # Kora configuration
  └── package.json     # Node.js package config
  ```
- Creates example files to get you started
- Initializes a Git repository (optional)

**Options:**
- `--no-git` - Skip Git initialization
- `--template <name>` - Use a specific template (coming soon)

**Example:**
```bash
kora new blog-app
cd blog-app
kora dev
```

---

### `kora dev`

Starts the development server with hot reload.

**Usage:**
```bash
kora dev
```

**What it does:**
- Watches for changes in `.kora` files
- Compiles Kora code to TypeScript/JavaScript
- Starts a development server (Next.js, Express, etc. based on config)
- Enables hot module replacement
- Shows compilation errors in real-time

**Options:**
- `--port <number>` - Specify port (default: 3000)
- `--host <host>` - Specify host (default: localhost)
- `--no-open` - Don't open browser automatically

**Example:**
```bash
kora dev --port 3001
```

---

### `kora build`

Builds the project for production.

**Usage:**
```bash
kora build
```

**What it does:**
- Compiles all Kora files to TypeScript/JavaScript
- Performs type checking
- Validates architectural boundaries
- Generates optimized output in `dist/`
- Creates type declaration files (`.d.ts`)

**Options:**
- `--out <dir>` - Output directory (default: `dist`)
- `--minify` - Minify output (default: false)
- `--sourcemap` - Generate source maps (default: true)

**Example:**
```bash
kora build --out build --minify
```

---

### `kora check`

Checks Kora code for errors without building.

**Usage:**
```bash
kora check
```

Or check a specific file:

```bash
kora check src/user.kora
```

**What it does:**
- Parses Kora files
- Performs type checking
- Validates architectural boundaries (e.g., UI can't import domain directly)
- Checks for syntax errors
- Reports all issues without generating output

**Use cases:**
- CI/CD pipelines
- Pre-commit hooks
- Quick validation

**Example:**
```bash
kora check
# ✅ No errors found

kora check src/user.kora
# ❌ Error: UI module cannot directly import domain module
```

---

### `kora compile <file>`

Compiles a single Kora file to TypeScript.

**Usage:**
```bash
kora compile src/user.kora
```

**Options:**
- `-o, --out <file>` - Output file (default: stdout)
- `--format` - Output format: `ts` or `js` (default: `ts`)

**What it does:**
- Compiles a single Kora file
- Outputs TypeScript/JavaScript code
- Useful for:
  - Testing compilation
  - Understanding generated code
  - One-off conversions

**Example:**
```bash
kora compile src/user.kora -o user.ts
```

---

## Configuration

Kora projects use a `kora.json` configuration file:

```json
{
  "compiler": {
    "target": "ES2022",
    "module": "ES2022",
    "strict": true
  },
  "output": {
    "dir": "dist",
    "format": "ts"
  },
  "dev": {
    "port": 3000,
    "host": "localhost"
  },
  "boundaries": {
    "enforce": true,
    "rules": {
      "ui": ["api"],
      "api": ["domain"],
      "domain": []
    }
  }
}
```

---

## Environment Variables

- `KORA_LOG_LEVEL` - Logging level: `error`, `warn`, `info`, `debug` (default: `info`)
- `KORA_CACHE_DIR` - Cache directory for compiled files (default: `.kora-cache`)

---

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Compilation error
- `3` - Type checking error
- `4` - Architecture boundary violation

---

## Examples

### Complete Workflow

```bash
# Create new project
kora new my-app
cd my-app

# Start development
kora dev

# In another terminal, check code
kora check

# Build for production
kora build

# Compile single file to inspect output
kora compile src/user.kora -o user.ts
```

### CI/CD Integration

```bash
# In your CI pipeline
kora check || exit 1
kora build --out dist
```

---

## Troubleshooting

### Command not found

If `kora` command is not found after installation:

1. Check npm global bin path: `npm config get prefix`
2. Add to PATH if needed
3. Or use `npx kora` instead

### Build fails

1. Run `kora check` to see detailed errors
2. Check `kora.json` configuration
3. Ensure all dependencies are installed: `npm install`

### Dev server issues

1. Check if port is already in use
2. Try different port: `kora dev --port 3001`
3. Check logs for detailed error messages

---

## Future Commands (Planned)

- `kora test` - Run tests
- `kora format` - Format Kora code
- `kora lint` - Lint Kora code
- `kora init` - Initialize Kora in existing project
- `kora add <package>` - Add Kora package
- `kora upgrade` - Upgrade Kora version

---

For more information, see the [main README](../README.md).

