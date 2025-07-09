import { useState, useEffect, useCallback } from "react";
import "./index.css";
import { SearchBar } from "./features/search/components/SearchBar";
import { SearchResults } from "./features/search/components/SearchResults";
import { MovieDetails } from "./features/movie-details/components/MovieDetails";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { ErrorMessage } from "./components/ui/ErrorMessage";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { useMovieSearch } from "./features/search/hooks/useMovieSearch";
import { useMovieDetails } from "./features/movie-details/hooks/useMovieDetails";
import { scrollToTop } from "./utils/apiUtils";
import type { Movie } from "./types/movie";

type AppView = "search" | "details";

function App() {
  const [currentView, setCurrentView] = useState<AppView>("search");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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

  const {
    movieDetails,
    isLoading: isDetailsLoading,
    error: detailsError,
    fetchMovieDetails,
    clearDetails,
  } = useMovieDetails();

  const handleMovieClick = useCallback(
    async (movie: Movie) => {
      try {
        console.log("🎬 Movie clicked:", movie.Title);
        setSelectedMovie(movie);
        setCurrentView("details");
        scrollToTop();
        await fetchMovieDetails(movie.imdbID);
      } catch (error) {
        console.error("Error handling movie click:", error);
      }
    },
    [fetchMovieDetails]
  );

  const handleBackToSearch = useCallback(() => {
    console.log("⬅️ Going back to search");
    setCurrentView("search");
    setSelectedMovie(null);
    clearDetails();
    scrollToTop();
  }, [clearDetails]);

  const handleClearSearch = useCallback(() => {
    console.log("🧹 Clearing search");
    clearResults();
    setSelectedMovie(null);
    clearDetails();
    setCurrentView("search");
  }, [clearResults, clearDetails]);
  const handleRetryDetails = useCallback(() => {
    if (selectedMovie) {
      console.log("🔄 Retrying details for:", selectedMovie.Title);
      fetchMovieDetails(selectedMovie.imdbID);
    }
  }, [selectedMovie, fetchMovieDetails]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).tagName === "INPUT") {
        return;
      }

      if (event.key === "Escape" && currentView === "details") {
        console.log("⌨️ Escape pressed - going back");
        handleBackToSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentView, handleBackToSearch]);

  useEffect(() => {
    const handlePopState = () => {
      if (currentView === "details") {
        handleBackToSearch();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentView, handleBackToSearch]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Movie Search App
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Discover movies powered by OMDb API
            </p>
          </header>

          {currentView === "details" && selectedMovie && (
            <nav className="mb-6" aria-label="Breadcrumb">
              <div className="flex items-center text-sm text-gray-500">
                <button
                  onClick={handleBackToSearch}
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  aria-label="Go back to search results">
                  Search Results
                </button>
                <span className="mx-2" aria-hidden="true">
                  /
                </span>
                <span className="text-gray-900" aria-current="page">
                  {selectedMovie.Title}
                </span>
              </div>
            </nav>
          )}

          <main>
            {currentView === "search" && (
              <>
                <div className="mb-8">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onClear={handleClearSearch}
                    isLoading={isSearchLoading}
                    placeholder="Search for movies, TV shows, and more..."
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
                  <LoadingSpinner
                    size="lg"
                    message="Loading movie details..."
                  />
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
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                          <svg
                            className="w-full h-full"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Details Unavailable
                        </h3>
                        <p className="text-gray-600 mb-4">
                          We couldn't load details for "{selectedMovie.Title}"
                        </p>
                        <button
                          onClick={handleBackToSearch}
                          className="btn-primary">
                          Back to Search Results
                        </button>
                      </div>
                    </div>
                  )}
              </>
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
