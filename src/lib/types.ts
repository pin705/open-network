export type SecurityType = 'Open' | 'WEP' | 'WPA' | 'WPA2' | 'WPA3' | 'WPA2/WPA3'

export interface WifiNetwork {
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

export interface PingResult {
  host: string
  latency: number
  success: boolean
  packetLoss: number
}

export interface SpeedTestResult {
  download: number
  upload: number
  ping: number
  server: string
}

export interface LocalDevice {
  ip: string
  mac: string
  hostname?: string
  vendor?: string
}

export interface SystemInfo {
  platform: string
  arch: string
  hostname: string
}
