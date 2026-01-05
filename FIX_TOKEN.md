# Fix GitHub Token Permissions

## Issue

The token doesn't have the right permissions to push.

## Solution

### Check Token Permissions

1. Go to: https://github.com/settings/tokens
2. Find your token (or create a new one)
3. Make sure it has **`repo`** scope checked
4. This gives full control of repositories

### Create New Token with Correct Permissions

1. Go to: https://github.com/settings/tokens/new
2. Name: `kora-push-repo`
3. Expiration: Choose your preference
4. **Scopes**: Check **`repo`** (this is critical!)
5. Click "Generate token"
6. Copy the new token

### Push with New Token

**Option 1: Use in URL (temporary)**
```bash
git remote set-url origin https://NEW_TOKEN@github.com/upendra-manike/kora.git
git push -u origin main
git remote set-url origin https://github.com/upendra-manike/kora.git
```

**Option 2: Use credential helper**
```bash
git push -u origin main
# When prompted:
# Username: upendra-manike
# Password: paste your token
```

### Verify Token Works

Test the token:
```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user/repos | grep kora
```

If it shows the kora repository, the token works.

---

**The token needs `repo` scope to push!**


