# 🚀 Netlee Backend - Complete Documentation

Express.js + MongoDB backend API ka complete guide - deployment, TMDB integration, aur full movie features.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Local Setup](#local-setup)
4. [Environment Variables](#environment-variables)
5. [TMDB Full Movie Feature](#tmdb-full-movie-feature)
6. [API Endpoints](#api-endpoints)
7. [Deployment Guide](#deployment-guide)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Yeh backend API streaming platform ke liye banaya gaya hai jo provide karta hai:
- User Authentication (Login/Register)
- Movie Management (Local + TMDB)
- TMDB Full Movie Video URLs
- Admin Operations
- Media Upload (Cloudinary integration)

**Tech Stack:**
- Express.js 5.x
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Media Storage)
- Passport.js (OAuth)
- TMDB API Integration

---

## 🔧 Prerequisites

Setup se pehle ensure karein:

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
4. **Network Access me `0.0.0.0/0` add karo** (all IPs allow) - Ye bahut important hai!
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

## 🎬 TMDB Full Movie Feature

### ✅ Kya Ready Hai

"Play Full Movie" button already app mein implemented hai! Bas video URLs add karne hain.

### 🚀 Quick Start Guide

#### Step 1: Server Start Karo
```bash
cd Netlee-Backend
npm start
```

#### Step 2: Login Karke Token Lo

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Token copy karo!** Ye har API call mein chahiye.

#### Step 3: TMDB Movie ID Dhundo

**Mobile App mein:**
1. Koi bhi TMDB movie open karo
2. URL dekho: `/player?id=550&type=tmdb`
3. Yahan `550` TMDB ID hai

**Ya TMDB website se:**
- https://www.themoviedb.org/movie/550 → ID = 550
- https://www.themoviedb.org/movie/278 → ID = 278

#### Step 4: Video URL Add Karo

**Request:**
```bash
curl -X POST http://localhost:5000/api/admin/tmdb-movie/video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tmdbId": 550,
    "title": "Fight Club",
    "videoUrl": "https://example.com/movies/fight-club.mp4",
    "hlsUrl": "https://example.com/movies/fight-club.m3u8"
  }'
```

**Testing ke liye sample video:**
```json
{
  "tmdbId": 278,
  "title": "Test Movie",
  "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
}
```

#### Step 5: App Mein Check Karo

1. Mobile app restart karo (optional)
2. Wo movie open karo jiska video URL add kiya
3. **Green "Play Full Movie" button** dikhega! 🎉
4. Button click karo → Full movie play hoga

### 🛠️ Useful Scripts

#### Add Test Movies
```bash
node add-test-movies.js
```

#### Verify Movies
```bash
node verify-movies.js
```

### 📝 TMDB API Details

#### 1. Add/Update TMDB Movie Video URL
**Endpoint:** `POST /api/admin/tmdb-movie/video`

**Request Body:**
```json
{
  "tmdbId": 550,
  "title": "Fight Club",
  "videoUrl": "https://example.com/movies/fight-club.mp4",
  "hlsUrl": "https://example.com/movies/fight-club.m3u8",
  "source": "external"
}
```

**Fields:**
- `tmdbId` (required): TMDB movie ID (number)
- `title` (optional): Movie ka naam
- `videoUrl` (required): Full movie ka direct video URL (MP4, etc.)
- `hlsUrl` (optional): HLS streaming URL agar available ho
- `source` (optional): "cloudinary", "external", ya "other" (default: "external")

#### 2. Get All TMDB Movies with Videos
**Endpoint:** `GET /api/admin/tmdb-movies`

**Response:**
```json
[
  {
    "_id": "...",
    "tmdbId": 550,
    "title": "Fight Club",
    "videoUrl": "https://example.com/movies/fight-club.mp4",
    "hasFullMovie": true
  }
]
```

#### 3. Delete TMDB Movie Video
**Endpoint:** `DELETE /api/admin/tmdb-movie/:id`

**Parameters:**
- `id`: MongoDB document ID (not TMDB ID)

#### 4. Check Movie Details
**Endpoint:** `GET /api/movies/tmdb/:tmdbId`

**Response:**
```json
{
  "id": 550,
  "title": "Fight Club",
  "hasFullMovie": true,
  "videoUrl": "https://...",
  ...
}
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/tmdb/:tmdbId` - Get TMDB movie details
- `POST /api/movies` - Create movie (admin only)

### Admin - TMDB Full Movies
- `POST /api/admin/tmdb-movie/video` - Add/Update video URL
- `GET /api/admin/tmdb-movies` - Get all TMDB movies with videos
- `DELETE /api/admin/tmdb-movie/:id` - Delete video URL

### Admin - General
- `POST /api/admin/upload` - Upload movie (admin only)
- `DELETE /api/admin/movies/:id` - Delete movie (admin only)

---

## 🌐 Deployment Guide

### Recommended Platforms:

| Platform | Free Tier | Ease of Use | Best For |
|----------|-----------|-------------|----------|
| **Railway** | ✅ Yes | ⭐⭐⭐⭐⭐ | Quick deployment |
| **Render** | ✅ Yes | ⭐⭐⭐⭐ | Simple setup |
| **Heroku** | ❌ No | ⭐⭐⭐ | Legacy projects |
| **DigitalOcean** | ❌ No | ⭐⭐⭐ | Full control |

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

**Error**: `MongooseServerSelectionError: Could not connect to any servers`

**Solution**:
- ✅ **MongoDB Atlas me Network Access me `0.0.0.0/0` add karo** (Ye sabse important hai!)
  1. MongoDB Atlas dashboard open karo
  2. Left sidebar me "Network Access" click karo
  3. "Add IP Address" button click karo
  4. "Allow Access from Anywhere" select karo ya `0.0.0.0/0` manually enter karo
  5. Confirm karo aur 1-2 minute wait karo
- ✅ Connection string me username/password sahi hain ya nahi check karo
- ✅ Database user me proper permissions hain ya nahi verify karo
- ✅ Server restart karo

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

### Issue 5: TMDB Button Not Showing

**Error**: Green "Play Full Movie" button nahi dikh raha

**Solution**:
```bash
# Check if movie is in database
node verify-movies.js

# Or check API directly
curl http://localhost:5000/api/movies/tmdb/278
# Should show: "hasFullMovie": true
```

- ✅ Video URL sahi add hua?
- ✅ App restart karo
- ✅ Console logs dekho (Player.tsx mein debug info hai)

### Issue 6: Video Not Playing

**Error**: Video play nahi ho raha

**Solution**:
- ✅ Video URL publicly accessible hai?
- ✅ Browser mein URL open karke check karo
- ✅ HLS URL hai to `.m3u8` extension hona chahiye
- ✅ MP4 URL hai to direct video file honi chahiye

### Issue 7: Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows

# Kill process
taskkill /PID <PID> /F  # Windows
```

---

## 🔒 Security Best Practices

1. **Environment Variables**: Kabhi bhi `.env` file ko Git me commit mat karo
2. **JWT Secret**: Strong, random secret key use karo
3. **CORS**: Sirf trusted domains ko allow karo
4. **Rate Limiting**: Production me rate limiting add karo
5. **HTTPS**: Always HTTPS use karo production me
6. **MongoDB**: Database user ko minimal permissions do
7. **IP Whitelist**: Production me specific IPs whitelist karo (development me `0.0.0.0/0` OK hai)

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [TMDB API](https://www.themoviedb.org/documentation/api)

---

## 📦 Postman Collection

Testing ke liye Postman collection available hai:
- File: `TMDB_Movie_API.postman_collection.json`
- Import karke directly use kar sakte ho
- Sabhi endpoints pre-configured hain

---

## ✅ Setup Checklist

- [ ] MongoDB Atlas account setup
- [ ] MongoDB Network Access me `0.0.0.0/0` added
- [ ] Cloudinary account setup
- [ ] Environment variables configured
- [ ] CORS updated with frontend/mobile URLs
- [ ] Backend deployed successfully
- [ ] API endpoints tested
- [ ] TMDB video URLs added
- [ ] "Play Full Movie" button working
- [ ] Logs monitoring setup
- [ ] Frontend & Mobile apps updated with backend URL

---

## 🎉 Quick Test

**Complete flow test karne ke liye:**

1. **Server start karo:**
   ```bash
   npm start
   ```

2. **Login karo:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"password123"}'
   ```

3. **Test video add karo:**
   ```bash
   curl -X POST http://localhost:5000/api/admin/tmdb-movie/video \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "tmdbId": 278,
       "title": "Test Movie",
       "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
     }'
   ```

4. **App mein check karo:**
   - TMDB ID 278 wali movie open karo
   - Green "Play Full Movie" button dikhega! 🎬

---

**Backend URL**: `https://netlee-backend.onrender.com`  
**Status**: ✅ Deployed & Live on Render

*Koi bhi issue ho to GitHub Issues me post karein!*
