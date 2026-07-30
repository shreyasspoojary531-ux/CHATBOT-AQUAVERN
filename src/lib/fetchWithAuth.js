import { useAuthStore } from "../store/authStore";
import { supabase } from "../utils/supabase";

/**
 * Custom fetch wrapper that automatically handles:
 * - Injecting Bearer Authorization token from Supabase session in Zustand store
 * - Handling automatic session refresh via Supabase SDK
 */
export async function fetchWithAuth(url, options = {}) {
  const { accessToken, clearAuth } = useAuthStore.getState();

  const headers = { ...options.headers };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const mergedOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (response.status === 401 || response.status === 403) {
      const refreshed = await silentRefresh();
      if (refreshed) {
        const freshToken = useAuthStore.getState().accessToken;
        const retryHeaders = {
          ...options.headers,
          "Authorization": `Bearer ${freshToken}`,
        };
        return await fetch(url, { ...options, headers: retryHeaders });
      } else {
        clearAuth();
        return response;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}

export async function silentRefresh() {
  const { setSession, clearAuth } = useAuthStore.getState();
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data.session) {
      setSession(data.session);
      return true;
    }
  } catch (error) {
    console.error("Supabase silent refresh error:", error);
  }
  clearAuth();
  return false;
}
