# Ready to Publish! 🚀

## Package Name Changed

The name "kora" was already taken on npm, so I've updated it to:
**`@kora-lang/kora`**

This is a scoped package, which is actually better for organization!

## Quick Publish Steps

### 1. Login to npm
```bash
npm login
```

### 2. Publish (scoped packages need --access public)
```bash
npm publish --access public
```

That's it! The package is ready.

## What Will Be Published

- ✅ All compiled code in `dist/`
- ✅ README.md
- ✅ LICENSE
- ✅ CODE_OF_CONDUCT.md
- ✅ Package size: ~30.8 kB

## After Publishing

Your package will be available at:
**https://www.npmjs.com/package/@kora-lang/kora**

Users can install with:
```bash
npm install -g @kora-lang/kora
```

Or use directly:
```bash
npx @kora-lang/kora new my-app
```

## Alternative: Use Different Name

If you prefer a different name, you can change it in `package.json`:
- `kora-lang`
- `kora-compiler`
- `@your-username/kora`

Then run `npm publish` (or `npm publish --access public` for scoped).

---

**Ready when you are!** Just run `npm login` then `npm publish --access public`

