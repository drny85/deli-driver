import { EarningsData, Order } from '@/typing'
import { addHours, format, startOfDay, startOfWeek } from 'date-fns'

export const calculateEarnings = (orders: Order[], filter: string): EarningsData[] => {
   const earningsMap: { [key: string]: number } = {}

   orders.forEach((order) => {
      const orderDate = new Date(order.orderDate)
      let key: string

      switch (filter) {
         case 'Day':
            const startHour = startOfDay(orderDate)
            const endHour = addHours(startHour, 24)
            key = format(orderDate, 'ha') + ' - ' + format(addHours(orderDate, 1), 'ha')
            break
         case 'Week':
            key = format(orderDate, 'EEEE')
            break
         case 'Month':
            const weekStart = startOfWeek(orderDate)
            key = `Week of ${format(weekStart, 'MMMM do')}`
            break
         default:
            key = format(orderDate, 'ha')
            break
      }

      if (!earningsMap[key]) {
         earningsMap[key] = 0
      }
      if (!order.tip?.amount) return 0
      earningsMap[key] += order.tip?.amount
   })

   console.log(earningsMap)

   const sortedEarnings = Object.keys(earningsMap)
      .map((key) => ({
         day: key,
         totalTips: earningsMap[key]
      }))
      .sort((a, b) => {
         if (filter === 'Day') {
            const timeFormat = 'ha'
            const timeA = format(new Date(`2024-07-25 ${a.day.split(' - ')[0]}`), timeFormat)
            const timeB = format(new Date(`2024-07-25 ${b.day.split(' - ')[0]}`), timeFormat)
            return (
               new Date(`1970-01-01T${timeA}:00Z`).getTime() -
               new Date(`1970-01-01T${timeB}:00Z`).getTime()
            )
         }
         return new Date(a.day).getTime() - new Date(b.day).getTime()
      })

   return sortedEarnings
}
