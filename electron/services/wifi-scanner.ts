import { exec } from 'child_process'
import { promisify } from 'util'
import { OuiLookup } from './oui-lookup.js'
import { WifiNetwork, SecurityType } from '../types.js'

const execAsync = promisify(exec)

interface RawNetwork {
  ssid: string
  bssid: string
  rssi: number
  channel: number
  security: string
}

export class WifiScanner {
  private ouiLookup = new OuiLookup()

  async scan(): Promise<WifiNetwork[]> {
    const platform = process.platform

    try {
      let rawNetworks: RawNetwork[]
      let connectedSsid: string | null = null

      switch (platform) {
        case 'darwin':
          rawNetworks = await this.scanMacOS()
          connectedSsid = await this.getConnectedSsidMacOS()
          break
        case 'win32':
          rawNetworks = await this.scanWindows()
          connectedSsid = await this.getConnectedSsidWindows()
          break
        case 'linux':
          rawNetworks = await this.scanLinux()
          connectedSsid = await this.getConnectedSsidLinux()
          break
        default:
          console.warn(`Unsupported platform: ${platform}`)
          return []
      }

      return rawNetworks.map(network => {
        const enriched = this.enrichNetwork(network)
        if (connectedSsid && (enriched.ssid === connectedSsid || enriched.bssid === connectedSsid)) {
          enriched.isConnected = true
        }
        return enriched
      })
    } catch (error) {
      console.error('Scan failed:', error)
      return []
    }
  }

  private async getConnectedSsidMacOS(): Promise<string | null> {
    try {
      const { stdout } = await execAsync('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I')
      const match = stdout.match(/\sSSID:\s(.+)/)
      return match ? match[1].trim() : null
    } catch {
      return null
    }
  }

  private async getConnectedSsidWindows(): Promise<string | null> {
    try {
      const { stdout } = await execAsync('netsh wlan show interfaces')
      const match = stdout.match(/\sSSID\s+:\s(.+)/)
      return match ? match[1].trim() : null
    } catch {
      return null
    }
  }

  private async getConnectedSsidLinux(): Promise<string | null> {
    try {
      const { stdout } = await execAsync('nmcli -t -f active,ssid device wifi list')
      const line = stdout.split('\n').find(l => l.startsWith('yes:'))
      return line ? line.split(':')[1] : null
    } catch {
      return null
    }
  }

  async getConnectedNetwork(): Promise<WifiNetwork | null> {
    const networks = await this.scan()
    return networks.find(n => n.isConnected) || null
  }

  private async scanMacOS(): Promise<RawNetwork[]> {
    try {
      // Use airport utility on macOS
      const airportPath = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport'
      const { stdout } = await execAsync(`${airportPath} -s`)
      
      return this.parseMacOSOutput(stdout)
    } catch (error) {
      console.error('macOS scan failed:', error)
      return []
    }
  }

  private parseMacOSOutput(output: string): RawNetwork[] {
    const lines = output.trim().split('\n')
    if (lines.length < 2) return []

    // Skip header line
    const networks: RawNetwork[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Parse airport output format
      // SSID                             BSSID             RSSI CHANNEL HT CC SECURITY
      const match = line.match(/(.+?)\s+([0-9a-f:]{17})\s+(-\d+)\s+(\d+).+?(WPA|WEP|OPN|--).*/i)
      
      if (match) {
        const [, ssid, bssid, rssi, channel, security] = match
        networks.push({
          ssid: ssid.trim(),
          bssid: bssid.toUpperCase(),
          rssi: parseInt(rssi),
          channel: parseInt(channel),
          security: this.normalizeSecurityMac(security),
        })
      }
    }

    return networks
  }

  private async scanWindows(): Promise<RawNetwork[]> {
    try {
      const { stdout } = await execAsync('netsh wlan show networks mode=Bssid')
      return this.parseWindowsOutput(stdout)
    } catch (error) {
      console.error('Windows scan failed:', error)
      return []
    }
  }

  private parseWindowsOutput(output: string): RawNetwork[] {
    const networks: RawNetwork[] = []
    const blocks = output.split(/(?=SSID \d+ :)/g)

    for (const block of blocks) {
      if (!block.trim()) continue

      const ssidMatch = block.match(/SSID \d+ : (.+)/i)
      const bssidMatch = block.match(/BSSID \d+ : ([0-9a-f:]+)/i)
      const signalMatch = block.match(/Signal : (\d+)%/i)
      const channelMatch = block.match(/Channel : (\d+)/i)
      const authMatch = block.match(/Authentication : (.+)/i)

      if (ssidMatch && bssidMatch) {
        const signalPercent = signalMatch ? parseInt(signalMatch[1]) : 50
        // Convert percentage to approximate dBm (rough estimation)
        const rssi = Math.round((signalPercent / 2) - 100)

        networks.push({
          ssid: ssidMatch[1].trim(),
          bssid: bssidMatch[1].toUpperCase(),
          rssi,
          channel: channelMatch ? parseInt(channelMatch[1]) : 0,
          security: authMatch ? this.normalizeSecurityWindows(authMatch[1]) : 'Open',
        })
      }
    }

    return networks
  }

