import { couriersCollection } from '@/firebase'
import { addDoc, doc, getDoc } from 'firebase/firestore'

type DataResponde = {
   success: boolean
   message: string | null
}

export const addCourierToWaitingList = async (
   storeId: string,
   courierId: string,
   name: string,
   phone: string
): Promise<DataResponde> => {
   try {
      const cDoc = doc(couriersCollection, courierId)
      const exists = await getDoc(cDoc)
      if (exists.exists() && exists.data().status === 'completed')
         return { success: false, message: 'Already exists' }
      await addDoc(couriersCollection, {
         submittedOn: new Date().toISOString(),
         status: 'pending',
         name,
         courierId,
         businessId: storeId,
         phone
      })
      return { success: true, message: 'Request has been sent!' }
   } catch (error) {
      console.log('Error adding courier to list', error)
      return { success: false, message: null }
   }
}
