import { Order } from '@/typing'
import { format, startOfWeek, startOfMonth, addDays } from 'date-fns'
export type EarningsData = {
   day: string
   totalTips: number
}

export const calculateEarnings = (orders: Order[], filter: string): EarningsData[] => {
   const earningsMap: { [key: string]: number } = {}

   orders.forEach((order) => {
      let key: string

      switch (filter) {
         case 'Day':
            key = format(new Date(order.orderDate), 'EEEE, MMMM do')
            break
         case 'Week':
            const weekStart = startOfWeek(new Date(order.orderDate))
            key = `Week of ${format(weekStart, 'MMMM do')}`
            break
         case 'Month':
            key = format(new Date(order.orderDate), 'MMMM yyyy')
            break
         default:
            key = format(new Date(order.orderDate), 'EEEE, MMMM do')
            break
      }

      if (!earningsMap[key]) {
         earningsMap[key] = 0
      }
      if (!order.tip?.amount) return
      earningsMap[key] += order.tip?.amount
   })

   return Object.keys(earningsMap).map((key) => ({
      day: key,
      totalTips: earningsMap[key]
   }))
}
