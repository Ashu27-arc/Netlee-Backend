import Movie from "../models/Movie.js";
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