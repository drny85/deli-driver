/**
 * Determines whether to use light or dark text based on background color.
 * @param hexColor Background color in hex format (e.g., "#A1B2C3").
 * @returns Text color ("#000000" for dark, "#FFFFFF" for light).
 */
export const getTextColor = (hexColor: string): string => {
   // Remove the "#" if it exists
   const hex = hexColor.replace('#', '')

   // Convert hex to RGB
   const r = parseInt(hex.substring(0, 2), 16) / 255
   const g = parseInt(hex.substring(2, 4), 16) / 255
   const b = parseInt(hex.substring(4, 6), 16) / 255

   // Calculate relative luminance
   const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

   // Return white (#FFFFFF) for dark backgrounds, black (#000000) for light
   return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
