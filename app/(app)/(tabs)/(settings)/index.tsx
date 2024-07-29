import ModernSettingsPage from '@/components/ModernSettingsPage'
import { useAuth } from '@/providers/authProvider'
import React from 'react'

const Settings = () => {
   const { user } = useAuth()
   return <ModernSettingsPage />
}

export default Settings
