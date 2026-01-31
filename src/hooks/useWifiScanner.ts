import { useEffect, useRef } from 'react'
import { useWifiStore } from '@/stores/wifi-store'

export function useWifiScanner() {
  const { 
    networks, 
    connectedNetwork, 
    scanning, 
    lastScanTime,
    signalHistory,
    autoRefresh,
    autoRefreshInterval,
    scan,
    setAutoRefresh,
    setAutoRefreshInterval,
  } = useWifiStore()
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initial scan on mount
  useEffect(() => {
    scan()
  }, [scan])

  // Auto-refresh logic
  useEffect(() => {
    if (autoRefresh && autoRefreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        scan()
      }, autoRefreshInterval * 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh, autoRefreshInterval, scan])

  // Computed values
  const networksByBand = {
    '2.4GHz': networks.filter(n => n.band === '2.4GHz'),
    '5GHz': networks.filter(n => n.band === '5GHz'),
    '6GHz': networks.filter(n => n.band === '6GHz'),
  }

  const channelDistribution = networks.reduce((acc, network) => {
    acc[network.channel] = (acc[network.channel] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const securityStats = networks.reduce((acc, network) => {
    acc[network.security] = (acc[network.security] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const averageSignal = networks.length > 0
    ? Math.round(networks.reduce((sum, n) => sum + n.rssi, 0) / networks.length)
    : 0

  return {
    // State
    networks,
    connectedNetwork,
    scanning,
    lastScanTime,
    signalHistory,
    autoRefresh,
    autoRefreshInterval,
    
    // Computed
    networksByBand,
    channelDistribution,
    securityStats,
    averageSignal,
    totalNetworks: networks.length,
    
    // Actions
    scan,
    setAutoRefresh,
    setAutoRefreshInterval,
  }
}
