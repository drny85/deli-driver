import Communications from 'react-native-communications'

export const makeCall = async (phone: string) => {
   try {
      Communications.phonecall(phone.replace(/-/g, ''), true)
   } catch (error) {
      console.log(error)
   }
}
