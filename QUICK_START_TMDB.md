# 🎬 Quick Start: TMDB Full Movie Button

## ✅ Kya Ready Hai

Aapka "Play Full Movie" button already app mein implemented hai! Bas video URLs add karne hain.

---

## 🚀 Step-by-Step Guide

### Step 1: Server Start Karo
```bash
cd Netlee-Backend
npm start
```

### Step 2: Postman Setup

**Option A: Postman Collection Import Karo**
1. Postman open karo
2. Import → File → `TMDB_Movie_API.postman_collection.json` select karo
3. Collection import ho jayega

**Option B: Manual Setup**
- Base URL: `http://localhost:5000`
- Neeche diye gaye APIs manually add karo

---

### Step 3: Login Karke Token Lo

**Request:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Token copy karo!** Ye har API call mein chahiye.

---

### Step 4: TMDB Movie ID Dhundo

**Mobile App mein:**
1. Koi bhi TMDB movie open karo
2. URL dekho: `/player?id=550&type=tmdb`
3. Yahan `550` TMDB ID hai

**Ya TMDB website se:**
- https://www.themoviedb.org/movie/550 → ID = 550
- https://www.themoviedb.org/movie/278 → ID = 278

---

### Step 5: Video URL Add Karo

**Request:**
```
POST http://localhost:5000/api/admin/tmdb-movie/video
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "tmdbId": 550,
  "title": "Fight Club",
  "videoUrl": "https://example.com/movies/fight-club.mp4",
  "hlsUrl": "https://example.com/movies/fight-club.m3u8"
}
```

**Testing ke liye sample video:**
```json
{
  "tmdbId": 278,
  "title": "Test Movie",
  "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
}
```

**Response:**
```json
{
  "message": "TMDB movie video URL added/updated",
  "tmdbMovie": {
    "_id": "...",
    "tmdbId": 278,
    "title": "Test Movie",
    "videoUrl": "https://...",
    "hasFullMovie": true
  }
}
```

---

### Step 6: App Mein Check Karo

1. Mobile app restart karo (optional)
2. Wo movie open karo jiska video URL add kiya
3. **Green "Play Full Movie" button** dikhega! 🎉
4. Button click karo → Full movie play hoga

---

## 📋 All Available APIs

### 1. Add/Update Video URL
```
POST /api/admin/tmdb-movie/video
Authorization: Bearer TOKEN

Body: { tmdbId, title, videoUrl, hlsUrl, source }
```

### 2. Get All TMDB Movies
```
GET /api/admin/tmdb-movies
Authorization: Bearer TOKEN
```

### 3. Delete Video URL
```
DELETE /api/admin/tmdb-movie/:id
Authorization: Bearer TOKEN
```

### 4. Check Movie Details
```
GET /api/movies/tmdb/:tmdbId
Authorization: Bearer TOKEN
```

---

## 🎯 Quick Test

**1. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

**2. Add Video (Replace TOKEN):**
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

**3. Check in App:**
- TMDB ID 278 wali movie open karo
- Green button dikhega!

---

## 🔍 Troubleshooting

**Button nahi dikh raha?**
- Check karo: Video URL sahi add hua?
  ```
  GET /api/admin/tmdb-movies
  ```
- Check karo: Movie details mein `hasFullMovie: true` hai?
  ```
  GET /api/movies/tmdb/278
  ```
- App restart karo
- Console logs dekho (Player.tsx mein debug info hai)

**Video play nahi ho raha?**
- Video URL publicly accessible hai?
- Browser mein URL open karke check karo
- HLS URL hai to `.m3u8` extension hona chahiye
- MP4 URL hai to direct video file honi chahiye

---

## 📝 Important Notes

- **Token Required:** Har API call mein Authorization header chahiye
- **TMDB ID:** Ye TMDB ka official ID hai (app URL mein milega)
- **Video URLs:** Publicly accessible hone chahiye
- **Update:** Same tmdbId ke liye dubara call karo to URL update ho jayega
- **Testing:** Sample video URLs use kar sakte ho testing ke liye

---

## 🎉 Done!

Ab aap kisi bhi TMDB movie ke liye full video add kar sakte ho aur app mein "Play Full Movie" button automatically show hoga!

**Questions?** Check `API_TMDB_MOVIES.md` for detailed documentation.
