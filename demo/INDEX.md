# Kora Demo Index

Welcome to the Kora language demos! Here's what's available:

## 📚 Documentation

### [README.md](./README.md)
Complete overview of the demo, project structure, and step-by-step guide.

### [QUICK_START.md](./QUICK_START.md)
Get started in 5 minutes! Perfect for first-time users.

### [WALKTHROUGH.md](./WALKTHROUGH.md)
Detailed walkthrough showing how Kora works from code to application.

### [COMPLETE_EXAMPLE.md](./COMPLETE_EXAMPLE.md)
Full blog application example with explanations of every part.

## 📁 Example Code

### Blog Application (`blog/`)

A complete blog application demonstrating:

#### Domain Layer
- `domain/post.kora` - Post, Author, Comment types

#### API Layer
- `api/get-post.kora` - Get single post
- `api/create-post.kora` - Create new post
- `api/list-posts.kora` - List all posts

#### UI Layer
- `ui/post-list.kora` - Post listing page
- `ui/post-detail.kora` - Post detail page
- `ui/create-post.kora` - Create post form

## 🚀 Getting Started

1. **New to Kora?** → Start with [QUICK_START.md](./QUICK_START.md)
2. **Want to understand how it works?** → Read [WALKTHROUGH.md](./WALKTHROUGH.md)
3. **Ready to build?** → Follow [COMPLETE_EXAMPLE.md](./COMPLETE_EXAMPLE.md)
4. **Need reference?** → Check [README.md](./README.md)

## 🎯 What You'll Learn

- How to define domain types
- How to create API endpoints
- How to build UI pages
- How the compiler connects everything
- How types flow across layers
- How to use generated code

## 📦 Installation

```bash
npm install -g @kora-lang/kora
```

## 🏃 Quick Test

```bash
# Create new project
kora new my-app

# Copy demo files
cp -r demo/blog/src/* my-app/src/

# Compile
cd my-app
kora build

# Check output in dist/
```

## 📖 Learn More

- [Main README](../README.md) - Language overview
- [CLI Documentation](../docs/CLI.md) - Command reference
- [Grammar Specification](../grammar/kora.bnf) - Language grammar

---

**Start with [QUICK_START.md](./QUICK_START.md) to begin your Kora journey!** 🚀

