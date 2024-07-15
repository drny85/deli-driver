import { OrderStatus } from '@/typing'
import { useState } from 'react'

export const useOrder = () => {
   const [status, setStatus] = useState<OrderStatus | null>(null)

   return { status }
}
