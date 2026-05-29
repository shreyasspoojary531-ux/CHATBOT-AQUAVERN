import { useAuthStore } from "../store/authStore";

/**
 * Custom fetch wrapper that automatically handles:
 * - Injecting Bearer Authorization token from Zustand store
 * - Setting `credentials: "include"` for refresh token HTTP-only cookie support
 * - Intercepting 401/403 status codes to perform silent refresh and retry failed requests exactly once
 */
export async function fetchWithAuth(url, options = {}) {
  const { accessToken, setAccessToken, clearAccessToken } = useAuthStore.getState();

  // Clone headers and prepare request configurations
  const headers = { ...options.headers };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const mergedOptions = {
    ...options,
    headers,
    credentials: "include", // Essential for HttpOnly cookie exchange
  };

  try {
    const response = await fetch(url, mergedOptions);

    // Auto silent refresh on 401/403
    if (response.status === 401 || response.status === 403) {
      // Avoid looping if the refresh request itself returns 401/403
      if (url.includes("/auth/refresh")) {
        clearAccessToken();
        return response;
      }

      const refreshed = await silentRefresh();
      if (refreshed) {
        // Retrieve the fresh access token and retry the original request once
        const freshToken = useAuthStore.getState().accessToken;
        const retryHeaders = {
          ...options.headers,
          "Authorization": `Bearer ${freshToken}`,
        };
        const retryOptions = {
          ...options,
          headers: retryHeaders,
          credentials: "include",
        };
        return await fetch(url, retryOptions);
      } else {
        clearAccessToken();
        return response;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Triggers a POST to https://aquavern.com/auth/refresh to fetch a new in-memory accessToken
 * using credentials: "include" for browser cookie delivery.
 */
export async function silentRefresh() {
  const { setAccessToken, clearAccessToken } = useAuthStore.getState();
  try {
    const response = await fetch("https://aquavern.com/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        return true;
      }
    }
  } catch (error) {
    console.error("Silent refresh error:", error);
  }
  clearAccessToken();
  return false;
}
