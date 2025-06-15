// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      logout: () => {
        // Call your custom logout function here
        console.log("Logging out...");
        customLogoutFunction();
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);

// Define your custom logout function
function customLogoutFunction() {
  
  window.location.href = "/"; // Redirect to home page or login page
  // Add your logout logic here, e.g., API call, redirect, etc.
  console.log("Logged out!");
}
