# Kora Documentation Website

This is the static website for the Kora programming language, deployed to GitHub Pages.

## Local Development

To view the website locally:

1. Open `index.html` in your browser
2. Or use a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # Then visit http://localhost:8000
   ```

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

The deployment is configured via `.github/workflows/pages.yml`.

## Site Structure

- `index.html` - Main landing page
- `styles.css` - All styles
- `script.js` - Interactive features
- `404.html` - Custom 404 page

## Features

- ✅ Responsive design
- ✅ Smooth scrolling
- ✅ Interactive code examples
- ✅ Tabbed examples
- ✅ Copy to clipboard for code
- ✅ Mobile-friendly navigation

## Customization

Edit the files in this directory to customize the website:
- `index.html` - Content and structure
- `styles.css` - Styling
- `script.js` - Interactive features

## GitHub Pages URL

Once deployed, the site will be available at:
`https://upendra-manike.github.io/kora/`


