import mongoose from "mongoose";
import TMDBMovie from "./models/TMDBMovie.js";
import dotenv from "dotenv";

dotenv.config();

// Test movies with sample video URLs
const testMovies = [{
        tmdbId: 278,
        title: "The Shawshank Redemption",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        source: "external"
    },
    {
        tmdbId: 550,
        title: "Fight Club",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        source: "external"
    },
    {
        tmdbId: 238,
        title: "The Godfather",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        source: "external"
    },
    {
        tmdbId: 424,
        title: "Schindler's List",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        source: "external"
    },
    {
        tmdbId: 680,
        title: "Pulp Fiction",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        source: "external"
    }
];

async function addTestMovies() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        console.log("\n📽️  Adding test movies...\n");

        for (const movie of testMovies) {
            try {
                const result = await TMDBMovie.findOneAndUpdate({
                        tmdbId: movie.tmdbId
                    },
                    movie, {
                        upsert: true,
                        new: true
                    }
                );
                console.log(`✅ Added: ${movie.title} (TMDB ID: ${movie.tmdbId})`);
            } catch (err) {
                console.error(`❌ Error adding ${movie.title}:`, err.message);
            }
        }

        console.log("\n🎉 All test movies added successfully!");
        console.log("\n📋 Summary:");
        const allMovies = await TMDBMovie.find();
        console.log(`Total movies in database: ${allMovies.length}`);

        console.log("\n🎬 Movies with full videos:");
        allMovies.forEach(m => {
            console.log(`  - ${m.title} (TMDB ID: ${m.tmdbId})`);
        });

        console.log("\n✨ Ab app mein in movies ko open karo:");
        console.log("   Green 'Play Full Movie' button dikhega! 🎉\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

addTestMovies();