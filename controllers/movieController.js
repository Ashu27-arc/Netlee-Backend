import axios from "axios";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import TMDBMovie from "../models/TMDBMovie.js";

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
        if (!process.env.TMDB_API_KEY) {
            return res.status(500).json({
                error: "TMDB API key not configured"
            });
        }
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`,
            { timeout: 10000 }
        );
        res.json(data.results || []);
    } catch (e) {
        console.error("Error fetching trending:", e.message);
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
        if (!process.env.TMDB_API_KEY) {
            return res.status(500).json({
                error: "TMDB API key not configured"
            });
        }
        const q = req.query.q;
        if (!q) {
            return res.status(400).json({
                error: "Search query is required"
            });
        }
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${q}`,
            { timeout: 10000 }
        );
        res.json(data.results || []);
    } catch (e) {
        console.error("Error searching TMDB:", e.message);
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

        // Fetch local movies first (always works)
        const local = await Movie.find().sort({
            createdAt: -1
        }).limit(10);

        // Initialize response with local movies
        const response = {
            local: local || [],
            trending: [],
            popular: [],
            topRated: [],
            upcoming: []
        };

        // Fetch TMDB data with error handling for each category
        if (process.env.TMDB_API_KEY) {
            try {
                const trendingRes = await axios.get(
                    `${TMDB_URL}/trending/movie/day?api_key=${process.env.TMDB_API_KEY}`,
                    { timeout: 10000 }
                );
                response.trending = trendingRes.data?.results || [];
            } catch (err) {
                console.error("Error fetching trending:", err.message);
            }

            try {
                const popularRes = await axios.get(
                    `${TMDB_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}`,
                    { timeout: 10000 }
                );
                response.popular = popularRes.data?.results || [];
            } catch (err) {
                console.error("Error fetching popular:", err.message);
            }

            try {
                const topRatedRes = await axios.get(
                    `${TMDB_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`,
                    { timeout: 10000 }
                );
                response.topRated = topRatedRes.data?.results || [];
            } catch (err) {
                console.error("Error fetching top rated:", err.message);
            }

            try {
                const upcomingRes = await axios.get(
                    `${TMDB_URL}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`,
                    { timeout: 10000 }
                );
                response.upcoming = upcomingRes.data?.results || [];
            } catch (err) {
                console.error("Error fetching upcoming:", err.message);
            }
        } else {
            console.warn("TMDB_API_KEY not found in environment variables");
        }

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
        // Even if there's an error, return at least local movies
        try {
            const local = await Movie.find().sort({
                createdAt: -1
            }).limit(10);
            res.json({
                local: local || [],
                trending: [],
                popular: [],
                topRated: [],
                upcoming: []
            });
        } catch (dbError) {
            res.status(500).json({
                error: e.message
            });
        }
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

        if (!process.env.TMDB_API_KEY) {
            return res.status(500).json({
                error: "TMDB API key not configured"
            });
        }

        const {
            data
        } = await axios.get(
            `${TMDB_URL}/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=videos,credits`,
            { timeout: 10000 }
        );
        
        // Check if full movie video URL exists in database (with error handling)
        try {
            const tmdbMovie = await TMDBMovie.findOne({ tmdbId: parseInt(id) });
            if (tmdbMovie && (tmdbMovie.videoUrl || tmdbMovie.hlsUrl)) {
                // Add full movie video URLs to response
                data.fullMovieUrl = tmdbMovie.videoUrl;
                data.fullMovieHlsUrl = tmdbMovie.hlsUrl;
                data.hasFullMovie = true;
            } else {
                data.hasFullMovie = false;
            }
        } catch (dbError) {
            console.error("Error checking TMDB movie in database:", dbError.message);
            data.hasFullMovie = false;
        }
        
        res.json(data);
    } catch (e) {
        console.error("Error fetching TMDB movie details:", e.message);
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
        if (!process.env.TMDB_API_KEY) {
            return res.status(500).json({
                error: "TMDB API key not configured"
            });
        }
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}`,
            { timeout: 10000 }
        );
        res.json(data.results || []);
    } catch (e) {
        console.error("Error fetching popular movies:", e.message);
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
        if (!process.env.TMDB_API_KEY) {
            return res.status(500).json({
                error: "TMDB API key not configured"
            });
        }
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`,
            { timeout: 10000 }
        );
        res.json(data.results || []);
    } catch (e) {
        console.error("Error fetching top rated movies:", e.message);
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
        if (!process.env.TMDB_API_KEY) {
            return res.status(500).json({
                error: "TMDB API key not configured"
            });
        }
        const {
            data
        } = await axios.get(
            `${TMDB_URL}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`,
            { timeout: 10000 }
        );
        res.json(data.results || []);
    } catch (e) {
        console.error("Error fetching upcoming movies:", e.message);
        res.status(500).json({
            error: e.message
        });
    }
};

// 🩶❤️ TOGGLE FAVORITE
export const toggleFavorite = async (req, res) => {
    const movieId = req.params.id;
    const user = await User.findById(req.user._id);

    const exists = user.favorites.includes(movieId);

    if (exists) {
        user.favorites = user.favorites.filter((id) => id !== movieId);
    } else {
        user.favorites.push(movieId);
    }

    await user.save();

    res.json({
        favorites: user.favorites
    });
};

// 💖 GET MY FAVORITES MOVIES
export const getFavorites = async (req, res) => {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
};