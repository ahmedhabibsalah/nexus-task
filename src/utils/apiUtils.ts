import { API_CONFIG } from "./constants";

export const validateSearchTerm = (searchTerm: string): boolean => {
  return searchTerm.trim().length >= 2;
};

export const sanitizeSearchTerm = (searchTerm: string): string => {
  return searchTerm.trim().replace(/[^\w\s-]/gi, "");
};

export const getPosterUrl = (posterPath: string): string => {
  if (!posterPath || posterPath === "N/A") {
    return API_CONFIG.DEFAULT_POSTER;
  }

  if (posterPath.startsWith("http")) {
    return posterPath;
  }

  return `${API_CONFIG.POSTER_URL}/?apikey=${API_CONFIG.API_KEY}&i=${posterPath}`;
};

export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      if (
        lastError.message.includes("400") ||
        lastError.message.includes("401")
      ) {
        throw lastError;
      }

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(
        `API call failed, retrying in ${delay}ms (attempt ${
          attempt + 1
        }/${maxRetries})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

export const isNetworkError = (error: Error): boolean => {
  return (
    error.message.includes("Network") ||
    error.message.includes("timeout") ||
    error.message.includes("connection")
  );
};

export const formatApiError = (error: Error): string => {
  if (isNetworkError(error)) {
    return "Please check your internet connection and try again.";
  }

  if (error.message.includes("not found")) {
    return "No results found. Try a different search term.";
  }

  if (error.message.includes("Too many")) {
    return "Search returned too many results. Please be more specific.";
  }

  return "Something went wrong. Please try again later.";
};
