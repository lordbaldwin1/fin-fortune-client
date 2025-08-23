import { useState, useEffect } from 'react';
import { checkAuth } from './auth';
import type { User } from '../types/api';
import { config } from '../config';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        setLoading(true);
        setError(null);
        const user = await checkAuth();
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, []);

  const logout = async () => {
    const res = await fetch(`${config.BACKEND_API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) {
        console.error("Failed to logout?");
        return;
    }
    setUser(null);
    setError(null);
  };

  return {
    user,
    loading,
    error,
    logout,
  };
}