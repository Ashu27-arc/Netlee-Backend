# 🚀 Netlee Backend - Deployment Guide

Express.js + MongoDB backend API ka complete deployment guide.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Local Setup](#local-setup)
4. [Environment Variables](#environment-variables)
5. [Deployment Options](#deployment-options)
6. [Step-by-Step Deployment](#step-by-step-deployment)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Yeh backend API streaming platform ke liye banaya gaya hai jo provide karta hai:
- User Authentication (Login/Register)
- Movie Management
- Admin Operations
- Media Upload (Cloudinary integration)

**Tech Stack:**
- Express.js 5.x
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Media Storage)
- Passport.js (OAuth)

---

## 🔧 Prerequisites

Deployment se pehle ensure karein:

- ✅ Node.js v18+ installed
- ✅ MongoDB Atlas account (free tier available)
- ✅ Cloudinary account (free tier available)
- ✅ Git account (GitHub/GitLab)
- ✅ Hosting platform account (Railway/Render/Heroku)

---

## 💻 Local Setup

### 1. Install Dependencies

```bash
cd Netlee-Backend
npm install
```

### 2. Environment Variables

`.env` file banao project root me:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/netlee?retryWrites=true&w=majority

# JWT Secret (kisi bhi random, long string ko use karein)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random_123456789

# Cloudinary Configuration
CLOUDINARY_CLOUD=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. MongoDB Atlas Setup

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) par account banao
2. Free cluster create karo
3. Database user banao
4. Network Access me `0.0.0.0/0` add karo (all IPs allow)
5. Connection string copy karo aur `.env` me `MONGO_URI` me paste karo

### 4. Cloudinary Setup

1. [Cloudinary](https://cloudinary.com) par account banao
2. Dashboard se credentials copy karo
3. `.env` file me add karo

### 5. Run Locally

```bash
# Development mode
node server.js

# Ya PM2 use karein (production-like)
npm install -g pm2
pm2 start server.js --name netlee-backend
```

Server `http://localhost:5000` par start ho jayega.

---

## 🌐 Deployment Options

### Recommended Platforms:

| Platform | Free Tier | Ease of Use | Best For |
|----------|-----------|-------------|----------|
| **Railway** | ✅ Yes | ⭐⭐⭐⭐⭐ | Quick deployment |
| **Render** | ✅ Yes | ⭐⭐⭐⭐ | Simple setup |
| **Heroku** | ❌ No | ⭐⭐⭐ | Legacy projects |
| **DigitalOcean** | ❌ No | ⭐⭐⭐ | Full control |
| **AWS EC2** | ❌ No | ⭐⭐ | Advanced users |

---

## 📝 Step-by-Step Deployment

### Option 1: Railway (Recommended) 🚂

#### Step 1: Account Setup
1. [Railway.app](https://railway.app) par jao
2. "Start a New Project" click karo
3. GitHub se login karo

#### Step 2: Deploy from GitHub
1. "Deploy from GitHub repo" select karo
2. Apna repository select karo
3. Root Directory: `Netlee-Backend` set karo

#### Step 3: Environment Variables
Railway dashboard me "Variables" tab me jao aur add karo:

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

#### Step 4: Build Settings
- Build Command: `npm install`
- Start Command: `node server.js`

#### Step 5: Deploy
1. "Deploy" button click karo
2. Deployment complete hone ka wait karo
3. Backend URL copy karo (e.g., `https://netlee-backend.railway.app`)

#### Step 6: Update CORS
`server.js` me CORS update karo:

```javascript
app.use(cors({
    origin: [
        "https://your-frontend-url.vercel.app",
        "https://your-frontend-url.netlify.app",
        "exp://your-expo-url"
    ],
    credentials: true
}));
```

---

### Option 2: Render 🎨

#### Step 1: Account Setup
1. [Render.com](https://render.com) par account banao
2. GitHub se connect karo

#### Step 2: Create Web Service
1. "New +" → "Web Service" click karo
2. Repository connect karo
3. Settings configure karo:
   - **Name**: `netlee-backend`
   - **Root Directory**: `Netlee-Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

#### Step 3: Environment Variables
Environment tab me saare variables add karo (same as Railway)

#### Step 4: Deploy
1. "Create Web Service" click karo
2. Deployment URL note karo

---

### Option 3: DigitalOcean / AWS EC2 (Advanced) 🖥️

#### Step 1: Server Setup
```bash
# SSH into server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx
```

#### Step 2: Clone Repository
```bash
git clone your-repo-url
cd StreamNova/Netlee-Backend
npm install
```

#### Step 3: Environment Variables
```bash
nano .env
# Saare environment variables add karo
```

#### Step 4: Start with PM2
```bash
pm2 start server.js --name netlee-backend
pm2 save
pm2 startup
```

#### Step 5: Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/netlee-backend
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/netlee-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: SSL Certificate (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## ✅ Post-Deployment

### 1. Test API Endpoints

```bash
# Health check
curl https://your-backend-url.com/api/movies

# Test login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Update Frontend & Mobile

Frontend aur Mobile app me backend URL update karo:
- Frontend: `Netlee-Frontend/src/utils/axios.js`
- Mobile: `Netlee-Mobile/api/api.ts`

### 3. Monitor Logs

**Railway:**
- Dashboard me "Logs" tab me dekho

**Render:**
- Dashboard me "Logs" section me dekho

**PM2:**
```bash
pm2 logs netlee-backend
pm2 monit
```

---

## 🔍 Troubleshooting

### Issue 1: MongoDB Connection Failed

**Error**: `MongoDB Error: connection timeout`

**Solution**:
- ✅ MongoDB Atlas me Network Access me `0.0.0.0/0` add karo
- ✅ Connection string me username/password sahi hain ya nahi check karo
- ✅ Database user me proper permissions hain ya nahi verify karo

### Issue 2: Environment Variables Not Loading

**Error**: `undefined` values

**Solution**:
- ✅ `.env` file sahi location me hai ya nahi
- ✅ Variable names exact match karte hain ya nahi (case-sensitive)
- ✅ Server restart karo after adding variables
- ✅ Railway/Render me variables properly set hain ya nahi

### Issue 3: CORS Error

**Error**: `Access-Control-Allow-Origin` error

**Solution**:
- ✅ `server.js` me CORS configuration check karo
- ✅ Frontend/Mobile URLs CORS me include hain ya nahi
- ✅ `credentials: true` set hai ya nahi

### Issue 4: Cloudinary Upload Failed

**Error**: `Invalid API credentials`

**Solution**:
- ✅ Cloudinary credentials verify karo
- ✅ Environment variables me spaces ya quotes nahi hain na
- ✅ Cloudinary account active hai ya nahi check karo

### Issue 5: Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Issue 6: Build Failed on Railway/Render

**Error**: Build timeout or dependency error

**Solution**:
- ✅ `package.json` me all dependencies properly listed hain
- ✅ Node.js version compatible hai
- ✅ Build logs check karo for specific errors
- ✅ Try: `npm ci` instead of `npm install`

---

## 📊 API Endpoints

Deployment ke baad yeh endpoints available honge:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (admin only)

### Admin
- `POST /api/admin/upload` - Upload movie (admin only)
- `DELETE /api/admin/movies/:id` - Delete movie (admin only)

---

## 🔒 Security Best Practices

1. **Environment Variables**: Kabhi bhi `.env` file ko Git me commit mat karo
2. **JWT Secret**: Strong, random secret key use karo
3. **CORS**: Sirf trusted domains ko allow karo
4. **Rate Limiting**: Production me rate limiting add karo
5. **HTTPS**: Always HTTPS use karo production me
6. **MongoDB**: Database user ko minimal permissions do

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas account setup
- [ ] Cloudinary account setup
- [ ] Environment variables configured
- [ ] CORS updated with frontend/mobile URLs
- [ ] Backend deployed successfully
- [ ] API endpoints tested
- [ ] Logs monitoring setup
- [ ] Frontend & Mobile apps updated with backend URL

---

**Backend URL**: `https://your-backend-url.com`  
**Status**: ✅ Deployed & Running

*Koi bhi issue ho to GitHub Issues me post karein!*
