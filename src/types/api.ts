import type { Movie, MovieDetails } from "./movie";

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieDetailsResponse extends MovieDetails {
  Response: string;
  Error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type SearchParams = {
  s: string;
  type?: "movie" | "series" | "episode";
  y?: string;
  page?: number;
};

export type MovieDetailParams = {
  i?: string;
  t?: string;
  plot?: "short" | "full";
};
