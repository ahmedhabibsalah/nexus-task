import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import omdbApi from "../../../services/omdbApi";
import { validateSearchTerm, formatApiError } from "../../../utils/apiUtils";
import { SEARCH_CONFIG, ERROR_MESSAGES } from "../../../utils/constants";
import { useDebounce } from "../../../hooks/useDebounce";
import { LRUCache, performanceMonitor } from "../../../utils/performance";
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

const searchCache = new LRUCache<
  string,
  { movies: Movie[]; totalResults: number; timestamp: number }
>(50);
const CACHE_DURATION = 5 * 60 * 1000;

export const useMovieSearch = (): UseMovieSearchReturn => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const currentRequestRef = useRef<string>("");

  const debouncedSearchTerm = useDebounce(
    searchTerm,
    SEARCH_CONFIG.DEBOUNCE_DELAY
  );

  const getCacheKey = useCallback((term: string, page: number = 1) => {
    return `${term.toLowerCase().trim()}-${page}`;
  }, []);

  const isCacheValid = useCallback((timestamp: number) => {
    return Date.now() - timestamp < CACHE_DURATION;
  }, []);

  const hasMoreResults = useMemo(() => {
    return movies.length < totalResults && totalResults > 0;
  }, [movies.length, totalResults]);

  const searchMovies = useCallback(
    async (params: SearchParams, append = false) => {
      if (!validateSearchTerm(params.s)) {
        if (params.s.length > 0) {
          setError(ERROR_MESSAGES.INVALID_SEARCH);
        }
        return;
      }

      const requestId = `${params.s}-${params.page || 1}-${Date.now()}`;
      currentRequestRef.current = requestId;

      const searchStartTime = performance.now();
      performanceMonitor.mark(`search-start-${requestId}`);

      const cacheKey = getCacheKey(params.s, params.page);
      const cachedResult = searchCache.get(cacheKey);

      if (cachedResult && isCacheValid(cachedResult.timestamp)) {
        if (currentRequestRef.current === requestId) {
          performanceMonitor.logRenderTime(
            `Search Cache Hit for ${params.s}`,
            searchStartTime
          );

          if (append) {
            setMovies((prev) => [...prev, ...cachedResult.movies]);
          } else {
            setMovies(cachedResult.movies);
          }
          setTotalResults(cachedResult.totalResults);
          setError(null);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await omdbApi.searchMovies(params);

        if (currentRequestRef.current !== requestId) {
          return;
        }

        performanceMonitor.mark(`search-end-${requestId}`);
        performanceMonitor.measure(
          `search-duration-${params.s}`,
          `search-start-${requestId}`,
          `search-end-${requestId}`
        );

        if (response.Search) {
          const newMovies = response.Search;
          const newTotalResults = parseInt(response.totalResults) || 0;

          searchCache.set(cacheKey, {
            movies: newMovies,
            totalResults: newTotalResults,
            timestamp: Date.now(),
          });

          if (append) {
            setMovies((prev) => [...prev, ...newMovies]);
          } else {
            setMovies(newMovies);
          }
          setTotalResults(newTotalResults);
        } else {
          setMovies([]);
          setTotalResults(0);
          setError(ERROR_MESSAGES.NO_RESULTS);
        }
      } catch (err) {
        if (currentRequestRef.current === requestId) {
          const errorMessage = formatApiError(err as Error);
          setError(errorMessage);
          if (!append) {
            setMovies([]);
            setTotalResults(0);
          }
        }
      } finally {
        if (currentRequestRef.current === requestId) {
          setIsLoading(false);
          performanceMonitor.logRenderTime(
            `Search Complete for ${params.s}`,
            searchStartTime
          );
        }
      }
    },
    [getCacheKey, isCacheValid]
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
      currentRequestRef.current = "";
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
    currentRequestRef.current = "";
    searchCache.clear();
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
