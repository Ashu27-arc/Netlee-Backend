import Movie from "../models/Movie.js";
import TMDBMovie from "../models/TMDBMovie.js";
import cloudinary from "../config/cloudinary.js";

// ---------- Upload Movie ----------
export const uploadMovie = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            year,
            duration
        } = req.body;

        const videoFile = req.files.video[0];
        const thumbnailFile = req.files.thumbnail[0];

        const videoUrl = videoFile.path;
        const thumbnailUrl = thumbnailFile.path;

        // Cloudinary HLS URL banate hain
        const hlsUrl = videoUrl.replace("/upload/", "/upload/").replace(".mp4", ".m3u8");

        const movie = await Movie.create({
            title,
            description,
            category,
            year,
            duration,
            thumbnail: thumbnailUrl,
            videoUrl: videoUrl,
            hlsUrl,
        });

        res.json({
            message: "Movie uploaded",
            movie
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
};

// ---------- Get All Movies ----------
export const getAllMovies = async (req, res) => {
    const movies = await Movie.find().sort({
        createdAt: -1
    });
    res.json(movies);
};

// ---------- Delete Movie ----------
export const deleteMovie = async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({
        message: "Movie not found"
    });

    // Cloudinary delete
    await cloudinary.uploader.destroy(movie.videoUrl);
    await cloudinary.uploader.destroy(movie.thumbnail);

    await movie.deleteOne();

    res.json({
        message: "Deleted"
    });
};

// ---------- Add/Update TMDB Movie Video URL ----------
export const addTMDBMovieVideo = async (req, res) => {
    try {
        const { tmdbId, title, videoUrl, hlsUrl, source } = req.body;

        if (!tmdbId || !videoUrl) {
            return res.status(400).json({
                error: "TMDB ID and video URL are required"
            });
        }

        // Find or create TMDB movie entry
        const tmdbMovie = await TMDBMovie.findOneAndUpdate(
            { tmdbId: parseInt(tmdbId) },
            {
                tmdbId: parseInt(tmdbId),
                title: title || `TMDB Movie ${tmdbId}`,
                videoUrl,
                hlsUrl: hlsUrl || null,
                source: source || 'external'
            },
            { upsert: true, new: true }
        );

        res.json({
            message: "TMDB movie video URL added/updated",
            tmdbMovie
        });
    } catch (e) {
        console.error("Error adding TMDB movie video:", e.message);
        res.status(500).json({
            error: e.message
        });
    }
};

// ---------- Get All TMDB Movies with Videos ----------
export const getAllTMDBMovies = async (req, res) => {
    try {
        const tmdbMovies = await TMDBMovie.find().sort({ createdAt: -1 });
        res.json(tmdbMovies || []);
    } catch (e) {
        console.error("Error fetching TMDB movies:", e.message);
        res.status(500).json({
            error: e.message
        });
    }
};