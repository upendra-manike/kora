# Quick Start: Deploy Kora Server

Fastest way to deploy Kora API server.

## Option 1: Railway (Recommended - Easiest)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
cd server
railway init

# 4. Deploy
railway up
```

**Done!** Your API is live at `https://your-app.railway.app`

## Option 2: Render (No CLI needed)

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set:
   - **Name**: `kora-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click "Create Web Service"

**Done!** Your API is live at `https://kora-api.onrender.com`

## Option 3: Vercel (Serverless)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd server
vercel
```

**Done!** Your API is live on Vercel.

## Option 4: Heroku

```bash
# 1. Install Heroku CLI
# Download from heroku.com

# 2. Login
heroku login

# 3. Create app
cd server
heroku create kora-api

# 4. Deploy
git push heroku main
```

**Done!** Your API is live at `https://kora-api.herokuapp.com`

## Test Your Deployment

```bash
# Health check
curl https://your-app-url/health

# Compile test
curl -X POST https://your-app-url/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"page Test { view() { <div>Hello</div> } }"}'
```

## Environment Variables

Set in your platform's dashboard:

- `PORT`: Usually auto-set
- `NODE_ENV`: `production`
- `ALLOWED_ORIGINS`: Your frontend domain (optional)

---

**Choose Railway or Render for the easiest deployment!**

