/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    // WiFi Scanner
    scanWifi: () => Promise<WifiNetwork[]>
    getConnectedNetwork: () => Promise<WifiNetwork | null>
    
    // Network Tools
    pingHost: (host: string) => Promise<PingResult>
    speedTest: () => Promise<SpeedTestResult>
    scanLocalNetwork: () => Promise<LocalDevice[]>
    
    // System
    getSystemInfo: () => Promise<SystemInfo>
    onThemeChange: (callback: (theme: 'dark' | 'light') => void) => void
  }
}

interface WifiNetwork {
  ssid: string
  bssid: string
  rssi: number
  channel: number
  frequency: number
  security: SecurityType
  vendor: string
  band: '2.4GHz' | '5GHz' | '6GHz'
  isConnected?: boolean
}

type SecurityType = 'Open' | 'WEP' | 'WPA' | 'WPA2' | 'WPA3' | 'WPA2/WPA3'

interface PingResult {
  host: string
  latency: number
  success: boolean
  packetLoss: number
}

interface SpeedTestResult {
  download: number // Mbps
  upload: number // Mbps
  ping: number // ms
  server: string
}

interface LocalDevice {
  ip: string
  mac: string
  hostname?: string
  vendor?: string
}

interface SystemInfo {
  platform: string
  arch: string
  hostname: string
  networkInterfaces: NetworkInterface[]
}

interface NetworkInterface {
  name: string
  mac: string
  ip?: string
  type: 'wifi' | 'ethernet' | 'other'
}
