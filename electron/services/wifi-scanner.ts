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
      // Use system_profiler -json for current SSID as well
      const { stdout } = await execAsync('system_profiler SPAirPortDataType -json')
      const data = JSON.parse(stdout)
      const interfaces = data.SPAirPortDataType?.[0]?.spairport_airport_interfaces || []
      
      for (const iface of interfaces) {
        const current = iface.spairport_current_network_information
        if (current && current._name) {
          return current._name
        }
      }
      return null
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
      // 1. Try system_profiler -json (Modern and robust)
      try {
        const { stdout } = await execAsync('system_profiler SPAirPortDataType -json')
        return this.parseProfilerJson(stdout)
      } catch (jsonError) {
        console.warn('JSON scan failed, falling back to airport:', jsonError)
      }

      // 2. Fallback to airport utility (deprecated)
      const airportPath = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport'
      const { stdout: airportOutput } = await execAsync(`${airportPath} -s`)
      return this.parseMacOSOutput(airportOutput)
    } catch (error) {
      console.error('macOS scan failed:', error)
      return []
    }
  }

  private parseProfilerJson(jsonOutput: string): RawNetwork[] {
    try {
      const data = JSON.parse(jsonOutput)
      const networks: RawNetwork[] = []
      const interfaces = data.SPAirPortDataType?.[0]?.spairport_airport_interfaces || []

      for (const iface of interfaces) {
        // 1. Add current connected network
        const current = iface.spairport_current_network_information
        if (current && current._name) {
          networks.push(this.transformProfilerNetwork(current))
        }

        // 2. Add other networks
        const others = iface.spairport_airport_other_local_wireless_networks || []
        for (const net of others) {
          if (net._name) {
            networks.push(this.transformProfilerNetwork(net))
          }
        }
      }

      return networks
    } catch (e) {
      console.error('Failed to parse profiler JSON:', e)
      return []
    }
  }

  private transformProfilerNetwork(net: any): RawNetwork {
    // Channel format: "5 (2GHz, 20MHz)" or just "5"
    let channel = 0
    if (net.spairport_network_channel) {
      const channelMatch = String(net.spairport_network_channel).match(/^(\d+)/)
      if (channelMatch) channel = parseInt(channelMatch[1])
    }

    // Signal format: "-69 dBm / -97 dBm" 
    let rssi = -70
    if (net.spairport_signal_noise) {
      const rssiMatch = String(net.spairport_signal_noise).match(/(-?\d+)\s+dBm/)
      if (rssiMatch) rssi = parseInt(rssiMatch[1])
    }

    return {
      ssid: net._name,
      bssid: net.spairport_network_bssid || '00:00:00:00:00:00',
      rssi,
      channel,
      security: this.normalizeSecurityMac(net.spairport_security_mode || 'Open')
    }
  }

  private parseProfilerOutput(output: string): RawNetwork[] {
    const networks: RawNetwork[] = []
    
    // Look for Wi-Fi networks in the output
    const sections = ['Current Network Information:', 'Other Local Wi-Fi Networks:']
    
    for (const section of sections) {
      const parts = output.split(section)
      if (parts.length < 2) continue
      
      const content = parts[1]
      const networkLines = content.split('\n')
      
      let currentNetwork: Partial<RawNetwork> & { lastIndent: number } = { lastIndent: -1 }
      let currentSsid = ''
      let baseIndent = -1

      for (const line of networkLines) {
        if (!line.trim()) continue
        
        const indent = line.search(/\S/)
        const trimmed = line.trim()

        if (baseIndent === -1) baseIndent = indent

        // If indent is equal to base indent, it's a new SSID
        if (indent === baseIndent) {
          // Push previous if complete
          if (currentSsid && currentNetwork.rssi !== undefined) {
            networks.push({
              ssid: currentSsid,
              bssid: currentNetwork.bssid || `00:00:00:00:00:00`,
              rssi: currentNetwork.rssi,
              channel: currentNetwork.channel || 0,
              security: currentNetwork.security || 'Open'
            })
          }
          
          currentSsid = trimmed.replace(/:$/, '')
          currentNetwork = { lastIndent: indent, rssi: undefined, channel: 0, security: 'Open' }
        } else if (currentSsid && indent > baseIndent) {
          if (trimmed.startsWith('Channel:')) {
            const match = trimmed.match(/Channel:\s+(\d+)/)
            if (match) currentNetwork.channel = parseInt(match[1])
          } else if (trimmed.startsWith('Signal / Noise:')) {
            const match = trimmed.match(/Signal \/ Noise:\s+(-\d+)/)
            if (match) currentNetwork.rssi = parseInt(match[1])
          } else if (trimmed.startsWith('Security:')) {
            const match = trimmed.match(/Security:\s+(.+)/)
            if (match) currentNetwork.security = this.normalizeSecurityMac(match[1])
          }
        } else if (indent < baseIndent && baseIndent !== -1) {
          // End of section
          break
        }
      }
      
      // Push last one
      if (currentSsid && currentNetwork.rssi !== undefined) {
        networks.push({
          ssid: currentSsid,
          bssid: currentNetwork.bssid || `00:00:00:00:00:00`,
          rssi: currentNetwork.rssi,
          channel: currentNetwork.channel || 0,
          security: currentNetwork.security || 'Open'
        })
      }
    }

    // Deduplicate by SSID
    const uniqueNetworks = new Map<string, RawNetwork>()
    for (const n of networks) {
      if (!uniqueNetworks.has(n.ssid) || (uniqueNetworks.get(n.ssid)!.rssi < n.rssi)) {
        uniqueNetworks.set(n.ssid, n)
      }
    }

    return Array.from(uniqueNetworks.values())
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
