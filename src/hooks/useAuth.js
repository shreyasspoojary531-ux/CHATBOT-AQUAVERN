import { useAuthStore } from "../store/authStore";
import { supabase } from "../utils/supabase";

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const user_id = useAuthStore((state) => state.user_id);
  const setSession = useAuthStore((state) => state.setSession);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.session) {
      setSession(data.session);
    }
    return data;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    if (data.session) {
      setSession(data.session);
    }
    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("useAuth Logout Error:", error);
    } finally {
      clearAuth();
    }
  };

  const isAuthenticated = !!accessToken;

  return {
    login,
    signUp,
    logout,
    isAuthenticated,
    user,
    user_id,
    session,
    accessToken,
  };
}

export default useAuth;
