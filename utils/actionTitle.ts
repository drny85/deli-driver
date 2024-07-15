import { ORDER_STATUS } from '@/typing'

export const actionTitle = (status: ORDER_STATUS): string => {
   return status === ORDER_STATUS.marked_ready_for_delivery
      ? 'Add To Trip'
      : status === ORDER_STATUS.accepted_by_driver
        ? 'Pick Up Order'
        : status === ORDER_STATUS.picked_up_by_driver
          ? 'Deliver Order'
          : 'Complete'
}
