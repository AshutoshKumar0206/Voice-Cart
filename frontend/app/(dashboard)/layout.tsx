// app/(dashboard)/layout.tsx
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { UserProvider } from '@/context/UserContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </div>
    </UserProvider>
  );
}
