import { Coords } from '@/typing';

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function distanceBetweenCoords(coord1: Coords, coord2: Coords): number {
  const earthRadiusInKm = 6371; // Radius of the Earth in kilometers

  const dLat = deg2rad(coord2.latitude - coord1.latitude);
  const dLon = deg2rad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.latitude)) *
      Math.cos(deg2rad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInKm = earthRadiusInKm * c;
  const distanceInMeters = distanceInKm * 1000; // Convert to meters

  return distanceInMeters;
}
