import axios from "axios";
import Movie from "../models/Movie.js";

const TMDB_URL = "https://api.themoviedb.org/3";

// --------------------------------------
// LOCAL MOVIE LIST
// --------------------------------------
export const getLocalMovies = async (req, res) => {
    const movies = await Movie.find().sort({
        createdAt: -1
    });
    res.json(movies);
};

// --------------------------------------
// LOCAL MOVIE DETAIL
// --------------------------------------
export const getLocalMovieById = async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({
        message: "Movie not found"
    });
    res.json(movie);
};

// --------------------------------------
// TMDB TRENDING
// --------------------------------------
export const getTrending = async (req, res) => {
    try {
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
        );
        res.json(data.results);
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
};

// --------------------------------------
// TMDB SEARCH
// --------------------------------------
export const searchTMDB = async (req, res) => {
    try {
        const q = req.query.q;
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${q}`
        );
        res.json(data.results);
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
};

// --------------------------------------
// MIXED HOME FEED (Local + TMDB) - ALL DATA IN ONE CALL
// --------------------------------------
export const getHomeFeed = async (req, res) => {
    try {
        console.log("Fetching all home feed data...");

        // Fetch one page from each TMDB category - all in one parallel call
        const [local, trending, popular, topRated, upcoming] = await Promise.all([
            Movie.find().sort({
                createdAt: -1
            }).limit(10),
            axios.get(`${TMDB_URL}/trending/movie/day?api_key=${process.env.TMDB_API_KEY}`),
            axios.get(`${TMDB_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}`),
            axios.get(`${TMDB_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`),
            axios.get(`${TMDB_URL}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`)
        ]);

        const response = {
            local,
            trending: trending.data.results || [],
            popular: popular.data.results || [],
            topRated: topRated.data.results || [],
            upcoming: upcoming.data.results || []
        };

        console.log("Home feed data fetched successfully:", {
            local: response.local.length,
            trending: response.trending.length,
            popular: response.popular.length,
            topRated: response.topRated.length,
            upcoming: response.upcoming.length
        });

        res.json(response);
    } catch (e) {
        console.error("Error fetching home feed:", e.message);
        res.status(500).json({
            error: e.message
        });
    }
};

// --------------------------------------
// TMDB MOVIE DETAILS
// --------------------------------------
export const getTMDBMovieDetails = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos,credits`
        );
        res.json(data);
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
};

// --------------------------------------
// TMDB POPULAR MOVIES
// --------------------------------------
export const getPopularMovies = async (req, res) => {
    try {
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}`
        );
        res.json(data.results);
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
};

// --------------------------------------
// TMDB TOP RATED MOVIES
// --------------------------------------
export const getTopRatedMovies = async (req, res) => {
    try {
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`
        );
        res.json(data.results);
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
};

// --------------------------------------
// TMDB UPCOMING MOVIES
// --------------------------------------
export const getUpcomingMovies = async (req, res) => {
    try {
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`
        );
        res.json(data.results);
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
};