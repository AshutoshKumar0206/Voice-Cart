'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axiosClient from '@/lib/axios';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  cart: any[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname()

  const logout = useCallback(async () => {
    try {
      await axiosClient.post('/user/logout');
    } catch (err) {
      console.error('Logout API failed', err);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosClient.get('/user/me', {
        withCredentials: true,
      });
      setUser(res.data.user);
      if(pathname === '/verify-email' || pathname === '/signin' || pathname === '/signup'){
        window.location.href = '/dashboard';
      }
    } catch {
      if(pathname !== '/' && pathname !== '/verify-email' && pathname !== '/signin' && pathname !== '/signup'){
        await logout(); // 🔐 logout on failure (acts as middleware)
      }
    } finally {
      setLoading(false);
    }
  }, [pathname, logout]);

  const refetchUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, logout, refetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error('useUser must be used within a UserProvider');
  return context;
}
