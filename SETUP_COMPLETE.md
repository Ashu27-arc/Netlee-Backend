# ✅ Setup Complete! Play Full Movie Button Ready 🎬

## 🎉 Kya Kya Ho Gaya

### ✅ Backend APIs Ready
- `POST /api/admin/tmdb-movie/video` - Add/Update video URLs
- `GET /api/admin/tmdb-movies` - Get all movies with videos
- `DELETE /api/admin/tmdb-movie/:id` - Delete video URL
- `GET /api/movies/tmdb/:id` - Get movie details (with hasFullMovie flag)

### ✅ Test Data Added
5 popular movies ke liye full video URLs add ho gaye hain:

1. **The Shawshank Redemption** (TMDB ID: 278) ✅
2. **Fight Club** (TMDB ID: 550) ✅
3. **The Godfather** (TMDB ID: 238) ✅
4. **Schindler's List** (TMDB ID: 424) ✅
5. **Pulp Fiction** (TMDB ID: 680) ✅

### ✅ Frontend Already Implemented
- Green "Play Full Movie" button already coded
- Automatically shows when video URL available
- Plays full movie on click

---

## 📱 Ab Kya Karna Hai

### Step 1: Mobile App Open Karo
```bash
cd Netlee-Mobile
npm start
```

### Step 2: In Movies Ko Dhundo
App mein search karo ya trending section mein dekho:
- The Shawshank Redemption
- Fight Club
- The Godfather
- Schindler's List
- Pulp Fiction

### Step 3: Movie Open Karo
Koi bhi movie click karo

### Step 4: Play Full Movie! 🎬
**Green "Play Full Movie" button** dikhega instead of red "Play Trailer" button!

---

## 🛠️ Useful Scripts

### Add More Test Movies
```bash
node add-test-movies.js
```

### Verify Movies
```bash
node verify-movies.js
```

### Check Database
```bash
# Using MongoDB Compass or CLI
# Collection: tmdbmovies
# Database: moviesdb
```

---

## 📋 Add More Movies (Manual)

### Using Postman:
1. Import `TMDB_Movie_API.postman_collection.json`
2. Login to get token
3. Use "Add TMDB Movie Video" request
4. Change tmdbId and videoUrl
5. Send!

### Using cURL:
```bash
# Login first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password"}'

# Add movie (replace TOKEN and details)
curl -X POST http://localhost:5000/api/admin/tmdb-movie/video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "tmdbId": 155,
    "title": "The Dark Knight",
    "videoUrl": "https://your-video-url.mp4"
  }'
```

---

## 🎯 How to Find TMDB IDs

### Method 1: From App
1. Open any movie in app
2. Check URL: `/player?id=550&type=tmdb`
3. The number (550) is TMDB ID

### Method 2: From TMDB Website
1. Go to https://www.themoviedb.org/
2. Search for movie
3. URL will be: `https://www.themoviedb.org/movie/550-fight-club`
4. The number (550) is TMDB ID

---

## 🔍 Troubleshooting

### Button Not Showing?
```bash
# Check if movie is in database
node verify-movies.js

# Or check API directly
curl http://localhost:5000/api/movies/tmdb/278
# Should show: "hasFullMovie": true
```

### Video Not Playing?
- Make sure video URL is publicly accessible
- Try opening URL in browser
- Check if it's a valid video format (MP4, HLS)

### Need to Remove a Movie?
```bash
# Get all movies with IDs
curl http://localhost:5000/api/admin/tmdb-movies \
  -H "Authorization: Bearer TOKEN"

# Delete by MongoDB _id (not TMDB ID)
curl -X DELETE http://localhost:5000/api/admin/tmdb-movie/MONGODB_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## 📚 Documentation Files

- `API_TMDB_MOVIES.md` - Complete API documentation
- `QUICK_START_TMDB.md` - Step-by-step guide
- `test-tmdb-api.http` - REST Client test file
- `TMDB_Movie_API.postman_collection.json` - Postman collection
- `add-test-movies.js` - Script to add test data
- `verify-movies.js` - Script to verify setup

---

## 🎉 That's It!

Aapka "Play Full Movie" button ab fully functional hai!

**Test karo:**
1. App open karo
2. "Fight Club" ya "The Shawshank Redemption" search karo
3. Movie open karo
4. Green button dekho aur click karo! 🎬

**Questions?** Check the documentation files above! 😊
