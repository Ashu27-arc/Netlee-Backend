# 🎬 Admin Guide - Movie Add Karne Ka Complete Process

## 📋 Table of Contents
1. [Admin Account Setup](#admin-account-setup)
2. [TMDB Movie Video Add Karna](#tmdb-movie-video-add-karna)
3. [Local Movie Upload Karna](#local-movie-upload-karna)
4. [User Management](#user-management)

---

## 🔐 Admin Account Setup

### Step 1: Admin User Banao

**Option A: Database Me Manually**
1. MongoDB Atlas dashboard open karo
2. Apna database select karo
3. `users` collection me jao
4. Kisi user ka `role` field `"admin"` kar do

**Option B: Register Karke Role Change Karo**
```bash
# 1. Normal user register karo
curl -X POST https://netlee-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@netlee.com",
    "password": "admin123"
  }'

# 2. MongoDB me jaake is user ka role "admin" kar do
```

### Step 2: Admin Login Karo

```bash
curl -X POST https://netlee-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@netlee.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@netlee.com",
    "role": "admin"
  }
}
```

**Token copy karo!** Ye har admin API call me chahiye.

---

## 🎥 TMDB Movie Video Add Karna

TMDB movies ke liye full video URL add karne ka sabse easy tarika.

### Step 1: TMDB Movie ID Dhundo

**Method 1: App Se**
- App me koi TMDB movie open karo
- URL dekho: `/player?id=550&type=tmdb`
- Yahan `550` TMDB ID hai

**Method 2: TMDB Website Se**
- https://www.themoviedb.org/movie/550 → ID = 550
- https://www.themoviedb.org/movie/278 → ID = 278

### Step 2: Video URL Add Karo

**Using cURL:**
```bash
curl -X POST https://netlee-backend.onrender.com/api/admin/tmdb-movie/video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "tmdbId": 550,
    "title": "Fight Club",
    "videoUrl": "https://example.com/movies/fight-club.mp4",
    "hlsUrl": "https://example.com/movies/fight-club.m3u8",
    "source": "external"
  }'
```

**Using Postman:**
1. Method: `POST`
2. URL: `https://netlee-backend.onrender.com/api/admin/tmdb-movie/video`
3. Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_ADMIN_TOKEN`
4. Body (JSON):
```json
{
  "tmdbId": 550,
  "title": "Fight Club",
  "videoUrl": "https://your-video-url.mp4",
  "hlsUrl": "https://your-video-url.m3u8",
  "source": "external"
}
```

**Fields:**
- `tmdbId` (required): TMDB movie ID
- `title` (optional): Movie ka naam
- `videoUrl` (required): Direct video URL (MP4, etc.)
- `hlsUrl` (optional): HLS streaming URL
- `source` (optional): "external", "cloudinary", "other"

**Response:**
```json
{
  "message": "TMDB movie video URL added/updated",
  "tmdbMovie": {
    "_id": "...",
    "tmdbId": 550,
    "title": "Fight Club",
    "videoUrl": "https://...",
    "hlsUrl": "https://...",
    "source": "external"
  }
}
```

### Step 3: App Me Check Karo

1. Mobile/Frontend app open karo
2. Wo movie search karo
3. Movie open karo
4. **Green "Play Full Movie" button** dikhega! 🎉

### Testing Ke Liye Sample Video

```json
{
  "tmdbId": 278,
  "title": "Test Movie",
  "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
}
```

---

## 📤 Local Movie Upload Karna

Apni khud ki movies upload karne ke liye (Cloudinary se).

### Prerequisites
- Cloudinary account setup hona chahiye
- `.env` me Cloudinary credentials hone chahiye

### Step 1: Movie Upload Karo

**Using Postman (Recommended):**

1. Method: `POST`
2. URL: `https://netlee-backend.onrender.com/api/admin/upload`
3. Headers:
   - `Authorization: Bearer YOUR_ADMIN_TOKEN`
4. Body: `form-data`
   - `title`: "Movie Title"
   - `description`: "Movie description"
   - `category`: "Action" (ya koi bhi category)
   - `year`: "2024"
   - `duration`: "120" (minutes me)
   - `video`: [Select video file]
   - `thumbnail`: [Select image file]

**Using cURL:**
```bash
curl -X POST https://netlee-backend.onrender.com/api/admin/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "title=My Movie" \
  -F "description=Great movie" \
  -F "category=Action" \
  -F "year=2024" \
  -F "duration=120" \
  -F "video=@/path/to/video.mp4" \
  -F "thumbnail=@/path/to/thumbnail.jpg"
```

**Response:**
```json
{
  "message": "Movie uploaded",
  "movie": {
    "_id": "...",
    "title": "My Movie",
    "description": "Great movie",
    "category": "Action",
    "year": "2024",
    "duration": "120",
    "videoUrl": "https://res.cloudinary.com/...",
    "thumbnail": "https://res.cloudinary.com/...",
    "hlsUrl": "https://res.cloudinary.com/..."
  }
}
```

### Step 2: Uploaded Movies Dekho

```bash
curl -X GET https://netlee-backend.onrender.com/api/admin/movies \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Step 3: Movie Delete Karo (Optional)

```bash
curl -X DELETE https://netlee-backend.onrender.com/api/admin/movie/MOVIE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 👥 User Management

### Get All Users

```bash
curl -X GET https://netlee-backend.onrender.com/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Delete User

```bash
curl -X DELETE https://netlee-backend.onrender.com/api/admin/user/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Change User Role (Make Admin)

```bash
curl -X PUT https://netlee-backend.onrender.com/api/admin/user/USER_ID/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"role": "admin"}'
```

---

## 📊 All Admin Endpoints

### TMDB Movies
- `POST /api/admin/tmdb-movie/video` - Add/Update video URL
- `GET /api/admin/tmdb-movies` - Get all TMDB movies with videos
- `DELETE /api/admin/tmdb-movie/:id` - Delete video URL

### Local Movies
- `POST /api/admin/upload` - Upload movie to Cloudinary
- `GET /api/admin/movies` - Get all uploaded movies
- `DELETE /api/admin/movie/:id` - Delete movie

### User Management
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/user/:id` - Delete user
- `PUT /api/admin/user/:id/role` - Update user role

---

## 🛠️ Quick Scripts

### Bulk Add TMDB Movies

Create file `bulk-add-movies.js`:

```javascript
import axios from 'axios';

const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';
const API_URL = 'https://netlee-backend.onrender.com/api';

const movies = [
  { tmdbId: 550, title: 'Fight Club', videoUrl: 'https://...' },
  { tmdbId: 278, title: 'The Shawshank Redemption', videoUrl: 'https://...' },
  { tmdbId: 238, title: 'The Godfather', videoUrl: 'https://...' },
];

async function addMovies() {
  for (const movie of movies) {
    try {
      const response = await axios.post(
        `${API_URL}/admin/tmdb-movie/video`,
        movie,
        { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
      );
      console.log(`✅ Added: ${movie.title}`);
    } catch (error) {
      console.error(`❌ Failed: ${movie.title}`, error.response?.data);
    }
  }
}

addMovies();
```

Run:
```bash
node bulk-add-movies.js
```

---

## 🔍 Troubleshooting

### Error: "Unauthorized" or "Admin access required"

**Solution:**
- Check karo ki user ka role "admin" hai
- Token sahi hai ya nahi verify karo
- Token expire to nahi ho gaya

### Error: "TMDB ID and video URL are required"

**Solution:**
- `tmdbId` aur `videoUrl` dono required hain
- `tmdbId` number hona chahiye (string nahi)

### Error: "Video upload failed"

**Solution:**
- Cloudinary credentials check karo
- Video file size check karo (Cloudinary free tier me limit hai)
- Video format supported hai ya nahi (MP4 recommended)

### Video Play Nahi Ho Raha

**Solution:**
- Video URL publicly accessible hai ya nahi
- Browser me URL open karke test karo
- CORS headers properly set hain ya nahi

---

## 📝 Best Practices

1. **TMDB Movies**: Pehle TMDB movies use karo (easy hai)
2. **Video URLs**: Publicly accessible URLs use karo
3. **HLS URLs**: Better streaming ke liye HLS URLs add karo
4. **Testing**: Pehle test video se try karo
5. **Backup**: Important movies ka backup rakho
6. **Security**: Admin token ko safe rakho

---

## 🎉 Quick Start

**5 minutes me movie add karo:**

1. **Admin login:**
   ```bash
   curl -X POST https://netlee-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@netlee.com","password":"admin123"}'
   ```

2. **Token copy karo**

3. **Movie add karo:**
   ```bash
   curl -X POST https://netlee-backend.onrender.com/api/admin/tmdb-movie/video \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "tmdbId": 278,
       "title": "Test Movie",
       "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
     }'
   ```

4. **App me check karo!** 🎬

---

**Questions?** Check main README.md for more details!
