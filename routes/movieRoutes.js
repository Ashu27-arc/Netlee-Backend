import express from "express";
import {
    getLocalMovies,
    getLocalMovieById,
    getTrending,
    searchTMDB,
    getHomeFeed,
    getTMDBMovieDetails,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies
} from "../controllers/movieController.js";
import {
    protect
} from "../middleware/authMiddleware.js";
import {
    toggleFavorite,
    getFavorites
} from "../controllers/movieController.js";

const router = express.Router();

//Local Movies
router.get("/local", getLocalMovies);
router.get("/local/:id", getLocalMovieById);

//TMDB
router.get("/trending", getTrending);
router.get("/search", searchTMDB);
router.get("/tmdb/:id", getTMDBMovieDetails);
router.get("/popular", getPopularMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/upcoming", getUpcomingMovies);
router.post("/favorite/:id", protect, toggleFavorite);
router.get("/favorites/me", protect, getFavorites);

//Mixed Feed
router.get("/home", getHomeFeed);

export default router;