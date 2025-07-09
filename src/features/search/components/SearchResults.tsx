import React from "react";
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

export const SearchResults: React.FC<SearchResultsProps> = ({
  movies,
  isLoading,
  error,
  totalResults,
  hasMoreResults,
  onMovieClick,
  onLoadMore,
}) => {
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="h-64 bg-gray-300"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg
            className="h-16 w-16 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading && movies.length === 0) {
    return <LoadingSkeleton />;
  }

  if (!isLoading && movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start your search
          </h3>
          <p className="text-gray-600">
            Enter a movie title above to see results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
        <p className="text-sm text-gray-600">
          Found {totalResults.toLocaleString()}{" "}
          {totalResults === 1 ? "result" : "results"}
          {movies.length < totalResults && ` (showing ${movies.length})`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={`${movie.imdbID}-${index}`}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
      </div>

      {hasMoreResults && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <span className="flex items-center">
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
                Loading...
              </span>
            ) : (
              `Load More Movies (${totalResults - movies.length} remaining)`
            )}
          </button>
        </div>
      )}
    </div>
  );
};
