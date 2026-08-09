import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const login = (password: string, rememberDevice: boolean): boolean => {
    const isPasswordCorrect = authService.verifyPassword(password);
    if (isPasswordCorrect) {
      authService.login(password, rememberDevice).then(success => {
        if (success) {
          setIsAuthenticated(true);
        }
      });
    }
    return isPasswordCorrect;
  };

  const logout = () => {
    authService.logout().then(() => {
      setIsAuthenticated(false);
    });
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
};
