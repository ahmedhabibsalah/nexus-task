import React, { useState } from "react";
import { getPosterUrl } from "../../../utils/apiUtils";
import type { Movie } from "../../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleClick = () => {
    onClick(movie);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(movie);
    }
  };

  const posterUrl = getPosterUrl(movie.Poster);
  const showPlaceholder = imageError || movie.Poster === "N/A";

  return (
    <div
      className="card cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.Title}`}>
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-300 w-full h-full"></div>
          </div>
        )}

        {showPlaceholder ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <svg
                className="h-12 w-12 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          </div>
        ) : (
          <img
            src={posterUrl}
            alt={`${movie.Title} poster`}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? "none" : "block" }}
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
          {movie.Title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">{movie.Year}</span>
          <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">
            {movie.Type}
          </span>
        </div>

        <div className="mt-2 text-xs text-gray-500">IMDb: {movie.imdbID}</div>
      </div>
    </div>
  );
};
