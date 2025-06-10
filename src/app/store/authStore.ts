// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  accountType: "individual" | "organization";
  companyId: string | null;
  isActive: boolean;
  subscriptionPlan: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);
