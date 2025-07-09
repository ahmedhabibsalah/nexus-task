import apiClient from "./api";
import { ERROR_MESSAGES } from "../utils/constants";
import type {
  MovieDetailParams,
  MovieDetailsResponse,
  SearchParams,
  SearchResponse,
} from "../types/api";

class OMDbApiService {
  async searchMovies(params: SearchParams): Promise<SearchResponse> {
    try {
      const response = await apiClient.get<SearchResponse>("/", {
        params: {
          ...params,
          s: params.s.trim(),
        },
      });

      return response.data;
    } catch (error) {
      console.error("Search movies error:", error);

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

  async getMovieDetails(
    params: MovieDetailParams
  ): Promise<MovieDetailsResponse> {
    try {
      const response = await apiClient.get<MovieDetailsResponse>("/", {
        params: {
          ...params,
          plot: params.plot || "short",
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

  async getMovieById(imdbId: string): Promise<MovieDetailsResponse> {
    return this.getMovieDetails({ i: imdbId });
  }

  async getMovieByTitle(title: string): Promise<MovieDetailsResponse> {
    return this.getMovieDetails({ t: title.trim() });
  }

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

export const omdbApi = new OMDbApiService();
export default omdbApi;
