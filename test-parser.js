
function normalizeSecurityMac(security) {
  const upper = security.toUpperCase()
  if (upper.includes('WPA3')) return 'WPA3'
  if (upper.includes('WPA2')) return 'WPA2'
  if (upper.includes('WPA')) return 'WPA'
  if (upper.includes('WEP')) return 'WEP'
  if (upper === 'OPN' || upper === '--') return 'Open'
  return 'Open'
}

function parseProfilerOutput(output) {
  const networks = []
  
  // Look for Wi-Fi networks in the output
  const sections = ['Current Network Information:', 'Other Local Wi-Fi Networks:']
  
  for (const section of sections) {
    const parts = output.split(section)
    if (parts.length < 2) continue
    
    // Improved content extraction: capture everything until the next major section (less indent than the first line)
    const content = parts[1]
    const lines = content.split('\n')
    
    let currentNetwork = null
    let currentSsid = ''
    let baseIndent = -1

    for (const line of lines) {
      if (!line.trim()) continue
      
      const indent = line.search(/\S/)
      const trimmed = line.trim()

      if (baseIndent === -1) baseIndent = indent

      // If indent is equal to base indent, it's a new SSID
      if (indent === baseIndent) {
        // Push previous
        if (currentSsid && currentNetwork && currentNetwork.rssi !== undefined) {
          networks.push({
            ssid: currentSsid,
            bssid: '00:00:00:00:00:00',
            rssi: currentNetwork.rssi,
            channel: currentNetwork.channel || 0,
            security: currentNetwork.security || 'Open'
          })
        }
        
        currentSsid = trimmed.replace(/:$/, '')
        currentNetwork = { rssi: undefined, channel: 0, security: 'Open' }
      } else if (currentSsid && indent > baseIndent) {
        if (trimmed.startsWith('Channel:')) {
          const match = trimmed.match(/Channel:\s+(\d+)/)
          if (match) currentNetwork.channel = parseInt(match[1])
        } else if (trimmed.startsWith('Signal / Noise:')) {
          const match = trimmed.match(/Signal \/ Noise:\s+(-\d+)/)
          if (match) currentNetwork.rssi = parseInt(match[1])
        } else if (trimmed.startsWith('Security:')) {
          const match = trimmed.match(/Security:\s+(.+)/)
          if (match) currentNetwork.security = normalizeSecurityMac(match[1])
        }
      } else if (indent < baseIndent && baseIndent !== -1) {
        // End of section
        break
      }
    }
    
    // Push last one
    if (currentSsid && currentNetwork && currentNetwork.rssi !== undefined) {
      networks.push({
        ssid: currentSsid,
        bssid: '00:00:00:00:00:00',
        rssi: currentNetwork.rssi,
        channel: currentNetwork.channel || 0,
        security: currentNetwork.security || 'Open'
      })
    }
  }

  return networks
}

const testOutput = `
        en0:
          Card Type: Wi-Fi  (0x14E4, 0x4378)
          Status: Connected
          Current Network Information:
            MyHomeWiFi:
              PHY Mode: 802.11n
              Channel: 5 (2GHz, 20MHz)
              Security: WPA/WPA2 Personal
              Signal / Noise: -69 dBm / -97 dBm
          Other Local Wi-Fi Networks:
            Neighbor_WiFi:
              PHY Mode: 802.11b/g/n
              Channel: 10 (2GHz, 40MHz)
              Security: WPA2 Personal
              Signal / Noise: -59 dBm / -89 dBm
`;

console.log(JSON.stringify(parseProfilerOutput(testOutput), null, 2))
