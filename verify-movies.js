import axios from "axios";

const BASE_URL = "http://localhost:5000";

// Test TMDB IDs that we added
const testMovieIds = [278, 550, 238, 424, 680];

async function verifyMovies() {
    console.log("🔍 Verifying TMDB movies...\n");

    for (const tmdbId of testMovieIds) {
        try {
            const response = await axios.get(`${BASE_URL}/api/movies/tmdb/${tmdbId}`);
            const movie = response.data;

            const hasFullMovie = movie.hasFullMovie || false;
            const fullMovieUrl = movie.fullMovieUrl || movie.fullMovieHlsUrl || "Not found";

            console.log(`📽️  ${movie.title || `TMDB ID: ${tmdbId}`}`);
            console.log(`   TMDB ID: ${tmdbId}`);
            console.log(`   Has Full Movie: ${hasFullMovie ? "✅ YES" : "❌ NO"}`);
            if (hasFullMovie) {
                console.log(`   Video URL: ${fullMovieUrl.substring(0, 60)}...`);
                console.log(`   🎉 Green "Play Full Movie" button will show!`);
            }
            console.log("");
        } catch (error) {
            console.error(`❌ Error fetching TMDB ID ${tmdbId}:`, error.message);
            console.log("");
        }
    }

    console.log("✅ Verification complete!");
    console.log("\n📱 Next Steps:");
    console.log("1. Mobile app open karo");
    console.log("2. In movies ko search karo ya trending mein dhundo:");
    console.log("   - The Shawshank Redemption");
    console.log("   - Fight Club");
    console.log("   - The Godfather");
    console.log("   - Schindler's List");
    console.log("   - Pulp Fiction");
    console.log("3. Movie open karo");
    console.log("4. Green 'Play Full Movie' button dikhega! 🎬\n");
}

verifyMovies();