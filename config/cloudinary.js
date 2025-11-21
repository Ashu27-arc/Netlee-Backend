import {
    v2 as cloudinary
} from "cloudinary";
import {
    CloudinaryStorage
} from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// VIDEO STORAGE - MP4 Upload
export const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "netflix/videos",
        resource_type: "video",
        allowed_formats: ["mp4", "mkv"],
    },
});

// IMAGE STORAGE - Thumbnail Upload
export const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "netflix/thumbnails",
        resource_type: "image",
    },
});

export const uploadVideo = multer({
    storage: videoStorage
});
export const uploadImage = multer({
    storage: imageStorage
});

export default cloudinary;