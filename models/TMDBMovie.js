import mongoose from "mongoose";

const tmdbMovieSchema = new mongoose.Schema({
    tmdbId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String
    }, // Full movie video URL (MP4, HLS, etc.)
    hlsUrl: {
        type: String
    }, // HLS stream URL if available
    source: {
        type: String,
        enum: ['cloudinary', 'external', 'other'],
        default: 'external'
    }
}, {
    timestamps: true
});

export default mongoose.model("TMDBMovie", tmdbMovieSchema);

