import { create } from 'zustand'
import { WifiNetwork } from '@/lib/types'

interface SignalHistory {
  time: Date
  rssi: number
  ssid: string
}

interface WifiState {
  networks: WifiNetwork[]
  connectedNetwork: WifiNetwork | null
  scanning: boolean
  lastScanTime: Date | null
  signalHistory: SignalHistory[]
  autoRefresh: boolean
  autoRefreshInterval: number // seconds
  error: string | null

  // Actions
  scan: () => Promise<void>
  setAutoRefresh: (enabled: boolean) => void
  setAutoRefreshInterval: (seconds: number) => void
  addSignalHistory: (entry: SignalHistory) => void
  clearSignalHistory: () => void
}

export const useWifiStore = create<WifiState>((set, get) => ({
  networks: [],
  connectedNetwork: null,
  scanning: false,
  lastScanTime: null,
  signalHistory: [],
  autoRefresh: true,
  autoRefreshInterval: 5,
  error: null,

  scan: async () => {
    set({ scanning: true, error: null })
    
    try {
      // Use Electron API for real scanning
      if (window.electronAPI?.scanWifi) {
        const networks = await window.electronAPI.scanWifi()
        const connected = networks.find(n => n.isConnected) || null
        
        set({ 
          networks, 
          connectedNetwork: connected,
          lastScanTime: new Date(),
          scanning: false 
        })
        
        // Add to signal history
        if (connected) {
          get().addSignalHistory({
            time: new Date(),
            rssi: connected.rssi,
            ssid: connected.ssid,
          })
        }
      } else {
        // Running in browser without Electron
        set({ 
          scanning: false,
          error: 'WiFi scanning requires the desktop app'
        })
      }
    } catch (error) {
      console.error('Scan failed:', error)
      set({ 
        scanning: false,
        error: error instanceof Error ? error.message : 'Scan failed'
      })
    }
  },

  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  
  setAutoRefreshInterval: (seconds) => set({ autoRefreshInterval: seconds }),

  addSignalHistory: (entry) => set((state) => ({
    signalHistory: [...state.signalHistory.slice(-59), entry] // Keep last 60 entries
  })),

  clearSignalHistory: () => set({ signalHistory: [] }),
}))