  private async scanLinux(): Promise<RawNetwork[]> {
    try {
      // Try nmcli first (NetworkManager)
      const { stdout } = await execAsync('nmcli -t -f SSID,BSSID,SIGNAL,CHAN,SECURITY device wifi list')
      return this.parseLinuxOutput(stdout)
    } catch {
      try {
        // Fallback to iwlist (requires sudo)
        const { stdout } = await execAsync('sudo iwlist wlan0 scan')
        return this.parseIwlistOutput(stdout)
      } catch (error) {
        console.error('Linux scan failed:', error)
        return []
      }
    }
  }

  private parseLinuxOutput(output: string): RawNetwork[] {
    const networks: RawNetwork[] = []
    const lines = output.trim().split('\n')

    for (const line of lines) {
      const parts = line.split(':')
      if (parts.length >= 5) {
        const [ssid, bssid, signal, channel, security] = parts
        const signalPercent = parseInt(signal)
        const rssi = Math.round((signalPercent / 2) - 100)

        networks.push({
          ssid,
          bssid: bssid.toUpperCase(),
          rssi,
          channel: parseInt(channel),
          security: this.normalizeSecurityLinux(security),
        })
      }
    }

    return networks
  }

  private parseIwlistOutput(output: string): RawNetwork[] {
    // Basic iwlist parsing - would need more work for production
    const networks: RawNetwork[] = []
    const cells = output.split(/Cell \d+ - /)

    for (const cell of cells) {
      if (!cell.trim()) continue

      const bssidMatch = cell.match(/Address: ([0-9A-F:]+)/i)
      const ssidMatch = cell.match(/ESSID:"(.*)"/i)
      const signalMatch = cell.match(/Signal level[=:](-?\d+)/i)
      const channelMatch = cell.match(/Channel:(\d+)/i)

      if (bssidMatch) {
        networks.push({
          ssid: ssidMatch ? ssidMatch[1] : '',
          bssid: bssidMatch[1].toUpperCase(),
          rssi: signalMatch ? parseInt(signalMatch[1]) : -70,
          channel: channelMatch ? parseInt(channelMatch[1]) : 0,
          security: cell.includes('WPA2') ? 'WPA2' : 
                   cell.includes('WPA') ? 'WPA' : 
                   cell.includes('WEP') ? 'WEP' : 'Open',
        })
      }
    }

    return networks
  }

  private normalizeSecurityMac(security: string): SecurityType {
    const upper = security.toUpperCase()
    if (upper.includes('WPA3')) return 'WPA3'
    if (upper.includes('WPA2')) return 'WPA2'
    if (upper.includes('WPA')) return 'WPA'
    if (upper.includes('WEP')) return 'WEP'
    if (upper === 'OPN' || upper === '--') return 'Open'
    return 'Open'
  }

  private normalizeSecurityWindows(security: string): SecurityType {
    const upper = security.toUpperCase()
    if (upper.includes('WPA3')) return 'WPA3'
    if (upper.includes('WPA2')) return 'WPA2'
    if (upper.includes('WPA')) return 'WPA'
    if (upper.includes('WEP')) return 'WEP'
    return 'Open'
  }

  private normalizeSecurityLinux(security: string): SecurityType {
    const upper = security.toUpperCase()
    if (upper.includes('WPA3')) return 'WPA3'
    if (upper.includes('WPA2')) return 'WPA2'
    if (upper.includes('WPA')) return 'WPA'
    if (upper.includes('WEP')) return 'WEP'
    return 'Open'
  }

  private enrichNetwork(raw: RawNetwork): WifiNetwork {
    const channel = raw.channel
    const frequency = this.channelToFrequency(channel)
    const band = this.getBand(frequency)
    const vendor = this.ouiLookup.lookup(raw.bssid)

    return {
      ssid: raw.ssid,
      bssid: raw.bssid,
      rssi: raw.rssi,
      channel,
      frequency,
      security: raw.security as SecurityType,
      vendor,
      band,
      isConnected: false, // Would need additional check
    }
  }

  private channelToFrequency(channel: number): number {
    // 2.4 GHz
    if (channel >= 1 && channel <= 13) {
      return 2412 + (channel - 1) * 5
    }
    if (channel === 14) return 2484

    // 5 GHz
    if (channel >= 36 && channel <= 64) {
      return 5180 + (channel - 36) * 5
    }
    if (channel >= 100 && channel <= 144) {
      return 5500 + (channel - 100) * 5
    }
    if (channel >= 149 && channel <= 177) {
      return 5745 + (channel - 149) * 5
    }

    return 0
  }

  private getBand(frequency: number): '2.4GHz' | '5GHz' | '6GHz' {
    if (frequency >= 2400 && frequency < 2500) return '2.4GHz'
    if (frequency >= 5150 && frequency < 5900) return '5GHz'
    if (frequency >= 5925 && frequency < 7125) return '6GHz'
    return '2.4GHz'
  }
}
