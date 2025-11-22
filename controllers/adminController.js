import Movie from "../models/Movie.js";
import TMDBMovie from "../models/TMDBMovie.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

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
        const {
            tmdbId,
            title,
            videoUrl,
            hlsUrl,
            source
        } = req.body;

        if (!tmdbId || !videoUrl) {
            return res.status(400).json({
                error: "TMDB ID and video URL are required"
            });
        }

        // Find or create TMDB movie entry
        const tmdbMovie = await TMDBMovie.findOneAndUpdate({
            tmdbId: parseInt(tmdbId)
        }, {
            tmdbId: parseInt(tmdbId),
            title: title || `TMDB Movie ${tmdbId}`,
            videoUrl,
            hlsUrl: hlsUrl || null,
            source: source || 'external'
        }, {
            upsert: true,
            new: true
        });

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
        const tmdbMovies = await TMDBMovie.find().sort({
            createdAt: -1
        });
        res.json(tmdbMovies || []);
    } catch (e) {
        console.error("Error fetching TMDB movies:", e.message);
        res.status(500).json({
            error: e.message
        });
    }
};

// ---------- Delete TMDB Movie Video ----------
export const deleteTMDBMovie = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const tmdbMovie = await TMDBMovie.findByIdAndDelete(id);

        if (!tmdbMovie) {
            return res.status(404).json({
                message: "TMDB movie not found"
            });
        }

        res.json({
            message: "TMDB movie deleted successfully",
            tmdbMovie
        });
    } catch (e) {
        console.error("Error deleting TMDB movie:", e.message);
        res.status(500).json({
            error: e.message
        });
    }
};

// ---------- Get All Users ----------
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({
            createdAt: -1
        });
        res.json(users);
    } catch (e) {
        console.error("Error fetching users:", e.message);
        res.status(500).json({
            error: e.message
        });
    }
};

// ---------- Delete User ----------
export const deleteUser = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        // Prevent admin from deleting themselves
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                message: "You cannot delete your own account"
            });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (e) {
        console.error("Error deleting user:", e.message);
        res.status(500).json({
            error: e.message
        });
    }
};

// ---------- Update User Role ----------
export const updateUserRole = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            role
        } = req.body;

        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Must be 'user' or 'admin'"
            });
        }

        // Prevent admin from changing their own role
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                message: "You cannot change your own role"
            });
        }

        const user = await User.findByIdAndUpdate(
            id, {
                role
            }, {
                new: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User role updated successfully",
            user
        });
    } catch (e) {
        console.error("Error updating user role:", e.message);
        res.status(500).json({
            error: e.message
        });
    }
};