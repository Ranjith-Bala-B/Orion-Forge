const AUTH_TOKEN_KEY = 'orion_vault_auth_token';
const AUTH_PASSWORD = 'varr@Forge';

export const authService = {
  verifyPassword: (password: string): boolean => {
    return password === AUTH_PASSWORD;
  },

  login: (password: string, rememberDevice: boolean): boolean => {
    if (password === AUTH_PASSWORD) {
      if (rememberDevice) {
        localStorage.setItem(AUTH_TOKEN_KEY, 'authenticated_device_token_2026');
      }
      return true;
    }
    return false;
  },

  isAuthenticated: (): boolean => {
    const localToken = localStorage.getItem(AUTH_TOKEN_KEY);
    return Boolean(localToken);
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
