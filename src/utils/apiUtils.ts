import { API_CONFIG } from "./constants";

export const validateSearchTerm = (searchTerm: string): boolean => {
  return searchTerm.trim().length >= 2;
};

export const sanitizeSearchTerm = (searchTerm: string): string => {
  return searchTerm.trim().replace(/[^\w\s-]/gi, "");
};

export const getPosterUrl = (posterPath: string): string => {
  if (!posterPath || posterPath === "N/A" || posterPath === "undefined") {
    return API_CONFIG.DEFAULT_POSTER;
  }

  if (posterPath.startsWith("http://") || posterPath.startsWith("https://")) {
    return posterPath;
  }
  return posterPath;
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
    error.message.includes("connection") ||
    error.message.includes("fetch")
  );
};

export const formatApiError = (error: Error): string => {
  const message = error.message.toLowerCase();

  if (isNetworkError(error)) {
    return "Please check your internet connection and try again.";
  }

  if (message.includes("not found") || message.includes("no results")) {
    return "No results found. Try a different search term.";
  }

  if (message.includes("too many")) {
    return "Search returned too many results. Please be more specific.";
  }

  if (message.includes("invalid api key") || message.includes("401")) {
    return "API key issue. Please check your configuration.";
  }

  if (message.includes("rate limit") || message.includes("429")) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (message.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  return "Something went wrong. Please try again later.";
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCallTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      func(...args);
    }
  };
};

export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

export const formatRuntime = (runtime: string): string => {
  if (!runtime || runtime === "N/A") {
    return "Unknown";
  }

  const match = runtime.match(/(\d+)/);
  if (match) {
    const minutes = parseInt(match[1]);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  }

  return runtime;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + "...";
};

export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

export const scrollToTop = (): void => {
  if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
