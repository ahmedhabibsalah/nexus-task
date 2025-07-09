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
      className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.Title}`}>
      <div className="relative h-72 sm:h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-300 w-full h-full"></div>
          </div>
        )}

        {showPlaceholder ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <svg
                className="h-16 w-16 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-500 font-medium">No Poster</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={posterUrl}
              alt={`${movie.Title} poster`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: imageLoading ? "none" : "block" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        )}

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 backdrop-blur-sm">
            {movie.Type}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {movie.Title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {movie.Year}
          </span>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500 font-mono">
          IMDb ID: {movie.imdbID}
        </div>
      </div>
    </div>
  );
};
