import { exec } from 'child_process'
import { promisify } from 'util'
import https from 'https'
import http from 'http'
import { OuiLookup } from './oui-lookup.js'
import { PingResult, SpeedTestResult, LocalDevice } from '../types.js'

const execAsync = promisify(exec)

export class NetworkTools {
  private ouiLookup = new OuiLookup()

  async ping(host: string): Promise<PingResult> {
    const platform = process.platform
    const count = platform === 'win32' ? '-n 4' : '-c 4'
    
    try {
      const startTime = Date.now()
      const { stdout } = await execAsync(`ping ${count} ${host}`)
      const latency = Date.now() - startTime

      // Parse packet loss from output
      let packetLoss = 0
      const lossMatch = stdout.match(/(\d+(?:\.\d+)?)\s*%\s*(?:packet\s+)?loss/i)
      if (lossMatch) {
        packetLoss = parseFloat(lossMatch[1])
      }

      // Parse average latency
      let avgLatency = latency / 4
      const avgMatch = stdout.match(/(?:avg|average)\s*[=/]\s*(\d+(?:\.\d+)?)/i) ||
                       stdout.match(/(\d+(?:\.\d+)?)\s*ms/i)
      if (avgMatch) {
        avgLatency = parseFloat(avgMatch[1])
      }

      return {
        host,
        latency: Math.round(avgLatency),
        success: true,
        packetLoss,
      }
    } catch {
      return {
        host,
        latency: 0,
        success: false,
        packetLoss: 100,
      }
    }
  }

  async speedTest(): Promise<SpeedTestResult> {
    // Real speed test using Cloudflare's speed test API
    const downloadUrl = 'https://speed.cloudflare.com/__down?bytes=10000000' // 10MB
    const uploadUrl = 'https://speed.cloudflare.com/__up'
    
    try {
      // Measure ping first
      const pingResult = await this.measurePing('speed.cloudflare.com')
      
      // Measure download speed
      const downloadSpeed = await this.measureDownload(downloadUrl)
      
      // Measure upload speed
      const uploadSpeed = await this.measureUpload(uploadUrl)
      
      return {
        download: downloadSpeed,
        upload: uploadSpeed,
        ping: pingResult,
        server: 'speed.cloudflare.com',
      }
    } catch (error) {
      console.error('Speed test failed:', error)
      // Fallback to basic measurement
      return {
        download: 0,
        upload: 0,
        ping: 0,
        server: 'speed.cloudflare.com (failed)',
      }
    }
  }

  private async measurePing(host: string): Promise<number> {
    return new Promise((resolve) => {
      const start = Date.now()
      const req = https.request({
        hostname: host,
        method: 'HEAD',
        path: '/',
        timeout: 5000,
      }, () => {
        resolve(Date.now() - start)
      })
      
      req.on('error', () => resolve(0))
      req.on('timeout', () => {
        req.destroy()
        resolve(0)
      })
      req.end()
    })
  }

  private async measureDownload(url: string): Promise<number> {
    return new Promise((resolve) => {
      const start = Date.now()
      let bytes = 0
      
      const req = https.get(url, (res) => {
        res.on('data', (chunk: Buffer) => {
          bytes += chunk.length
        })
        
        res.on('end', () => {
          const durationSeconds = (Date.now() - start) / 1000
          const mbps = (bytes * 8) / (durationSeconds * 1000000)
          resolve(Math.round(mbps * 100) / 100)
        })
      })
      
      req.on('error', () => resolve(0))
      req.setTimeout(30000, () => {
        req.destroy()
        resolve(0)
      })
    })
  }

  private async measureUpload(url: string): Promise<number> {
    return new Promise((resolve) => {
      const testData = Buffer.alloc(1000000, 'x') // 1MB upload test
      const start = Date.now()
      
      const urlObj = new URL(url)
      const req = https.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': testData.length,
        },
        timeout: 30000,
      }, () => {
        const durationSeconds = (Date.now() - start) / 1000
        const mbps = (testData.length * 8) / (durationSeconds * 1000000)
        resolve(Math.round(mbps * 100) / 100)
      })
      
      req.on('error', () => resolve(0))
      req.on('timeout', () => {
        req.destroy()
        resolve(0)
      })
      
      req.write(testData)
      req.end()
    })
  }

  async scanLocalNetwork(): Promise<LocalDevice[]> {
    const platform = process.platform

    try {
      let output: string

      switch (platform) {
        case 'darwin':
          const { stdout: arpOutput } = await execAsync('arp -a')
          output = arpOutput
          break
        case 'win32':
          const { stdout: winArpOutput } = await execAsync('arp -a')
          output = winArpOutput
          break
        case 'linux':
          const { stdout: linuxOutput } = await execAsync('ip neigh show')
          output = linuxOutput
          break
        default:
          return []
      }

      return this.parseArpOutput(output, platform)
    } catch (error) {
      console.error('Local network scan failed:', error)
      return []
    }
  }

  private parseArpOutput(output: string, platform: string): LocalDevice[] {
    const devices: LocalDevice[] = []
    const lines = output.trim().split('\n')

    for (const line of lines) {
      let ip: string | null = null
      let mac: string | null = null

      if (platform === 'darwin') {
        const match = line.match(/\((\d+\.\d+\.\d+\.\d+)\)\s+at\s+([0-9a-f:]{17})/i)
        if (match) {
          ip = match[1]
          mac = match[2].toUpperCase()
        }
      } else if (platform === 'win32') {
        const match = line.match(/(\d+\.\d+\.\d+\.\d+)\s+([0-9a-f-]{17})/i)
        if (match) {
          ip = match[1]
          mac = match[2].replace(/-/g, ':').toUpperCase()
        }
      } else if (platform === 'linux') {
        const match = line.match(/(\d+\.\d+\.\d+\.\d+).*lladdr\s+([0-9a-f:]{17})/i)
        if (match) {
          ip = match[1]
          mac = match[2].toUpperCase()
        }
      }

      if (ip && mac) {
        const vendor = this.ouiLookup.lookup(mac)
        devices.push({
          ip,
          mac,
          vendor,
        })
      }
    }

    return devices
  }
}
