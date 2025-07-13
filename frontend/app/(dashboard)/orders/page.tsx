"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import axiosClient from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Product {
  _id: string;
  product_name: string;
  price: number;
  image: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  status: string;
  orderAmount: number;
  createdAt: string;
}

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await axiosClient.get(`/order/getOrders/${user.id}`);
        console.log(res.data);
        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          toast.error(res.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        toast.error("Something went wrong while fetching orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          You have no orders yet 🛍️
        </h2>
      </div>
    );
  }

  const latestOrder = orders[0];
  const pastOrders = orders.slice(1);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 space-y-10 mt-6">
      <h1 className="text-3xl font-bold text-gray-800">📦 Your Orders</h1>

      {/* Latest Order Highlight */}
      <Card className="border-blue-500 shadow-lg hover:scale-102 transition-transform duration-300">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Most Recent Order</CardTitle>
            <p className="text-sm text-gray-500">
              Placed on {new Date(latestOrder.createdAt).toLocaleString()}
            </p>
          </div>
          <Badge className="bg-green-600 text-white">
            {latestOrder.status || "Placed"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {latestOrder.items.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <Image
                src={item.product.image || "/errors/missing-products.png"}
                alt={item.product.product_name}
                width={60}
                height={60}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.product_name}</h3>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} × ₹{item.product.price}
                </p>
              </div>
              <p className="font-semibold text-right">
                ₹{(item.product.price * item.quantity)?.toLocaleString()}
              </p>
            </div>
          ))}

          <div className="text-right font-bold text-lg">
            Total: ₹
            {(
              latestOrder.orderAmount ??
              latestOrder.items.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
              )
            )?.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">
            📚 Past Orders
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastOrders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Order #{order._id.slice(-6)}
                  </CardTitle>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt)?.toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Image
                        src={
                          item.product?.image || "/errors/missing-products.png"
                        }
                        alt={item.product.product_name}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {item.product.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × ₹{item.product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-400">
                      + {order.items.length - 2} more items
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-semibold">Total:</span>
                    <span className="font-bold">
                      ₹
                      {(
                        order.orderAmount ??
                        order.items.reduce(
                          (sum, item) =>
                            sum + item.product.price * item.quantity,
                          0
                        )
                      )?.toLocaleString()}
                    </span>
                  </div>
                  <Badge variant="secondary">{order.status || "Placed"}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
