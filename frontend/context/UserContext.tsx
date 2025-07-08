'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosClient from "@/lib/axios";

// Define User type
interface User {
  id: string;
  name: string;
  email: string;
  cart: any[]
}

// Define context value type
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

// ✅ Define & export context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// ✅ Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get('/user/me', { withCredentials: true });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ Custom hook
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
