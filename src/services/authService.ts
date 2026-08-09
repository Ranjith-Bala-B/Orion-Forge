import { supabase } from '../config/supabase';

const AUTH_TOKEN_KEY = 'orion_vault_auth_token';
const AUTH_PASSWORD = 'varr@Forge';
const VAULT_EMAIL = 'vault@orionforge.com'; // This account needs to be created in Supabase Auth

export const authService = {
  verifyPassword: (password: string): boolean => {
    return password === AUTH_PASSWORD;
  },

  login: async (password: string, rememberDevice: boolean): Promise<boolean> => {
    if (password === AUTH_PASSWORD) {
      if (rememberDevice) {
        localStorage.setItem(AUTH_TOKEN_KEY, 'authenticated_device_token_2026');
      } else {
        sessionStorage.setItem(AUTH_TOKEN_KEY, 'authenticated_device_token_2026');
      }
      
      try {
        // Authenticate with Supabase silently to get RLS access
        await supabase.auth.signInWithPassword({
          email: VAULT_EMAIL,
          password: AUTH_PASSWORD,
        });
      } catch (e) {
        console.error("Supabase silent login failed", e);
      }
      return true;
    }
    return false;
  },

  isAuthenticated: (): boolean => {
    const localToken = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
    return Boolean(localToken);
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    await supabase.auth.signOut();
  },
};
