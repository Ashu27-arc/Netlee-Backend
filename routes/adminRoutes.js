import express from "express";
import {
    protect,
    adminOnly
} from "../middleware/authMiddleware.js";
import {
    uploadMovie,
    getAllMovies,
    deleteMovie,
    addTMDBMovieVideo,
    getAllTMDBMovies,
    deleteTMDBMovie,
    getAllUsers,
    deleteUser,
    updateUserRole,
} from "../controllers/adminController.js";

import {
    uploadVideo,
    uploadImage,
} from "../config/cloudinary.js";

const router = express.Router();

// Upload movie (Admin only)
router.post(
    "/upload",
    protect,
    adminOnly,
    uploadVideo.fields([{
        name: "video",
        maxCount: 1
    }, ]),
    uploadImage.fields([{
        name: "thumbnail",
        maxCount: 1
    }]),
    uploadMovie
);

// Get all movies (Admin only)
router.get("/movies", protect, adminOnly, getAllMovies);

// Delete movie (Admin only)
router.delete("/movie/:id", protect, adminOnly, deleteMovie);

// Add/Update TMDB movie video URL (Admin only)
router.post("/tmdb-movie/video", protect, adminOnly, addTMDBMovieVideo);

// Get all TMDB movies with videos (Admin only)
router.get("/tmdb-movies", protect, adminOnly, getAllTMDBMovies);

// Delete TMDB movie video (Admin only)
router.delete("/tmdb-movie/:id", protect, adminOnly, deleteTMDBMovie);

// User Management Routes (Admin only)
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/user/:id", protect, adminOnly, deleteUser);
router.put("/user/:id/role", protect, adminOnly, updateUserRole);

export default router;