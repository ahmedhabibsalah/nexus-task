import React, { memo, useMemo, useCallback } from "react";
import { MovieCard } from "./MovieCard";
import type { Movie } from "../../../types/movie";

interface SearchResultsProps {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  hasMoreResults: boolean;
  onMovieClick: (movie: Movie) => void;
  onLoadMore: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = memo(
  ({
    movies,
    isLoading,
    error,
    totalResults,
    hasMoreResults,
    onMovieClick,
    onLoadMore,
  }) => {
    const skeletonCount = useMemo(() => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        if (width < 640) return 6;
        if (width < 768) return 8;
        if (width < 1024) return 9;
        if (width < 1280) return 12;
        return 15;
      }
      return 10;
    }, []);
    const LoadingSkeleton = useMemo(
      () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: skeletonCount }, (_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-72 sm:h-80 bg-gray-300"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-300 rounded mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ),
      [skeletonCount]
    );

    const ErrorState = useMemo(
      () => (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 text-red-400">
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
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 leading-relaxed">{error}</p>
          </div>
        </div>
      ),
      [error]
    );

    const EmptyState = useMemo(
      () => (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 text-gray-400">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Start your movie discovery
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Use the search bar above to find your favorite movies, TV shows,
              and more.
            </p>
          </div>
        </div>
      ),
      []
    );

    const resultsHeader = useMemo(
      () => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
            <p className="text-gray-600 mt-1">
              Found {totalResults.toLocaleString()}{" "}
              {totalResults === 1 ? "result" : "results"}
              {movies.length < totalResults && ` (showing ${movies.length})`}
            </p>
          </div>

          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {movies.length} loaded
            </span>
          </div>
        </div>
      ),
      [totalResults, movies.length]
    );

    const handleMovieClick = useCallback(
      (movie: Movie) => {
        onMovieClick(movie);
      },
      [onMovieClick]
    );

    const loadMoreButton = useMemo(() => {
      if (!hasMoreResults) return null;

      return (
        <div className="text-center pt-8 border-t border-gray-200">
          <div className="space-y-4">
            <p className="text-gray-600">
              {totalResults - movies.length} more results available
            </p>
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-md hover:shadow-lg">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading more...
                </>
              ) : (
                <>
                  Load {Math.min(10, totalResults - movies.length)} More Movies
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      );
    }, [hasMoreResults, totalResults, movies.length, isLoading, onLoadMore]);

    if (error) {
      return ErrorState;
    }

    if (isLoading && movies.length === 0) {
      return (
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center text-blue-600">
              <div className="animate-spin h-5 w-5 mr-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              Searching for movies...
            </div>
          </div>
          {LoadingSkeleton}
        </div>
      );
    }

    if (!isLoading && movies.length === 0) {
      return EmptyState;
    }

    return (
      <div className="space-y-8">
        {resultsHeader}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie, index) => (
            <MovieCard
              key={`${movie.imdbID}-${index}`}
              movie={movie}
              onClick={handleMovieClick}
            />
          ))}
        </div>

        {loadMoreButton}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.movies.length === nextProps.movies.length &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.error === nextProps.error &&
      prevProps.totalResults === nextProps.totalResults &&
      prevProps.hasMoreResults === nextProps.hasMoreResults &&
      prevProps.movies.every(
        (movie, index) => movie.imdbID === nextProps.movies[index]?.imdbID
      )
    );
  }
);
