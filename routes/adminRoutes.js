import express from "express";
import {
    protect
} from "../middleware/authMiddleware.js";
import {
    uploadMovie,
    getAllMovies,
    deleteMovie,
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

// Get all movies
router.get("/movies", protect, getAllMovies);

// Delete movie
router.delete("/movie/:id", protect, deleteMovie);

export default router;