import omdbApi from "./omdbApi";

export const testOMDbAPI = async () => {
  console.log("🔍 Testing OMDb API integration...");

  try {
    console.log('\n📋 Test 1: Searching for "batman" movies...');
    const searchResults = await omdbApi.searchMovies({ s: "batman" });
    console.log("✅ Search successful:", {
      totalResults: searchResults.totalResults,
      moviesFound: searchResults.Search?.length || 0,
      firstMovie: searchResults.Search?.[0]?.Title || "None",
    });

    if (searchResults.Search && searchResults.Search.length > 0) {
      const firstMovie = searchResults.Search[0];
      console.log("\n🎬 Test 2: Getting details for first movie...");
      const movieDetails = await omdbApi.getMovieById(firstMovie.imdbID);
      console.log("✅ Movie details successful:", {
        title: movieDetails.Title,
        year: movieDetails.Year,
        genre: movieDetails.Genre,
        plot: movieDetails.Plot.substring(0, 100) + "...",
      });
    }

    console.log("\n❌ Test 3: Testing error handling...");
    try {
      await omdbApi.searchMovies({ s: "xyz123impossiblemovietitle" });
    } catch (error) {
      console.log("✅ Error handling works:", (error as Error).message);
    }

    console.log("\n🎉 All API tests completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ API test failed:", error);
    return false;
  }
};

// Uncomment this line to run the test when the file is imported
// testOMDbAPI();
