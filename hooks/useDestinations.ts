import { useLocatioStore } from '@/providers/locationStore';
import { Business, Coords, Order, ORDER_STATUS } from '@/typing';
import { useEffect, useState } from 'react';

type Destination = {
  name: string;
  coords: Coords | undefined;
  image: string | null;
  identifier: 'origin' | 'destination' | 'restautant';
};

export const useDestinations = (order: Order, business: Business | null) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const location = useLocatioStore((state) => state.location);
  const { status, address } = order;
  useEffect(() => {
    if (!address?.coords || !business) return;

    setDestinations([
      {
        name: 'Customer',
        coords: order.address?.coords,
        image: null,
        identifier: 'destination',
      },
      {
        name: 'Restaurant',
        coords: business.coords!,
        image: null,
        identifier: 'restautant',
      },
    ]);
  }, [order, business]);

  return { location, destinations };
};
