/**
 * OUI (Organizationally Unique Identifier) Lookup
 * Maps MAC address prefixes to manufacturer names
 */

// Common OUI prefixes - in production, you'd load the full IEEE database
const OUI_DATABASE: Record<string, string> = {
  // Apple
  '00:03:93': 'Apple',
  '00:0A:27': 'Apple',
  '00:0A:95': 'Apple',
  '00:0D:93': 'Apple',
  '00:11:24': 'Apple',
  '00:14:51': 'Apple',
  '00:16:CB': 'Apple',
  '00:17:F2': 'Apple',
  '00:19:E3': 'Apple',
  '00:1B:63': 'Apple',
  '00:1C:B3': 'Apple',
  '00:1D:4F': 'Apple',
  '00:1E:52': 'Apple',
  '00:1F:5B': 'Apple',
  '00:1F:F3': 'Apple',
  '00:21:E9': 'Apple',
  '00:22:41': 'Apple',
  '00:23:12': 'Apple',
  '00:23:32': 'Apple',
  '00:23:6C': 'Apple',
  '00:23:DF': 'Apple',
  '00:24:36': 'Apple',
  '00:25:00': 'Apple',
  '00:25:BC': 'Apple',
  '00:26:08': 'Apple',
  '00:26:4A': 'Apple',
  '00:26:B0': 'Apple',
  '00:26:BB': 'Apple',
  'A4:83:E7': 'Apple',
  'AC:BC:32': 'Apple',
  'B8:17:C2': 'Apple',
  'C8:69:CD': 'Apple',

  // Samsung
  '00:00:F0': 'Samsung',
  '00:02:78': 'Samsung',
  '00:09:18': 'Samsung',
  '00:0D:AE': 'Samsung',
  '00:12:47': 'Samsung',
  '00:12:FB': 'Samsung',
  '00:13:77': 'Samsung',
  '00:15:99': 'Samsung',
  '00:16:32': 'Samsung',
  '00:16:6B': 'Samsung',
  '00:16:6C': 'Samsung',
  '00:17:C9': 'Samsung',
  '00:17:D5': 'Samsung',
  '00:18:AF': 'Samsung',
  
  // Cisco
  '00:00:0C': 'Cisco',
  '00:01:42': 'Cisco',
  '00:01:43': 'Cisco',
  '00:01:63': 'Cisco',
  '00:01:64': 'Cisco',
  '00:01:96': 'Cisco',
  '00:01:97': 'Cisco',
  '00:01:C7': 'Cisco',
  '00:01:C9': 'Cisco',
  
  // TP-Link
  '00:14:78': 'TP-Link',
  '00:1D:0F': 'TP-Link',
  '00:21:27': 'TP-Link',
  '00:23:CD': 'TP-Link',
  '00:25:86': 'TP-Link',
  '00:27:19': 'TP-Link',
  '10:FE:ED': 'TP-Link',
  '14:CC:20': 'TP-Link',
  '14:CF:92': 'TP-Link',
  
  // Netgear
  '00:09:5B': 'Netgear',
  '00:0F:B5': 'Netgear',
  '00:14:6C': 'Netgear',
  '00:18:4D': 'Netgear',
  '00:1B:2F': 'Netgear',
  '00:1E:2A': 'Netgear',
  '00:1F:33': 'Netgear',
  '00:22:3F': 'Netgear',
  '00:24:B2': 'Netgear',
  '00:26:F2': 'Netgear',
  
  // D-Link
  '00:05:5D': 'D-Link',
  '00:0D:88': 'D-Link',
  '00:0F:3D': 'D-Link',
  '00:11:95': 'D-Link',
  '00:13:46': 'D-Link',
  '00:15:E9': 'D-Link',
  '00:17:9A': 'D-Link',
  '00:18:E7': 'D-Link',
  '00:19:5B': 'D-Link',
  '00:1B:11': 'D-Link',
  '00:1C:F0': 'D-Link',
  '00:1E:58': 'D-Link',
  
  // ASUS
  '00:0C:6E': 'ASUS',
  '00:0E:A6': 'ASUS',
  '00:11:2F': 'ASUS',
  '00:11:D8': 'ASUS',
  '00:13:D4': 'ASUS',
  '00:15:F2': 'ASUS',
  '00:17:31': 'ASUS',
  '00:18:F3': 'ASUS',
  '00:1A:92': 'ASUS',
  '00:1B:FC': 'ASUS',
  '00:1D:60': 'ASUS',
  '00:1E:8C': 'ASUS',
  '00:1F:C6': 'ASUS',
  '00:22:15': 'ASUS',
  '00:23:54': 'ASUS',
  '00:24:8C': 'ASUS',
  '00:25:22': 'ASUS',
  '00:26:18': 'ASUS',
  
  // Linksys
  '00:06:25': 'Linksys',
  '00:0C:41': 'Linksys',
  '00:0F:66': 'Linksys',
  '00:12:17': 'Linksys',
  '00:13:10': 'Linksys',
  '00:14:BF': 'Linksys',
  '00:16:B6': 'Linksys',
  '00:18:39': 'Linksys',
  '00:18:F8': 'Linksys',
  '00:1A:70': 'Linksys',
  '00:1C:10': 'Linksys',
  '00:1D:7E': 'Linksys',
  '00:1E:E5': 'Linksys',
  '00:21:29': 'Linksys',
  '00:22:6B': 'Linksys',
  '00:23:69': 'Linksys',
  '00:25:9C': 'Linksys',
  
  // Intel
  '00:02:B3': 'Intel',
  '00:03:47': 'Intel',
  '00:04:23': 'Intel',
  '00:07:E9': 'Intel',
  '00:0C:F1': 'Intel',
  '00:0E:0C': 'Intel',
  '00:0E:35': 'Intel',
  '00:11:11': 'Intel',
  '00:12:F0': 'Intel',
  '00:13:02': 'Intel',
  '00:13:20': 'Intel',
  '00:13:CE': 'Intel',
  '00:13:E8': 'Intel',
  '00:15:00': 'Intel',
  '00:15:17': 'Intel',
  
  // Microsoft
  '00:03:FF': 'Microsoft',
  '00:0D:3A': 'Microsoft',
  '00:12:5A': 'Microsoft',
  '00:15:5D': 'Microsoft',
  '00:17:FA': 'Microsoft',
  '00:1D:D8': 'Microsoft',
  '00:22:48': 'Microsoft',
  '00:25:AE': 'Microsoft',
  '00:50:F2': 'Microsoft',
  
  // Google
  '00:1A:11': 'Google',
  '3C:5A:B4': 'Google',
  '54:60:09': 'Google',
  '94:EB:2C': 'Google',
  'F4:F5:D8': 'Google',
  'F4:F5:E8': 'Google',
  
  // Huawei
  '00:18:82': 'Huawei',
  '00:1E:10': 'Huawei',
  '00:22:A1': 'Huawei',
  '00:25:68': 'Huawei',
  '00:25:9E': 'Huawei',
  '00:25:9F': 'Huawei',
  '00:46:4B': 'Huawei',
  '00:66:4B': 'Huawei',
  '00:9A:CD': 'Huawei',
  '00:E0:FC': 'Huawei',
  
  // Synology
  '00:11:32': 'Synology',
}

export class OuiLookup {
  lookup(mac: string): string {
    // Normalize MAC address
    const normalized = mac.toUpperCase().replace(/[^0-9A-F]/g, '')
    
    // Try different prefix lengths (some vendors use 6, 7, or 9 characters)
    const prefix6 = `${normalized.slice(0, 2)}:${normalized.slice(2, 4)}:${normalized.slice(4, 6)}`
    
    if (OUI_DATABASE[prefix6]) {
      return OUI_DATABASE[prefix6]
    }

    return 'Unknown'
  }
}
