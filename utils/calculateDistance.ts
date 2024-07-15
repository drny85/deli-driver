import { Coords } from '@/typing'

export function calculateDistance(coords1: Coords, coords2: Coords): number {
   // This is a simple Euclidean distance calculation.
   const dx = coords1.latitude - coords2.latitude
   const dy = coords1.longitude - coords2.longitude
   return Math.sqrt(dx * dx + dy * dy)
}
