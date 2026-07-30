import { supabase } from "../utils/supabase";

export const loginApi = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const logoutApi = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
};

export const refreshApi = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return data;
};
