export const API_CONFIG = {
  BASE_URL: "https://www.omdbapi.com",
  POSTER_URL: "https://img.omdbapi.com",
  API_KEY: "8220c82",
  DEFAULT_POSTER: "/placeholder-movie.jpg",
} as const;

export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  RESULTS_PER_PAGE: 10,
  MAX_RESULTS: 1000,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  API_ERROR: "Unable to fetch data. Please try again later.",
  NO_RESULTS: "No movies found. Try a different search term.",
  INVALID_SEARCH: "Please enter at least 2 characters to search.",
  MOVIE_NOT_FOUND: "Movie details not found.",
  INVALID_API_KEY:
    "API key is not activated. Please check your email and activate your key.",
} as const;
