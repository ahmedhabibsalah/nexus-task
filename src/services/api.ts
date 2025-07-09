import axios, { AxiosError, type AxiosResponse } from "axios";
import { API_CONFIG } from "../utils/constants";
import type { ApiError } from "../types/api";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  params: {
    apikey: API_CONFIG.API_KEY,
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data?.Response === "False") {
      throw new Error(response.data.Error || "API returned an error");
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: "Network error occurred",
      status: error.response?.status,
    };

    if (error.code === "ECONNABORTED") {
      apiError.message = "Request timeout - please try again";
    } else if (error.response) {
      apiError.message = `Server error: ${error.response.status}`;
    } else if (error.request) {
      apiError.message = "No response from server - check your connection";
    } else {
      apiError.message = error.message || "An unexpected error occurred";
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
