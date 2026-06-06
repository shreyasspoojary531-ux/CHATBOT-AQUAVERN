import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { refreshApi } from "../api/auth";

const axiosInstance = axios.create({
  withCredentials: true, // Automatically send HttpOnly cookies
});

// Request interceptor: attach bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: auto silent refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry exactly once on 401
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const user_id = useAuthStore.getState().user_id;

      try {
        // Fetch new token with store's user_id
        const refreshResponse = await refreshApi(user_id);
        const newAccessToken = refreshResponse.accessToken;

        if (newAccessToken) {
          // Update the store
          useAuthStore.getState().setAccessToken(newAccessToken);

          // Retry the original failed request with the new access token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Clear auth store if refresh fails
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
