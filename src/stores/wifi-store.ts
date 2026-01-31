import { create } from 'zustand'

// Mock data for development (will be replaced with real scanning)
const mockNetworks: WifiNetwork[] = [
  {
    ssid: 'Home_5G_Premium',
    bssid: 'AA:BB:CC:DD:EE:01',
    rssi: -42,
    channel: 36,
    frequency: 5180,
    security: 'WPA3',
    vendor: 'ASUS',
    band: '5GHz',
    isConnected: true,
  },
  {
    ssid: 'CoffeeShop_Free',
    bssid: 'AA:BB:CC:DD:EE:02',
    rssi: -65,
    channel: 6,
    frequency: 2437,
    security: 'Open',
    vendor: 'TP-Link',
    band: '2.4GHz',
  },
  {
    ssid: 'Neighbor_Network',
    bssid: 'AA:BB:CC:DD:EE:03',
    rssi: -72,
    channel: 11,
    frequency: 2462,
    security: 'WPA2',
    vendor: 'Netgear',
    band: '2.4GHz',
  },
  {
    ssid: 'Office_5G',
    bssid: 'AA:BB:CC:DD:EE:04',
    rssi: -55,
    channel: 44,
    frequency: 5220,
    security: 'WPA2/WPA3',
    vendor: 'Cisco',
    band: '5GHz',
  },
  {
    ssid: 'Guest_Network',
    bssid: 'AA:BB:CC:DD:EE:05',
    rssi: -78,
    channel: 1,
    frequency: 2412,
    security: 'WPA',
    vendor: 'D-Link',
    band: '2.4GHz',
  },
  {
    ssid: 'IoT_Network',
    bssid: 'AA:BB:CC:DD:EE:06',
    rssi: -68,
    channel: 6,
    frequency: 2437,
    security: 'WPA2',
    vendor: 'Apple',
    band: '2.4GHz',
  },
  {
    ssid: 'Gaming_5G',
    bssid: 'AA:BB:CC:DD:EE:07',
    rssi: -48,
    channel: 149,
    frequency: 5745,
    security: 'WPA3',
    vendor: 'ASUS',
    band: '5GHz',
  },
  {
    ssid: 'Legacy_WEP',
    bssid: 'AA:BB:CC:DD:EE:08',
    rssi: -85,
    channel: 3,
    frequency: 2422,
    security: 'WEP',
    vendor: 'Linksys',
    band: '2.4GHz',
  },
]

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

  scan: async () => {
    set({ scanning: true })
    
    try {
      // Try to use Electron API first
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
        // Use mock data for development
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Add some variance to mock data
        const networksWithVariance = mockNetworks.map(n => ({
          ...n,
          rssi: n.rssi + Math.floor(Math.random() * 10) - 5
        }))
        
        const connected = networksWithVariance.find(n => n.isConnected) || null
        
        set({ 
          networks: networksWithVariance, 
          connectedNetwork: connected,
          lastScanTime: new Date(),
          scanning: false 
        })
        
        if (connected) {
          get().addSignalHistory({
            time: new Date(),
            rssi: connected.rssi,
            ssid: connected.ssid,
          })
        }
      }
    } catch (error) {
      console.error('Scan failed:', error)
      set({ scanning: false })
    }
  },

  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  
  setAutoRefreshInterval: (seconds) => set({ autoRefreshInterval: seconds }),

  addSignalHistory: (entry) => set((state) => ({
    signalHistory: [...state.signalHistory.slice(-59), entry] // Keep last 60 entries
  })),

  clearSignalHistory: () => set({ signalHistory: [] }),
}))
