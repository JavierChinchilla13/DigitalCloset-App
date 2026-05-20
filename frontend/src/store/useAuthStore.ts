import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '../types';
import type { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: (token, user) => set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isAdmin: user.role === Role.ROLE_ADMIN 
      }),
      setToken: (token) => set({ token }),
      logout: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false, 
        isAdmin: false 
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
