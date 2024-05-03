import { TempOrder } from '@/typing';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OrdersStore = {
  orders: TempOrder[];
  setOrders: (orders: TempOrder[]) => void;
  addOrder: (order: TempOrder) => void;
  removeOrder: (order: TempOrder) => void;
  clearOrders: () => void;
  updateOrder: (order: TempOrder) => void;
  getOrder: (id: string) => TempOrder;
  getOrders: () => TempOrder[];
  getOrdersCount: () => number;
  getOrdersByStatus: (status: string) => TempOrder[];
};

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      setOrders: (orders: TempOrder[]) => set({ orders }),
      addOrder: (order: TempOrder) => set({ orders: [...get().orders, order] }),
      removeOrder: (order: TempOrder) =>
        set({ orders: get().orders.filter((o) => o.id !== order.id) }),
      clearOrders: () => set({ orders: [] }),
      updateOrder: (order: TempOrder) =>
        set({ orders: get().orders.map((o) => (o.id === order.id ? order : o)) }),
      getOrder: (id: string) => get().orders.find((o) => o.id === id)!,
      getOrders: () => get().orders,
      getOrdersCount: () => get().orders.length,
      getOrdersByStatus: (status: string) => get().orders.filter((o) => o.status === status),
    }),
    {
      name: 'orders-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const orders = useOrdersStore.getState().getOrders();
