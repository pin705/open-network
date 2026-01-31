import { contextBridge, ipcRenderer } from 'electron'
import { WifiNetwork, PingResult, SpeedTestResult, LocalDevice, SystemInfo } from './types'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // WiFi Scanner
  scanWifi: () => ipcRenderer.invoke('wifi:scan'),
  getConnectedNetwork: () => ipcRenderer.invoke('wifi:getConnected'),

  // Network Tools
  pingHost: (host: string) => ipcRenderer.invoke('network:ping', host),
  speedTest: () => ipcRenderer.invoke('network:speedTest'),
  scanLocalNetwork: () => ipcRenderer.invoke('network:scanLocal'),

  // System
  getSystemInfo: () => ipcRenderer.invoke('system:getInfo'),
  
  // Theme
  onThemeChange: (callback: (theme: 'dark' | 'light') => void) => {
    ipcRenderer.on('theme-changed', (_, theme) => callback(theme))
  },
})

// Type definitions for the exposed API
export interface ElectronAPI {
  scanWifi: () => Promise<WifiNetwork[]>
  getConnectedNetwork: () => Promise<WifiNetwork | null>
  pingHost: (host: string) => Promise<PingResult>
  speedTest: () => Promise<SpeedTestResult>
  scanLocalNetwork: () => Promise<LocalDevice[]>
  getSystemInfo: () => Promise<SystemInfo>
  onThemeChange: (callback: (theme: 'dark' | 'light') => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
