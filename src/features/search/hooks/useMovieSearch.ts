import { useState, useEffect, useCallback } from "react";

import omdbApi from "../../../services/omdbApi";
import { validateSearchTerm, formatApiError } from "../../../utils/apiUtils";
import { SEARCH_CONFIG, ERROR_MESSAGES } from "../../../utils/constants";
import { useDebounce } from "../../../hooks/useDebounce";
import type { Movie } from "../../../types/movie";
import type { SearchParams } from "../../../types/api";

interface UseMovieSearchReturn {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  loadNextPage: () => void;
  hasMoreResults: boolean;
  clearResults: () => void;
}

export const useMovieSearch = (): UseMovieSearchReturn => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(
    searchTerm,
    SEARCH_CONFIG.DEBOUNCE_DELAY
  );

  const hasMoreResults = movies.length < totalResults && totalResults > 0;

  const searchMovies = useCallback(
    async (params: SearchParams, append = false) => {
      if (!validateSearchTerm(params.s)) {
        if (params.s.length > 0) {
          setError(ERROR_MESSAGES.INVALID_SEARCH);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await omdbApi.searchMovies(params);

        if (response.Search) {
          if (append) {
            setMovies((prev) => [...prev, ...response.Search]);
          } else {
            setMovies(response.Search);
          }
          setTotalResults(parseInt(response.totalResults) || 0);
        } else {
          setMovies([]);
          setTotalResults(0);
          setError(ERROR_MESSAGES.NO_RESULTS);
        }
      } catch (err) {
        const errorMessage = formatApiError(err as Error);
        setError(errorMessage);
        if (!append) {
          setMovies([]);
          setTotalResults(0);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setCurrentPage(1);
      searchMovies({ s: debouncedSearchTerm, page: 1 });
    } else {
      setMovies([]);
      setTotalResults(0);
      setError(null);
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, searchMovies]);

  const loadNextPage = useCallback(() => {
    if (hasMoreResults && !isLoading && debouncedSearchTerm.trim()) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      searchMovies({ s: debouncedSearchTerm, page: nextPage }, true);
    }
  }, [
    hasMoreResults,
    isLoading,
    debouncedSearchTerm,
    currentPage,
    searchMovies,
  ]);

  const clearResults = useCallback(() => {
    setMovies([]);
    setTotalResults(0);
    setError(null);
    setCurrentPage(1);
    setSearchTerm("");
  }, []);

  return {
    movies,
    isLoading,
    error,
    totalResults,
    currentPage,
    searchTerm,
    setSearchTerm,
    loadNextPage,
    hasMoreResults,
    clearResults,
  };
};
