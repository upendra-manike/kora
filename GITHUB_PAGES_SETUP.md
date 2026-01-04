# GitHub Pages Setup Instructions

## Website Created ✅

A complete static website has been created in the `docs/` directory.

## Enable GitHub Pages

To publish the website:

### Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/upendra-manike/kora
2. Click **Settings**
3. Scroll to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Deploy from a branch**
   - **Branch**: `main`
   - **Folder**: `/docs`
5. Click **Save**

### Step 2: Wait for Deployment

GitHub will automatically:
- Build the site
- Deploy it to GitHub Pages
- Make it available at: `https://upendra-manike.github.io/kora/`

This usually takes 1-2 minutes.

### Step 3: Verify

Visit: https://upendra-manike.github.io/kora/

You should see the Kora language tutorial website!

## Automatic Deployment

The website will automatically update whenever you:
- Push changes to the `main` branch
- Update files in the `docs/` directory

The GitHub Actions workflow (`.github/workflows/pages.yml`) handles deployment automatically.

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file in `docs/` with your domain
2. Configure DNS settings for your domain
3. Update GitHub Pages settings

## Website Features

✅ **Responsive Design** - Works on mobile and desktop  
✅ **Interactive Tutorials** - Step-by-step guides  
✅ **Code Examples** - Tabbed examples with copy functionality  
✅ **Smooth Navigation** - Smooth scrolling between sections  
✅ **Modern UI** - Clean, professional design  

## Files

- `docs/index.html` - Main website
- `docs/styles.css` - All styling
- `docs/script.js` - Interactive features
- `docs/404.html` - Custom 404 page
- `.github/workflows/pages.yml` - Deployment workflow

## Local Testing

Test the website locally before deploying:

```bash
cd docs
python -m http.server 8000
# Visit http://localhost:8000
```

Or use any static file server.

---

**Once GitHub Pages is enabled, your tutorial website will be live!** 🚀

