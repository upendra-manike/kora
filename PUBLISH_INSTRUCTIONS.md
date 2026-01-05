# Publishing Kora to npm

## Current Status

✅ Package is built and ready
✅ Package tarball verified (30.8 kB)
✅ All files included correctly
✅ Version: 0.1.0

## Step 1: Login to npm

You need to be logged into npm to publish. Run:

```bash
npm login
```

This will prompt you for:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

Or if you don't have an npm account yet:
1. Go to https://www.npmjs.com/signup
2. Create a free account
3. Then run `npm login`

## Step 2: Check Package Name Availability

The package name "kora" might already be taken. Check:

```bash
npm view kora
```

If it shows "404 Not Found", the name is available.
If it shows package info, you'll need to choose a different name like:
- `@your-username/kora`
- `kora-lang`
- `kora-compiler`

To use a scoped package name, update `package.json`:
```json
{
  "name": "@your-username/kora",
  ...
}
```

## Step 3: Publish

Once logged in and name is available:

```bash
# Dry run first (recommended)
npm publish --dry-run

# If everything looks good, publish
npm publish
```

For scoped packages (if using @your-username/kora):
```bash
npm publish --access public
```

## Step 4: Verify

After publishing, verify:

```bash
npm view kora
```

Or visit: https://www.npmjs.com/package/kora

## Important Notes

⚠️ **Package name "kora" might be taken** - Check availability first!

⚠️ **Publishing is permanent** - Once published, you can't delete versions (only deprecate)

⚠️ **Version numbers** - Follow semantic versioning:
- 0.1.0 → 0.1.1 (patch)
- 0.1.0 → 0.2.0 (minor)
- 0.1.0 → 1.0.0 (major)

## After Publishing

1. Update README with installation instructions
2. Create a GitHub release
3. Announce on social media/forums
4. Monitor for issues and feedback

## Quick Publish Commands

```bash
# 1. Login
npm login

# 2. Check name (optional)
npm view kora

# 3. Publish
npm publish
```

Good luck! 🚀


