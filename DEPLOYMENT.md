# Production Deployment Guide

## Backend Deployment (Render)

### 1. Environment Variables
Set these in Render dashboard:
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://shrikantrathi76:suraj22ce155@cluster0.frt51.mongodb.net/
cloud_name=dwnt15sqo
api_key=822885945752857
api_secret=i3ctwLDFf_-KSQcnIR1bS9S7NXM
JWT_USER_PASSWORD=12121212
JWT_ADMIN_PASSWORD=12121213
Google_API_key=AIzaSyAqFeT1P1Xff0REGvlIdZu1sfJc6-p5iLI
```

### 2. Render Configuration
- Use `render.yaml` for automatic deployment
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`

### 3. Deployment Steps
1. Connect GitHub repository to Render
2. Select "Web Service"
3. Choose Node.js runtime
4. Set environment variables
5. Deploy

## Frontend Deployment (Vercel)

### 1. Environment Variables
Create `.env.production`:
```
VITE_API_URL=https://dev100x-backend.onrender.com
VITE_NODE_ENV=production
```

### 2. Vercel Configuration
- Use `vercel.json` for deployment settings
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### 3. Deployment Steps
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow prompts to connect repository

## Production Checklist

### Backend
- ✅ Production start script (`npm start`)
- ✅ Health check endpoint (`/health`)
- ✅ Production CORS origins
- ✅ Error handling for production
- ✅ Render configuration (`render.yaml`)

### Frontend
- ✅ Production build optimization
- ✅ Vercel configuration (`vercel.json`)
- ✅ Environment variable handling
- ✅ SPA routing support

### Security
- ✅ Environment variables not in code
- ✅ CORS properly configured
- ✅ Error messages sanitized in production

## URLs
- Backend: `https://dev100x-backend.onrender.com`
- Frontend: `https://dev100x.vercel.app`
- Health Check: `https://dev100x-backend.onrender.com/health`
