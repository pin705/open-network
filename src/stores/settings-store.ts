import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  theme: 'light' | 'dark' | 'system'
  scanInterval: number // seconds
  showNotifications: boolean
  showVendor: boolean
  showBssid: boolean
  signalUnit: 'dbm' | 'percent'
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setScanInterval: (seconds: number) => void
  setShowNotifications: (show: boolean) => void
  setShowVendor: (show: boolean) => void
  setShowBssid: (show: boolean) => void
  setSignalUnit: (unit: 'dbm' | 'percent') => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      scanInterval: 5,
      showNotifications: true,
      showVendor: true,
      showBssid: false,
      signalUnit: 'dbm',

      setTheme: (theme) => {
        set({ theme })
        
        // Apply theme
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
        } else {
          localStorage.removeItem('theme')
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },
      
      setScanInterval: (seconds) => set({ scanInterval: seconds }),
      setShowNotifications: (show) => set({ showNotifications: show }),
      setShowVendor: (show) => set({ showVendor: show }),
      setShowBssid: (show) => set({ showBssid: show }),
      setSignalUnit: (unit) => set({ signalUnit: unit }),
    }),
    {
      name: 'open-network-settings',
    }
  )
)
