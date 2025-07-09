import { useState, useCallback } from "react";
import omdbApi from "../../../services/omdbApi";
import { formatApiError } from "../../../utils/apiUtils";
import type { MovieDetails } from "../../../types/movie";

interface UseMovieDetailsReturn {
  movieDetails: MovieDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchMovieDetails: (imdbId: string) => Promise<void>;
  clearDetails: () => void;
}

export const useMovieDetails = (): UseMovieDetailsReturn => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovieDetails = useCallback(async (imdbId: string) => {
    if (!imdbId) {
      setError("Invalid movie ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const details = await omdbApi.getMovieById(imdbId);
      setMovieDetails(details);
    } catch (err) {
      const errorMessage = formatApiError(err as Error);
      setError(errorMessage);
      setMovieDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearDetails = useCallback(() => {
    setMovieDetails(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    movieDetails,
    isLoading,
    error,
    fetchMovieDetails,
    clearDetails,
  };
};
