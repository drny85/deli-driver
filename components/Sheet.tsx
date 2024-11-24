import { Colors } from '@/constants/Colors'
import {
   BottomSheetBackdrop,
   BottomSheetBackdropProps,
   BottomSheetModal
} from '@gorhom/bottom-sheet'
import * as React from 'react'

type pressBehavior = 'close' | 'none' | 'collapse' | number
type SheetProps = React.ComponentPropsWithoutRef<typeof BottomSheetModal> & {
   index?: number
   backgroundStyle?: object
   style?: object
   handleIndicatorStyle?: object
   pressBahavior?: pressBehavior
}

const Sheet = React.forwardRef<BottomSheetModal, SheetProps>(
   (
      {
         index = 0,
         backgroundStyle,
         style,
         handleIndicatorStyle,
         pressBahavior = 'close',
         ...props
      },
      ref
   ) => {
      const renderBackdrop = React.useCallback(
         (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
               {...props}
               disappearsOnIndex={-1}
               appearsOnIndex={0}
               pressBehavior={pressBahavior}
            />
         ),
         []
      )
      return (
         <BottomSheetModal
            ref={ref}
            index={0}
            backgroundStyle={
               backgroundStyle ?? {
                  backgroundColor: Colors.main
               }
            }
            style={
               style ?? {
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  borderTopStartRadius: 16,
                  borderTopEndRadius: 16
               }
            }
            handleIndicatorStyle={
               handleIndicatorStyle ?? {
                  backgroundColor: Colors.primary
               }
            }
            backdropComponent={renderBackdrop}
            {...props}
         />
      )
   }
)

function useSheetRef() {
   return React.useRef<BottomSheetModal>(null)
}

export { Sheet, useSheetRef }
