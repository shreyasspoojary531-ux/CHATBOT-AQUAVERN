import { useAuthStore } from "../store/authStore";
import { loginApi, logoutApi } from "../api/auth";

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const user_id = useAuthStore((state) => state.user_id);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const login = async (username, password) => {
    try {
      const response = await loginApi(username, password);
      if (response && response.accessToken) {
        const userData = response.data || {};
        const extractedUserId = response.user_id || response.id || userData.user_id || userData.id || null;
        
        setAuth({
          accessToken: response.accessToken,
          user: {
            username: userData.username || "",
            role: userData.role || "",
            created_at: userData.created_at || "",
          },
          user_id: extractedUserId,
        });
        return { success: true, response };
      }
      return { success: false, error: "Invalid credentials or missing access token." };
    } catch (error) {
      console.error("useAuth Login Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("useAuth Logout Error:", error);
    } finally {
      clearAuth();
    }
  };

  const isAuthenticated = !!accessToken;

  return {
    login,
    logout,
    isAuthenticated,
    user,
    user_id,
    accessToken,
  };
}
export default useAuth;
