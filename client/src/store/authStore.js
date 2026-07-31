import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { token, user } = await api.login({ email, password });
          set({ token, user, loading: false });
          return user;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      signup: async (name, email, password, role) => {
        set({ loading: true, error: null });
        try {
          const { token, user } = await api.signup({ name, email, password, role });
          set({ token, user, loading: false });
          return user;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      logout: () => set({ token: null, user: null }),

      refreshMe: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const { user } = await api.me(token);
          set({ user });
        } catch {
          set({ token: null, user: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'urbanfix-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
