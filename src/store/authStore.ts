import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: { id: string; name: string; email: string } | null;
  setAuth: (token: AuthState["token"], user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        set({ token, user });
      },
      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      // only persist token & user
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
