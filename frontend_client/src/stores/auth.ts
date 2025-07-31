import { writable } from 'svelte/store';
import { decodeToken } from '$api/rest';

// Represents the authenticated state and user info
function createAuthStore() {
  const token = localStorage.getItem('token');
  const user = token ? decodeToken(token) : null;

  const { subscribe, set, update } = writable({ token, user });

  return {
    subscribe,
    // PUBLIC_INTERFACE
    login: (token: string) => {
      localStorage.setItem('token', token);
      set({ token, user: decodeToken(token) });
    },
    // PUBLIC_INTERFACE
    logout: () => {
      localStorage.removeItem('token');
      set({ token: null, user: null });
    }
  };
}

export const auth = createAuthStore();
