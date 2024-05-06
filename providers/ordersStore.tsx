import { ordersCollection } from '@/firebase';
import { Order } from '@/typing';

import { doc, updateDoc } from 'firebase/firestore';
import { create } from 'zustand';

type OrdersStore = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;

  removeOrder: (order: Order) => void;
  clearOrders: () => void;

  updateOrder: (order: Order) => void;
  getOrder: (id: string) => Order;
  getOrders: () => Order[];
  getOrdersCount: () => number;
  getOrdersByStatus: (status: string) => Order[];
};

export const useOrdersStore = create<OrdersStore>()((set, get) => ({
  orders: [],
  setOrders: (orders: Order[]) => set({ orders }),
  removeOrder: (order: Order) => set({ orders: get().orders.filter((o) => o.id !== order.id) }),
  clearOrders: () => set({ orders: [] }),
  updateOrder: async (order: Order): Promise<boolean> => {
    // const orders = get().orders.map((o) => (o.id === order.id ? order : o));
    // set({ orders });
    if (!order) return false;
    try {
      const orderRef = doc(ordersCollection, order.id);
      await updateDoc(orderRef, {
        ...order,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  // set({ orders: get().orders.map((o) => (o.id === order.id ? order : o)) }),
  getOrder: (id: string) => get().orders.find((o) => o.id === id)!,
  getOrders: () => get().orders,
  getOrdersCount: () => get().orders.length,
  getOrdersByStatus: (status: string) => get().orders.filter((o) => o.status === status),
}));

export const orders = useOrdersStore.getState().getOrders();
