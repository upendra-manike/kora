# Direct Fix for GitHub Pages 404

## Current Issue

The site is still showing 404. Let's fix this directly.

## Solution: Use Simple Branch Deployment

GitHub Actions might be causing issues. Let's use the simpler branch deployment method.

### Step 1: Configure Pages Settings

1. **Go to**: https://github.com/upendra-manike/kora/settings/pages

2. **Set these exact values**:
   - **Source**: `Deploy from a branch` (NOT GitHub Actions)
   - **Branch**: `main` (or `master` if that's your branch)
   - **Folder**: `/docs` (must be exactly `/docs`)
   - Click **Save**

3. **Wait 2-3 minutes** for GitHub to build

### Step 2: Verify Files Exist

The files MUST be in the `docs/` folder at the root:
- ✅ `docs/index.html`
- ✅ `docs/styles.css`
- ✅ `docs/script.js`

### Step 3: Check Branch Name

Make sure your default branch is `main`:
- Go to: https://github.com/upendra-manike/kora/settings
- Check "Default branch" - should be `main`

If it's `master`, change it to `main` or use `master` in Pages settings.

### Step 4: Force a New Deployment

Sometimes you need to trigger a new deployment:

1. Make a small change to `docs/index.html` (add a space)
2. Commit and push:
   ```bash
   git add docs/index.html
   git commit -m "Trigger Pages deployment"
   git push
   ```
3. Wait 2-3 minutes

## Alternative: Move Files to Root

If `/docs` folder doesn't work, we can move files to root:

1. Move `docs/index.html` to root
2. Update paths in HTML
3. Deploy from root folder

## Check Deployment Status

1. Go to: https://github.com/upendra-manike/kora/settings/pages
2. Look for "Your site is live at..." message
3. Check if there are any error messages

## Verify URL

Make sure you're visiting:
- ✅ https://upendra-manike.github.io/kora/ (with trailing slash)
- ❌ NOT https://upendra-manike.github.io/kora (without trailing slash)

## Still Not Working?

1. **Check repository is public** (required for free GitHub Pages)
2. **Wait 5-10 minutes** (first deployment can be slow)
3. **Clear browser cache** (Cmd+Shift+R)
4. **Try incognito mode**
5. **Check Actions tab** for any errors

---

**Most important: Set Source to "Deploy from a branch" with folder "/docs"**

