// src/App.tsx
import React, { useState, useEffect } from "react";
import "./index.css";
import { SearchBar } from "./features/search/components/SearchBar";
import { SearchResults } from "./features/search/components/SearchResults";
import { MovieDetails } from "./features/movie-details/components/MovieDetails";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { ErrorMessage } from "./components/ui/ErrorMessage";
import { useMovieSearch } from "./features/search/hooks/useMovieSearch";
import { useMovieDetails } from "./features/movie-details/hooks/useMovieDetails";
import type { Movie } from "./types/movie";

type AppView = "search" | "details";

function App() {
  const [currentView, setCurrentView] = useState<AppView>("search");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Search functionality
  const {
    movies,
    isLoading: isSearchLoading,
    error: searchError,
    totalResults,
    searchTerm,
    setSearchTerm,
    loadNextPage,
    hasMoreResults,
    clearResults,
  } = useMovieSearch();

  // Movie details functionality
  const {
    movieDetails,
    isLoading: isDetailsLoading,
    error: detailsError,
    fetchMovieDetails,
    clearDetails,
  } = useMovieDetails();

  // Handle movie card click
  const handleMovieClick = async (movie: Movie) => {
    console.log("🎬 Movie clicked:", movie.Title);
    setSelectedMovie(movie);
    setCurrentView("details");
    await fetchMovieDetails(movie.imdbID);
  };

  // Handle back to search
  const handleBackToSearch = () => {
    console.log("⬅️ Going back to search");
    setCurrentView("search");
    setSelectedMovie(null);
    clearDetails();
  };

  // Handle search clear
  const handleClearSearch = () => {
    console.log("🧹 Clearing search");
    clearResults();
    setSelectedMovie(null);
    clearDetails();
    setCurrentView("search");
  };

  // Handle retry for details
  const handleRetryDetails = () => {
    if (selectedMovie) {
      console.log("🔄 Retrying details for:", selectedMovie.Title);
      fetchMovieDetails(selectedMovie.imdbID);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && currentView === "details") {
        console.log("⌨️ Escape pressed - going back");
        handleBackToSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentView]);

  // Debug logging
  useEffect(() => {
    console.log("🔍 Search state:", {
      moviesCount: movies.length,
      isLoading: isSearchLoading,
      error: searchError,
      searchTerm,
    });
  }, [movies, isSearchLoading, searchError, searchTerm]);

  useEffect(() => {
    console.log("🎭 Details state:", {
      hasDetails: !!movieDetails,
      isLoading: isDetailsLoading,
      error: detailsError,
    });
  }, [movieDetails, isDetailsLoading, detailsError]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Movie Search App
          </h1>
          <p className="text-gray-600">Discover movies powered by OMDb API</p>

          <div className="mt-2 text-xs text-gray-400">
            Current View: {currentView} | Movies: {movies.length} | Selected:{" "}
            {selectedMovie?.Title || "None"}
          </div>
        </div>

        {currentView === "details" && selectedMovie && (
          <div className="mb-6">
            <nav className="flex items-center text-sm text-gray-500">
              <button
                onClick={handleBackToSearch}
                className="hover:text-blue-600 transition-colors">
                Search Results
              </button>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{selectedMovie.Title}</span>
            </nav>
          </div>
        )}

        {currentView === "search" && (
          <>
            <div className="mb-8">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={handleClearSearch}
                isLoading={isSearchLoading}
                placeholder="Try searching for 'batman', 'avengers', or 'star wars'..."
              />
            </div>

            <SearchResults
              movies={movies}
              isLoading={isSearchLoading}
              error={searchError}
              totalResults={totalResults}
              hasMoreResults={hasMoreResults}
              onMovieClick={handleMovieClick}
              onLoadMore={loadNextPage}
            />
          </>
        )}

        {currentView === "details" && (
          <>
            {isDetailsLoading && (
              <LoadingSpinner size="lg" message="Loading movie details..." />
            )}

            {detailsError && (
              <ErrorMessage
                message={detailsError}
                onRetry={handleRetryDetails}
              />
            )}

            {movieDetails && !isDetailsLoading && !detailsError && (
              <MovieDetails
                movieDetails={movieDetails}
                onBack={handleBackToSearch}
                isLoading={isDetailsLoading}
              />
            )}

            {!movieDetails &&
              !isDetailsLoading &&
              !detailsError &&
              selectedMovie && (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    No details available for {selectedMovie.Title}
                  </p>
                  <button onClick={handleBackToSearch} className="btn-primary">
                    Back to Search
                  </button>
                </div>
              )}
          </>
        )}

        <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow-lg text-xs space-y-1">
          <div className="font-bold">Quick Test:</div>
          <button
            onClick={() => setSearchTerm("batman")}
            className="block w-full text-left text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">
            Search "batman"
          </button>
          <button
            onClick={() => setSearchTerm("avengers")}
            className="block w-full text-left text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">
            Search "avengers"
          </button>
          <button
            onClick={handleClearSearch}
            className="block w-full text-left text-red-600 hover:bg-red-50 px-2 py-1 rounded">
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
