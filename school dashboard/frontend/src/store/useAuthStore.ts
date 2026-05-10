import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  schoolId?: string;
  avatar?: string;
}

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedChildId: string | null;
  setAuth: (user: any, token: string) => void;
  setSelectedChildId: (id: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      selectedChildId: null,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      setSelectedChildId: (id) => set({ selectedChildId: id }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, selectedChildId: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
