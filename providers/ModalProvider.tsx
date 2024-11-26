import React, { createContext, useContext, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'

// Types for modal content
type ModalContent = {
   title: string
   data: string
   onClose?: () => void
}

type ModalContextType = {
   showModal: (content: ModalContent) => void
   hideModal: () => void
}

// Create context for modal
const ModalContext = createContext<ModalContextType | null>(null)

// Modal provider
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [visible, setVisible] = useState(false)
   const [modalContent, setModalContent] = useState<ModalContent | null>(null)

   const showModal = (content: ModalContent) => {
      setModalContent(content)
      setVisible(true)
   }

   const hideModal = () => {
      if (modalContent?.onClose) modalContent.onClose()
      setVisible(false)
      setModalContent(null)
   }

   return (
      <ModalContext.Provider value={{ showModal, hideModal }}>
         {children}
         <Modal transparent visible={visible} animationType="slide">
            <View style={styles.overlay}>
               <View style={styles.modalContainer}>
                  <Text style={styles.title}>{modalContent?.title}</Text>
                  <View style={styles.body}>
                     <Text>New Order {modalContent?.data}</Text>
                  </View>
                  <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
                     <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>
      </ModalContext.Provider>
   )
}

// Hook to use modal
export const useModal = (): ModalContextType => {
   const context = useContext(ModalContext)
   if (!context) {
      throw new Error('useModal must be used within a ModalProvider')
   }
   return context
}

// Styles
const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center'
   },
   modalContainer: {
      width: Dimensions.get('window').width * 0.8,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center'
   },
   title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10
   },
   body: {
      marginBottom: 20
   },
   closeButton: {
      marginTop: 10,
      backgroundColor: '#007BFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5
   },
   closeButtonText: {
      color: 'white',
      fontWeight: 'bold'
   }
})
