# Publishing Kora

This document outlines the strategy for publishing Kora as a real programming language.

## Phase 1: Foundation (Before Public Release)

### 1. GitHub Organization

Create: `github.com/kora-lang`

Repositories:
- `kora` - Compiler + CLI (this repo)
- `kora-runtime` - Node runtime helpers
- `kora-examples` - Example applications
- `kora-docs` - Documentation website
- `kora-rfcs` - Language design proposals

### 2. Official Manifesto

✅ **Done** - See [README.md](../README.md)

The README now answers:
- Why Kora exists
- What problems it solves
- What it does NOT try to solve

---

## Phase 2: Distribution

### 3. npm Package

**Package Name:** `kora`

**Installation:**
```bash
npm install -g kora
```

**Or use without installing:**
```bash
npx kora new app
```

**What gets published:**
- CLI binary (`kora` command)
- Compiler bundled inside
- Type definitions

**Configuration:**
- ✅ `package.json` configured with proper fields
- ✅ `.npmignore` excludes source files
- ✅ `files` field specifies what to include

### 4. Direct Binaries (Future)

Later, add:
- GitHub Releases
- Prebuilt binaries for macOS, Linux, Windows
- Use `pkg` or `nexe` for bundling
- GitHub Actions for automated builds

---

## Phase 3: Developer Onboarding

### 5. First-Time Experience

**Goal:** Zero → running app in 2 minutes

```bash
npx kora new my-app
cd my-app
kora dev
```

**What they see:**
- ✅ Running UI
- ✅ Working API
- ✅ No configuration needed

### 6. Three Golden Examples

✅ **Created:**
- `examples/minimal-app/` - Minimal viable app
- `examples/user-domain.kora` - Domain example
- `examples/get-user-api.kora` - API example
- `examples/user-profile-page.kora` - UI example

**Future:**
- Real SaaS app (auth, DB)
- Enterprise-style app (DDD + modules)

---

## Phase 4: Public Launch

### 7. Soft Launch Strategy

**Don't announce everywhere immediately.**

**Instead:**
1. Share on GitHub Discussions
2. Post on Dev.to with "experimenting" framing
3. Share on Reddit (r/javascript, r/node) asking for feedback
4. Focus on **feedback**, not praise

**Message:**
> "I'm experimenting with a full-stack language on Node — would love design feedback."

This attracts **serious engineers**, not hype chasers.

### 8. Official Launch (After Feedback)

**Channels:**
- Hacker News
- Twitter/X
- LinkedIn
- Medium / Dev.to

**Structure:**
- Problem → Solution → Demo → Repo
- Show code, not slides
- Be honest about status (Phase 1, not production-ready)

---

## Phase 5: Trust & Maturity

### 9. Versioning Strategy

Follow **Semantic Versioning**:

- `0.x` → Experimental (current)
- `1.0` → Stable core
- `2.x` → Breaking syntax changes

**Never break users silently.**

### 10. RFC Process

Create `kora-rfcs` repository:

- Any language change needs an RFC
- Decisions are documented
- Community can propose changes

This is what Rust & Go do.

### 11. Website (Future)

Simple site with:
- What is Kora?
- How it works
- Install instructions
- Documentation
- Roadmap

No marketing fluff.

### 12. Legal & License

✅ **Done:**
- Apache 2.0 License
- Code of Conduct
- Contribution guidelines

---

## Publishing Checklist

### Before First npm Publish

- [x] README manifesto complete
- [x] LICENSE file (Apache 2.0)
- [x] CODE_OF_CONDUCT.md
- [x] CONTRIBUTING.md
- [x] package.json configured
- [x] .npmignore configured
- [x] CLI commands documented
- [ ] Parser implementation complete
- [ ] Compiler implementation complete
- [ ] Basic tests passing
- [ ] Example apps working

### npm Publish Steps

1. **Test locally:**
   ```bash
   npm pack
   tar -xzf kora-0.1.0.tgz
   # Inspect contents
   ```

2. **Publish to npm:**
   ```bash
   npm publish --dry-run  # Test first
   npm publish
   ```

3. **Verify:**
   ```bash
   npm install -g kora
   kora --version
   ```

### Post-Publish

1. Create GitHub release
2. Update documentation
3. Announce on chosen channels
4. Monitor issues and feedback

---

## Success Metrics

**Early success ≠ stars.**

**Success =:**
- 5–10 real users
- Meaningful GitHub issues
- Design discussions
- People asking "why", not "wow"

---

## Current Status

**Phase:** 1 (Language Core)

**Status:** Not ready for npm publish yet

**Blockers:**
- Parser needs full implementation
- Compiler needs full implementation
- Need working example apps

**Next Steps:**
1. Complete parser implementation
2. Complete compiler implementation
3. Create working minimal app
4. Test end-to-end workflow
5. Then publish to npm

---

## Notes

> **Languages are not launched.  
> They are adopted slowly by trust.**

The goal is not popularity — it's **credibility**.

