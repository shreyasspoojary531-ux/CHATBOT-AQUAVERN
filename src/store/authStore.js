import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null, // { username, role, created_at }
  user_id: null,

  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setUserId: (userId) => set({ user_id: userId }),
  
  setAuth: ({ accessToken, user, user_id }) => set({ accessToken, user, user_id }),
  
  clearAuth: () => set({ accessToken: null, user: null, user_id: null }),
}));
