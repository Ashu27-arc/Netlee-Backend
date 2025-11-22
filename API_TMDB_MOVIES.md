# TMDB Movie Full Video API Documentation

## Overview
Ye APIs TMDB movies ke liye full movie video URLs add karne ke liye hain. Jab aap kisi TMDB movie ke liye video URL add karoge, tab app mein "Play Full Movie" button show hoga.

---

## 🔐 Authentication
Sabhi endpoints ko **Bearer Token** chahiye. Login karke token lo aur headers mein bhejo:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📌 API Endpoints

### 1. Add/Update TMDB Movie Video URL
**Endpoint:** `POST /api/admin/tmdb-movie/video`

**Description:** TMDB movie ke liye full movie video URL add ya update karo.

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

**Response:**
```json
{
  "message": "TMDB movie video URL added/updated",
  "tmdbMovie": {
    "_id": "...",
    "tmdbId": 550,
    "title": "Fight Club",
    "videoUrl": "https://example.com/movies/fight-club.mp4",
    "hlsUrl": "https://example.com/movies/fight-club.m3u8",
    "source": "external",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/admin/tmdb-movie/video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tmdbId": 550,
    "title": "Fight Club",
    "videoUrl": "https://example.com/movies/fight-club.mp4",
    "hlsUrl": "https://example.com/movies/fight-club.m3u8"
  }'
```

---

### 2. Get All TMDB Movies with Videos
**Endpoint:** `GET /api/admin/tmdb-movies`

**Description:** Sabhi TMDB movies jo database mein video URLs ke saath saved hain.

**Response:**
```json
[
  {
    "_id": "...",
    "tmdbId": 550,
    "title": "Fight Club",
    "videoUrl": "https://example.com/movies/fight-club.mp4",
    "hlsUrl": "https://example.com/movies/fight-club.m3u8",
    "source": "external",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/admin/tmdb-movies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Delete TMDB Movie Video
**Endpoint:** `DELETE /api/admin/tmdb-movie/:id`

**Description:** Database se TMDB movie video entry delete karo.

**Parameters:**
- `id`: MongoDB document ID (not TMDB ID)

**Response:**
```json
{
  "message": "TMDB movie deleted successfully",
  "tmdbMovie": {
    "_id": "...",
    "tmdbId": 550,
    "title": "Fight Club"
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/admin/tmdb-movie/MONGODB_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎬 How It Works

1. **TMDB ID dhundo:** App mein kisi bhi movie ko open karo, URL mein TMDB ID milega
   - Example: `/player?id=550&type=tmdb` → TMDB ID = 550

2. **Video URL add karo:** Upar wale API se movie ka video URL add karo

3. **App mein check karo:** Ab jab wo movie open karoge, "Play Full Movie" button (green) show hoga instead of "Play Trailer" (red)

---

## 📝 Notes

- Agar same `tmdbId` ke liye dubara API call karoge, to video URL update ho jayega
- `hlsUrl` optional hai, sirf `videoUrl` bhi kaam karega
- Video URLs publicly accessible hone chahiye
- App automatically detect karega ki kaunsi movie ke paas full video hai

---

## 🧪 Testing

**Postman se test karne ke liye:**

1. Login API call karke token lo
2. Token ko Authorization header mein add karo
3. POST request bhejo with movie details
4. App mein wo movie open karo
5. Green "Play Full Movie" button dikhega

**Example Test Data:**
```json
{
  "tmdbId": 278,
  "title": "The Shawshank Redemption",
  "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
}
```
(Ye sample video URL hai testing ke liye)
