# Manual Push Instructions

## Current Issue

The token doesn't have `repo` scope permissions needed to push.

## Solution: Create Token with Repo Scope

### Step 1: Create New Token

1. Go to: https://github.com/settings/tokens/new
2. **Token name**: `kora-repo-push`
3. **Expiration**: Choose (90 days recommended)
4. **Select scopes**: 
   - ✅ **`repo`** (Full control of private repositories) - **THIS IS REQUIRED**
5. Click "Generate token"
6. **Copy the token immediately**

### Step 2: Push Using Token

**Method 1: Use token in URL (one-time)**
```bash
git remote set-url origin https://YOUR_NEW_TOKEN@github.com/upendra-manike/kora.git
git push -u origin main
git remote set-url origin https://github.com/upendra-manike/kora.git
```

**Method 2: Use credential helper**
```bash
git push -u origin main
# When prompted:
# Username: upendra-manike
# Password: paste your NEW token (with repo scope)
```

### Step 3: Verify

After pushing, visit: https://github.com/upendra-manike/kora

## Why This Happens

GitHub requires tokens to have explicit `repo` scope to push code. The current token might only have read permissions.

## Quick Check

Test if your token has repo access:
```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/upendra-manike/kora
```

If you get repository details, the token works. If you get "Not Found" or "Bad credentials", the token needs `repo` scope.

---

**Create a new token with `repo` scope and try again!**

