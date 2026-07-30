import { create } from "zustand";

export const useAuthStore = create((set) => ({
  session: null,
  accessToken: null,
  user: null,
  user_id: null,

  setSession: (session) =>
    set({
      session,
      accessToken: session?.access_token || null,
      user: session?.user || null,
      user_id: session?.user?.id || null,
    }),

  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null, session: null, user: null, user_id: null }),
  setUser: (user) => set({ user }),
  setUserId: (userId) => set({ user_id: userId }),

  setAuth: ({ accessToken, user, user_id, session = null }) =>
    set({ accessToken, user, user_id, session }),

  clearAuth: () => set({ session: null, accessToken: null, user: null, user_id: null }),
}));
