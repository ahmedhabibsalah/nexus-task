import React, { useState } from "react";
import type { MovieDetails as MovieDetailsType } from "../../../types/movie";
import { getPosterUrl } from "../../../utils/apiUtils";

interface MovieDetailsProps {
  movieDetails: MovieDetailsType;
  onBack: () => void;
  isLoading?: boolean;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movieDetails,
  onBack,
  isLoading = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleBackClick = () => {
    onBack();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onBack();
    }
  };

  const posterUrl = getPosterUrl(movieDetails.Poster);
  const showPlaceholder = imageError || movieDetails.Poster === "N/A";

  const ratings = movieDetails.Ratings || [];
  const imdbRating =
    movieDetails.imdbRating !== "N/A" ? movieDetails.imdbRating : null;
  const metascore =
    movieDetails.Metascore !== "N/A" ? movieDetails.Metascore : null;

  return (
    <div className="max-w-6xl mx-auto" onKeyDown={handleKeyDown} tabIndex={-1}>
      <button
        onClick={handleBackClick}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        disabled={isLoading}>
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Search Results
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4">
            <div className="relative h-96 md:h-full bg-gray-200">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse bg-gray-300 w-full h-full"></div>
                </div>
              )}

              {showPlaceholder ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <svg
                      className="h-16 w-16 text-gray-400 mx-auto mb-4"
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
                    <p className="text-gray-500">No Poster Available</p>
                  </div>
                </div>
              ) : (
                <img
                  src={posterUrl}
                  alt={`${movieDetails.Title} poster`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  style={{ display: imageLoading ? "none" : "block" }}
                />
              )}
            </div>
          </div>

          <div className="md:w-2/3 lg:w-3/4 p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {movieDetails.Title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">{movieDetails.Year}</span>
                <span>{movieDetails.Rated}</span>
                <span>{movieDetails.Runtime}</span>
                <span className="capitalize">{movieDetails.Type}</span>
              </div>
            </div>

            {(imdbRating || metascore || ratings.length > 0) && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ratings
                </h3>
                <div className="flex flex-wrap gap-4">
                  {imdbRating && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <div className="text-sm font-medium text-yellow-800">
                        IMDb
                      </div>
                      <div className="text-lg font-bold text-yellow-900">
                        {imdbRating}/10
                      </div>
                    </div>
                  )}
                  {metascore && (
                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div className="text-sm font-medium text-green-800">
                        Metascore
                      </div>
                      <div className="text-lg font-bold text-green-900">
                        {metascore}/100
                      </div>
                    </div>
                  )}
                  {ratings.map((rating, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      <div className="text-sm font-medium text-blue-800">
                        {rating.Source}
                      </div>
                      <div className="text-lg font-bold text-blue-900">
                        {rating.Value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movieDetails.Genre && movieDetails.Genre !== "N/A" && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movieDetails.Genre.split(", ").map((genre, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movieDetails.Plot && movieDetails.Plot !== "N/A" && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Plot
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {movieDetails.Plot}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {movieDetails.Director && movieDetails.Director !== "N/A" && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Director
                  </h4>
                  <p className="text-gray-900">{movieDetails.Director}</p>
                </div>
              )}
              {movieDetails.Writer && movieDetails.Writer !== "N/A" && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Writer
                  </h4>
                  <p className="text-gray-900">{movieDetails.Writer}</p>
                </div>
              )}
            </div>

            {movieDetails.Actors && movieDetails.Actors !== "N/A" && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Cast
                </h4>
                <p className="text-gray-900">{movieDetails.Actors}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {movieDetails.Released && movieDetails.Released !== "N/A" && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Released:{" "}
                  </span>
                  <span className="text-gray-900">{movieDetails.Released}</span>
                </div>
              )}
              {movieDetails.Language && movieDetails.Language !== "N/A" && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Language:{" "}
                  </span>
                  <span className="text-gray-900">{movieDetails.Language}</span>
                </div>
              )}
              {movieDetails.Country && movieDetails.Country !== "N/A" && (
                <div>
                  <span className="font-semibold text-gray-700">Country: </span>
                  <span className="text-gray-900">{movieDetails.Country}</span>
                </div>
              )}
              {movieDetails.BoxOffice && movieDetails.BoxOffice !== "N/A" && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Box Office:{" "}
                  </span>
                  <span className="text-gray-900">
                    {movieDetails.BoxOffice}
                  </span>
                </div>
              )}
              {movieDetails.Awards && movieDetails.Awards !== "N/A" && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-gray-700">Awards: </span>
                  <span className="text-gray-900">{movieDetails.Awards}</span>
                </div>
              )}
            </div>

            {movieDetails.imdbID && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <a
                  href={`https://www.imdb.com/title/${movieDetails.imdbID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View on IMDb
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
