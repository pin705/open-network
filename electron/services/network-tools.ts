import { exec } from 'child_process'
import { promisify } from 'util'
import { OuiLookup } from './oui-lookup.js'
import { PingResult, SpeedTestResult, LocalDevice } from '../types.js'

const execAsync = promisify(exec)

export class NetworkTools {
  private ouiLookup = new OuiLookup()

  async ping(host: string): Promise<PingResult> {
    const platform = process.platform
    const count = platform === 'win32' ? '-n 1' : '-c 1'
    
    try {
      const startTime = Date.now()
      await execAsync(`ping ${count} ${host}`)
      const latency = Date.now() - startTime

      return {
        host,
        latency,
        success: true,
        packetLoss: 0,
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
    // Note: For a real implementation, you would use a speed test library
    // or API like speedtest-net npm package
    // This is a placeholder that simulates a speed test
    
    return new Promise((resolve) => {
      // Simulate download/upload tests
      setTimeout(() => {
        resolve({
          download: Math.random() * 200 + 50,
          upload: Math.random() * 50 + 20,
          ping: Math.random() * 30 + 5,
          server: 'speed.cloudflare.com',
        })
      }, 3000)
    })
  }

  async scanLocalNetwork(): Promise<LocalDevice[]> {
    const platform = process.platform
    const devices: LocalDevice[] = []

    try {
      let output: string

      switch (platform) {
        case 'darwin':
          // Use arp on macOS
          const { stdout: arpOutput } = await execAsync('arp -a')
          output = arpOutput
          break
        case 'win32':
          // Use arp on Windows
          const { stdout: winArpOutput } = await execAsync('arp -a')
          output = winArpOutput
          break
        case 'linux':
          // Try ip neigh on Linux
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
        // macOS format: hostname (192.168.1.1) at aa:bb:cc:dd:ee:ff on en0
        const match = line.match(/\((\d+\.\d+\.\d+\.\d+)\)\s+at\s+([0-9a-f:]{17})/i)
        if (match) {
          ip = match[1]
          mac = match[2].toUpperCase()
        }
      } else if (platform === 'win32') {
        // Windows format: 192.168.1.1           aa-bb-cc-dd-ee-ff     dynamic
        const match = line.match(/(\d+\.\d+\.\d+\.\d+)\s+([0-9a-f-]{17})/i)
        if (match) {
          ip = match[1]
          mac = match[2].replace(/-/g, ':').toUpperCase()
        }
      } else if (platform === 'linux') {
        // Linux format: 192.168.1.1 dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE
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
