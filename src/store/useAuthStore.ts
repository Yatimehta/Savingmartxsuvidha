'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: Partial<User> | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: Partial<User>, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'usr_demo',
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        phone: '0412 345 678',
        role: 'customer'
      },
      token: 'demo_jwt_token',
      isAuthenticated: true,

      setUser: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch {}
        set({ user: null, token: null, isAuthenticated: false });
      }
    }),
    {
      name: 'vegimart_auth_store'
    }
  )
);
