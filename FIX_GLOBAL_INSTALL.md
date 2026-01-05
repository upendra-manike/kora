# Fix Global Installation Issue

## Problem

When running `kora new` after global installation, you get:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/usr/local/lib/node_modules/@kora-lang/kora/dist/parser'
```

This happens because the published npm package was built before we added `.js` extensions to imports.

## Solution

### Option 1: Use Local Build (Immediate Fix)

Use the local build directly instead of the global installation:

```bash
# Create project using local build
node /path/to/kora/dist/cli.js new KoraMongoCrud

# Or create an alias
alias kora="node /path/to/kora/dist/cli.js"
kora new KoraMongoCrud
```

### Option 2: Reinstall Global Package (After Republish)

Once the package is republished with the fix:

```bash
# Uninstall old version
npm uninstall -g @kora-lang/kora

# Reinstall latest version
npm install -g @kora-lang/kora

# Verify it works
kora new KoraMongoCrud
```

### Option 3: Republish Package

To fix the published package:

```bash
# 1. Ensure local build is correct
npm run build

# 2. Verify dist files have .js extensions
grep "from './parser" dist/cli.js
# Should show: import { Parser } from './parser.js';

# 3. Update version in package.json
# (increment patch version)

# 4. Publish
npm publish
```

## Verification

Check that the compiled output has `.js` extensions:

```bash
# Check cli.js
grep "from './parser" dist/cli.js
# Should output: import { Parser } from './parser.js';

# Check all files
grep -r "from '\\./" dist/*.js | grep -v "\\.js'"
# Should output nothing (all imports should have .js)
```

## Current Status

✅ **Local build**: Has `.js` extensions - works correctly  
⚠️ **Published package**: Needs republish with updated build  

## Temporary Workaround

Create a wrapper script:

```bash
#!/bin/bash
# ~/bin/kora-wrapper
node /path/to/kora/dist/cli.js "$@"
```

Make it executable:
```bash
chmod +x ~/bin/kora-wrapper
export PATH="$HOME/bin:$PATH"
```

Then use `kora-wrapper` instead of `kora` until the package is republished.

