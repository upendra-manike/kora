# GitHub Authentication for Push

## Issue

The repository exists but needs authentication to push.

## Solution: Use Personal Access Token

### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `kora-push`
4. Expiration: Choose your preference
5. Scopes: Check **`repo`** (full control of private repositories)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Push with Token

When pushing, use the token as your password:

```bash
git push -u origin main
```

When prompted:
- **Username**: `upendra.manike`
- **Password**: Paste your personal access token (not your GitHub password)

### Alternative: Use Token in URL (Temporary)

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/upendra.manike/kora.git
git push -u origin main
```

Then remove token from URL after push:
```bash
git remote set-url origin https://github.com/upendra.manike/kora.git
```

### Step 3: Verify

After pushing, visit: https://github.com/upendra.manike/kora

---

**Create the token and try pushing again!**


