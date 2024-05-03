import { Order } from '@/typing';
import { useEffect, useState } from 'react';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  return { orders, loading };
};
