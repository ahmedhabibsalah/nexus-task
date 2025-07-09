// src/services/omdbApi.ts
import apiClient from "./api";
import { ERROR_MESSAGES } from "../utils/constants";
import type {
  MovieDetailParams,
  MovieDetailsResponse,
  SearchParams,
  SearchResponse,
} from "../types/api";

class OMDbApiService {
  /**
   * Search for movies by title
   */
  async searchMovies(params: SearchParams): Promise<SearchResponse> {
    try {
      const response = await apiClient.get<SearchResponse>("/", {
        params: {
          ...params,
          // Ensure we always have a search term
          s: params.s.trim(),
        },
      });

      return response.data;
    } catch (error) {
      console.error("Search movies error:", error);

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes("Movie not found")) {
          throw new Error(ERROR_MESSAGES.NO_RESULTS);
        }
        if (error.message.includes("Too many results")) {
          throw new Error("Search too broad. Please be more specific.");
        }
      }

      throw new Error(ERROR_MESSAGES.API_ERROR);
    }
  }

  /**
   * Get detailed information about a specific movie
   */
  async getMovieDetails(
    params: MovieDetailParams
  ): Promise<MovieDetailsResponse> {
    try {
      const response = await apiClient.get<MovieDetailsResponse>("/", {
        params: {
          ...params,
          plot: params.plot || "short", // Default to short plot
        },
      });

      return response.data;
    } catch (error) {
      console.error("Get movie details error:", error);

      if (error instanceof Error && error.message.includes("not found")) {
        throw new Error(ERROR_MESSAGES.MOVIE_NOT_FOUND);
      }

      throw new Error(ERROR_MESSAGES.API_ERROR);
    }
  }

  /**
   * Get movie details by IMDb ID
   */
  async getMovieById(imdbId: string): Promise<MovieDetailsResponse> {
    return this.getMovieDetails({ i: imdbId });
  }

  /**
   * Get movie details by title
   */
  async getMovieByTitle(title: string): Promise<MovieDetailsResponse> {
    return this.getMovieDetails({ t: title.trim() });
  }

  /**
   * Search with pagination support
   */
  async searchMoviesWithPagination(
    searchTerm: string,
    page: number = 1,
    type?: "movie" | "series" | "episode"
  ): Promise<SearchResponse> {
    return this.searchMovies({
      s: searchTerm,
      page,
      type,
    });
  }
}

// Export a singleton instance
export const omdbApi = new OMDbApiService();
export default omdbApi;
