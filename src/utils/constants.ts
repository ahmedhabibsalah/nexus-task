export const API_CONFIG = {
  BASE_URL: "http://www.omdbapi.com",
  POSTER_URL: "http://img.omdbapi.com",
  API_KEY: "9acc9025",
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
} as const;
