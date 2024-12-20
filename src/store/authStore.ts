import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // nombre del almacenamiento en localStorage
    } as PersistOptions<AuthState>
  )
);
