# Fix GitHub Pages 404 - Quick Guide

## The Problem

GitHub Pages is enabled but showing 404. This happens when:
- GitHub Actions workflow hasn't run yet
- Pages source is set to "branch" but should be "GitHub Actions"
- Deployment is still in progress

## Quick Fix (2 Steps)

### Step 1: Change Pages Source

1. Go to: **https://github.com/upendra-manike/kora/settings/pages**

2. Under "Build and deployment":
   - Change **Source** from "Deploy from a branch" to **"GitHub Actions"**
   - Click **Save**

### Step 2: Trigger Deployment

**Option A: Wait for automatic deployment**
- The workflow runs automatically on push
- Wait 2-3 minutes

**Option B: Manually trigger**
1. Go to: **https://github.com/upendra-manike/kora/actions**
2. Click **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait 2-3 minutes

## Verify

1. Check Actions: https://github.com/upendra-manike/kora/actions
   - Should show green checkmark ✅

2. Visit: https://upendra-manike.github.io/kora/
   - Should show the website (not 404)

## Alternative: Use Branch Deployment

If GitHub Actions doesn't work:

1. Go to: https://github.com/upendra-manike/kora/settings/pages
2. Set:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/docs`
3. Save and wait 1-2 minutes

## Files Are Ready ✅

All website files are in `docs/`:
- ✅ `index.html` (10KB)
- ✅ `styles.css` (7.4KB)
- ✅ `script.js` (2.6KB)
- ✅ `404.html`

They're committed and pushed to GitHub.

---

**Most likely fix: Change Pages source to "GitHub Actions" in repository settings.**


