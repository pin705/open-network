import { useState, useMemo } from 'react'
import { useWifiScanner } from '@/hooks/useWifiScanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Search, 
  Download, 
  RefreshCw,
  Wifi,
  WifiOff,
  ArrowUpDown,
  Filter
} from 'lucide-react'
import { cn, rssiToQuality, getSignalStrength, getSecurityColor } from '@/lib/utils'
import { SignalBars } from '@/components/scanner/SignalBars'

type SortKey = 'ssid' | 'rssi' | 'channel' | 'security'
type SortOrder = 'asc' | 'desc'

export default function Scanner() {
  const { networks, scanning, scan } = useWifiScanner()
  const [searchQuery, setSearchQuery] = useState('')
  const [bandFilter, setBandFilter] = useState<'all' | '2.4GHz' | '5GHz'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('rssi')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const filteredNetworks = useMemo(() => {
    let result = [...networks]

    // Filter by search
    if (searchQuery) {
      result = result.filter(n => 
        n.ssid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.bssid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by band
    if (bandFilter !== 'all') {
      result = result.filter(n => n.band === bandFilter)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortKey) {
        case 'ssid':
          comparison = a.ssid.localeCompare(b.ssid)
          break
        case 'rssi':
          comparison = a.rssi - b.rssi
          break
        case 'channel':
          comparison = a.channel - b.channel
          break
        case 'security':
          comparison = a.security.localeCompare(b.security)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [networks, searchQuery, bandFilter, sortKey, sortOrder])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const exportToCSV = () => {
    const headers = ['SSID', 'BSSID', 'Signal (dBm)', 'Channel', 'Band', 'Security', 'Vendor']
    const rows = filteredNetworks.map(n => [
      n.ssid,
      n.bssid,
      n.rssi,
      n.channel,
      n.band,
      n.security,
      n.vendor
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wifi-scan-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WiFi Scanner</h1>
          <p className="text-muted-foreground">
            Scan and analyze all nearby wireless networks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={scan} disabled={scanning}>
            <RefreshCw className={cn("h-4 w-4 mr-2", scanning && "animate-spin")} />
            {scanning ? 'Scanning...' : 'Scan'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by SSID, BSSID, or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={bandFilter} onValueChange={(v) => setBandFilter(v as typeof bandFilter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="2.4GHz">2.4 GHz</TabsTrigger>
                <TabsTrigger value="5GHz">5 GHz</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Network Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {filteredNetworks.length} Networks
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Click headers to sort</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Signal</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('ssid')}
                  >
                    <div className="flex items-center gap-1">
                      SSID
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>BSSID</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('channel')}
                  >
                    <div className="flex items-center gap-1">
                      Channel
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Band</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('security')}
                  >
                    <div className="flex items-center gap-1">
                      Security
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground text-right"
                    onClick={() => handleSort('rssi')}
                  >
                    <div className="flex items-center gap-1 justify-end">
                      RSSI
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNetworks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <WifiOff className="h-8 w-8" />
                        <span>No networks found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNetworks.map((network, index) => (
                    <TableRow key={network.bssid} className={network.isConnected ? 'bg-primary/5' : ''}>
                      <TableCell>
                        <SignalBars rssi={network.rssi} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {network.ssid || <span className="text-muted-foreground italic">Hidden</span>}
                          {network.isConnected && (
                            <Badge variant="success" className="text-xs">Connected</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {network.bssid}
                      </TableCell>
                      <TableCell className="text-sm">{network.vendor}</TableCell>
                      <TableCell>{network.channel}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{network.band}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSecurityColor(network.security)}>
                          {network.security}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {network.rssi} dBm
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
