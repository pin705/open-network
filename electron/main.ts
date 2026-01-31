import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { WifiScanner } from './services/wifi-scanner.js'
import { NetworkTools } from './services/network-tools.js'
import { PingResult, SpeedTestResult, LocalDevice, SystemInfo } from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { createRequire } from 'module'

// Squirrel startup handler is usually for Windows.
if (process.platform === 'win32') {
  const require = createRequire(import.meta.url)
  if (require('electron-squirrel-startup')) {
    app.quit()
  }
}

let mainWindow: BrowserWindow | null = null
const wifiScanner = new WifiScanner()
const networkTools = new NetworkTools()

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#0a0a0f' : '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  })

  // Load the app
  if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Handle theme changes
  nativeTheme.on('updated', () => {
    mainWindow?.webContents.send('theme-changed', nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// IPC Handlers
function setupIpcHandlers() {
  // WiFi Scanner
  ipcMain.handle('wifi:scan', async () => {
    try {
      return await wifiScanner.scan()
    } catch (error) {
      console.error('WiFi scan failed:', error)
      return []
    }
  })

  ipcMain.handle('wifi:getConnected', async () => {
    try {
      return await wifiScanner.getConnectedNetwork()
    } catch (error) {
      console.error('Get connected network failed:', error)
      return null
    }
  })

  // Network Tools
  ipcMain.handle('network:ping', async (_, host: string) => {
    try {
      return await networkTools.ping(host)
    } catch (error) {
      console.error('Ping failed:', error)
      return { host, latency: 0, success: false, packetLoss: 100 }
    }
  })

  ipcMain.handle('network:speedTest', async () => {
    try {
      return await networkTools.speedTest()
    } catch (error) {
      console.error('Speed test failed:', error)
      return { download: 0, upload: 0, ping: 0, server: 'unknown' }
    }
  })

  ipcMain.handle('network:scanLocal', async () => {
    try {
      return await networkTools.scanLocalNetwork()
    } catch (error) {
      console.error('Local network scan failed:', error)
      return []
    }
  })

  // System
  ipcMain.handle('system:getInfo', async (): Promise<SystemInfo> => {
    return {
      platform: process.platform,
      arch: process.arch,
      hostname: os.hostname(),
    }
  })
}

// App lifecycle
app.whenReady().then(() => {
  setupIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })
})
