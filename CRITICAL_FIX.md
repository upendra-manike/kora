# CRITICAL: Fix GitHub Pages 404

## The Problem

GitHub Pages is returning 404 even though files exist. This is a configuration issue.

## EXACT Steps to Fix (Do These Now)

### Step 1: Go to Pages Settings

**URL**: https://github.com/upendra-manike/kora/settings/pages

### Step 2: Configure EXACTLY Like This

1. Scroll to **"Build and deployment"** section
2. Under **"Source"**, select: **"Deploy from a branch"**
3. Under **"Branch"**:
   - Select: **`main`**
   - Folder: **`/docs`** (must be exactly `/docs`)
4. Click **"Save"** button

### Step 3: Wait and Verify

1. **Wait 2-3 minutes** (GitHub needs time to build)
2. **Refresh the page**: https://upendra-manike.github.io/kora/
3. **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## If Still 404 After 5 Minutes

### Check These:

1. **Repository is Public?**
   - Go to: https://github.com/upendra-manike/kora/settings
   - Scroll to "Danger Zone"
   - Repository should be **Public** (not Private)

2. **Files Are in Right Location?**
   - Files MUST be in `docs/` folder at repository root
   - ✅ `docs/index.html` exists
   - ✅ `docs/styles.css` exists
   - ✅ `docs/script.js` exists

3. **Branch Name Correct?**
   - Default branch should be `main`
   - Check: https://github.com/upendra-manike/kora

4. **Try Different URL?**
   - Try: https://upendra-manike.github.io/kora/index.html
   - If that works, there's a routing issue

## Nuclear Option: Move to Root

If `/docs` folder still doesn't work:

1. Copy `docs/index.html` to root
2. Update CSS/JS paths
3. Deploy from root folder instead

But try the `/docs` folder method first - it should work!

## Verification Checklist

- [ ] Pages source set to "Deploy from a branch"
- [ ] Branch set to `main`
- [ ] Folder set to `/docs`
- [ ] Repository is Public
- [ ] Files exist in `docs/` folder
- [ ] Waited 3+ minutes after saving
- [ ] Tried hard refresh (Cmd+Shift+R)

---

**The most common issue: Pages source is set to "GitHub Actions" instead of "Deploy from a branch". Change it to "Deploy from a branch" with folder "/docs".**

