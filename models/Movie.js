import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    thumbnail: {
        type: String
    }, // from Cloudinary
    videoUrl: {
        type: String
    }, // Cloudinary MP4 URL
    hlsUrl: {
        type: String
    }, // Cloudinary HLS (.m3u8) URL
    category: {
        type: String
    },
    year: {
        type: Number
    },
    duration: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model("Movie", movieSchema);