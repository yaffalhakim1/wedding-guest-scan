import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * Standard API Response Envelope
 */
export interface BaseResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown> | null;
  error: {
    message: string;
    code: string;
    details?: Array<Record<string, unknown>>;
  } | null;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for attaching token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for handling standardized envelope
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return only the 'data' part of the backend envelope for successful requests
    if (response.data && response.data.success === true) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  (error) => {
    // Standardize 401 handling
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    // Pass the standard backend error object if present
    const backendError = error.response?.data?.error;
    if (backendError) {
      error.message = backendError.message || error.message;
      // Attach metadata for components to handle
      error.code = backendError.code;
      error.details = backendError.details;
    }

    return Promise.reject(error);
  },
);

export default api;
