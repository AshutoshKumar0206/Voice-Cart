'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosClient from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useUser } from '@/context/UserContext';

interface Product {
  product_name: string;
  price: number;
  description?: string;
  category?: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  createdAt: string;
}

interface User {
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  orders?: Order[];
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await axiosClient.get('/user/me');
        setUserProfile(res.data.user);
      } catch (err) {
        console.error('Error fetching user', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axiosClient.post('/user/logout');
      setUser(null); // ✅ clear context
      router.push('/'); // ✅ redirect
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!user || !userProfile) {
    return <p className="text-center mt-10 text-red-500">User not found</p>;
  }

  return (
    <div className="max-w-4xl mt-6 mx-auto px-4 py-10 space-y-6">
      {/* 👤 User Info */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl">User Profile</CardTitle>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-700">
          <p><strong>Name:</strong> {userProfile.name}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Phone:</strong> {userProfile.phone}</p>
        </CardContent>
      </Card>

      {/* 🛒 Order History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Past Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {userProfile.orders?.length ? (
            userProfile.orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-2">
                  Ordered on: {format(new Date(order.createdAt), 'PPPpp')}
                </p>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.product.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.product.category} | ₹{item.product.price}
                        </p>
                      </div>
                      <Badge variant="outline">x{item.quantity}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No past orders found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
