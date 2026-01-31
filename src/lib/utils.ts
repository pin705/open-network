import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert RSSI to signal quality percentage
 * RSSI typically ranges from -30 (excellent) to -100 (no signal)
 */
export function rssiToQuality(rssi: number): number {
  if (rssi >= -30) return 100
  if (rssi <= -100) return 0
  return Math.round(((rssi + 100) / 70) * 100)
}

/**
 * Get signal strength label from RSSI
 */
export function getSignalStrength(rssi: number): 'excellent' | 'good' | 'fair' | 'weak' | 'poor' {
  if (rssi >= -50) return 'excellent'
  if (rssi >= -60) return 'good'
  if (rssi >= -70) return 'fair'
  if (rssi >= -80) return 'weak'
  return 'poor'
}

/**
 * Get frequency band from channel number
 */
export function getBandFromChannel(channel: number): '2.4GHz' | '5GHz' | '6GHz' {
  if (channel >= 1 && channel <= 14) return '2.4GHz'
  if (channel >= 32 && channel <= 177) return '5GHz'
  return '6GHz'
}

/**
 * Format MAC address
 */
export function formatMac(mac: string): string {
  return mac.toUpperCase().replace(/(.{2})/g, '$1:').slice(0, -1)
}

/**
 * Get security color class
 */
export function getSecurityColor(security: string): string {
  switch (security) {
    case 'WPA3':
    case 'WPA2/WPA3':
      return 'text-signal-excellent bg-signal-excellent/10'
    case 'WPA2':
      return 'text-signal-good bg-signal-good/10'
    case 'WPA':
      return 'text-signal-fair bg-signal-fair/10'
    case 'WEP':
      return 'text-signal-weak bg-signal-weak/10'
    case 'Open':
      return 'text-signal-poor bg-signal-poor/10'
    default:
      return 'text-muted-foreground bg-muted'
  }
}

/**
 * Format speed with appropriate unit
 */
export function formatSpeed(mbps: number): string {
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(1)} Gbps`
  }
  return `${mbps.toFixed(1)} Mbps`
}

/**
 * Format latency
 */
export function formatLatency(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(0)} µs`
  }
  return `${ms.toFixed(1)} ms`
}
