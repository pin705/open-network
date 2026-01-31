import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Gauge, 
  Timer, 
  Network, 
  Play, 
  Globe,
  Server,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowDown,
  ArrowUp,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PingResult {
  host: string
  latency: number
  success: boolean
  timestamp: Date
}

interface LocalDevice {
  ip: string
  mac: string
  hostname?: string
  vendor?: string
}

export default function Toolbox() {
  const [speedTestRunning, setSpeedTestRunning] = useState(false)
  const [speedTestProgress, setSpeedTestProgress] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null)
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null)
  const [testPing, setTestPing] = useState<number | null>(null)
  const [pingResults, setPingResults] = useState<PingResult[]>([])
  const [pingRunning, setPingRunning] = useState(false)
  const [pingHost, setPingHost] = useState('8.8.8.8')
  const [localDevices, setLocalDevices] = useState<LocalDevice[]>([])
  const [networkScanRunning, setNetworkScanRunning] = useState(false)

  // Real speed test using Electron API
  const runSpeedTest = async () => {
    if (!window.electronAPI) return
    
    setSpeedTestRunning(true)
    setSpeedTestProgress(0)
    setDownloadSpeed(null)
    setUploadSpeed(null)
    setTestPing(null)

    try {
      // Simulate progress animation
      const progressInterval = setInterval(() => {
        setSpeedTestProgress(prev => Math.min(prev + 2, 95))
      }, 100)

      const result = await window.electronAPI.speedTest()
      
      clearInterval(progressInterval)
      setSpeedTestProgress(100)
      setDownloadSpeed(result.download)
      setUploadSpeed(result.upload)
      setTestPing(result.ping)
    } catch (error) {
      console.error('Speed test failed:', error)
    }
    
    setSpeedTestRunning(false)
  }

  // Real ping test using Electron API
  const runPing = async () => {
    if (!window.electronAPI) return
    
    setPingRunning(true)
    setPingResults([])
    
    try {
      const result = await window.electronAPI.pingHost(pingHost)
      setPingResults([{
        host: result.host,
        latency: result.latency,
        success: result.success,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Ping failed:', error)
    }
    
    setPingRunning(false)
  }

  // Real network scan using Electron API
  const scanLocalNetwork = async () => {
    if (!window.electronAPI) return
    
    setNetworkScanRunning(true)
    
    try {
      const devices = await window.electronAPI.scanLocalNetwork()
      setLocalDevices(devices)
    } catch (error) {
      console.error('Network scan failed:', error)
    }
    
    setNetworkScanRunning(false)
  }

  const avgLatency = pingResults.length > 0
    ? (pingResults.reduce((sum, r) => sum + r.latency, 0) / pingResults.length).toFixed(1)
    : null

  const packetLoss = pingResults.length > 0
    ? ((pingResults.filter(r => !r.success).length / pingResults.length) * 100).toFixed(0)
    : null

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Network Toolbox</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Test your network performance and discover local devices
        </p>
      </div>

      <Tabs defaultValue="speedtest" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="speedtest" className="gap-2 text-[13px]">
            <Gauge className="h-4 w-4" />
            Speed Test
          </TabsTrigger>
          <TabsTrigger value="ping" className="gap-2 text-[13px]">
            <Timer className="h-4 w-4" />
            Ping
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2 text-[13px]">
            <Network className="h-4 w-4" />
            Network Scan
          </TabsTrigger>
        </TabsList>

        {/* Speed Test Tab */}
        <TabsContent value="speedtest">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                Internet Speed Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Speed Results */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/10 text-center">
                  <ArrowDown className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-500">
                    {downloadSpeed !== null ? downloadSpeed.toFixed(1) : '--'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Download Mbps</div>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/10 text-center">
                  <ArrowUp className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-emerald-500">
                    {uploadSpeed !== null ? uploadSpeed.toFixed(1) : '--'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Upload Mbps</div>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/10 text-center">
                  <Timer className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-amber-500">
                    {testPing !== null ? Math.round(testPing) : '--'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Ping ms</div>
                </div>
              </div>

              {/* Progress Bar */}
              {speedTestRunning && (
                <div className="space-y-2">
                  <Progress value={speedTestProgress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    Testing connection to Cloudflare servers...
                  </p>
                </div>
              )}

              {/* Start Button */}
              <div className="flex justify-center pt-2">
                <Button 
                  size="lg" 
                  onClick={runSpeedTest} 
                  disabled={speedTestRunning}
                  className="gap-2 px-8 h-11"
                >
                  {speedTestRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Speed Test
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ping Tab */}
        <TabsContent value="ping">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Timer className="h-4 w-4 text-primary" />
                </div>
                Ping & Latency Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Host (IP or domain)"
                  value={pingHost}
                  onChange={(e) => setPingHost(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={runPing} disabled={pingRunning} className="gap-2 shrink-0">
                  {pingRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Ping
                </Button>
              </div>

              {/* Quick ping targets */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Quick:</span>
                {['8.8.8.8', '1.1.1.1', 'google.com', 'cloudflare.com'].map(host => (
                  <Badge
                    key={host}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent text-[11px]"
                    onClick={() => setPingHost(host)}
                  >
                    {host}
                  </Badge>
                ))}
              </div>

              {/* Results */}
              {pingResults.length > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                      <div className="text-xs text-muted-foreground">Latency</div>
                      <div className="text-2xl font-bold mt-1">{avgLatency} ms</div>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 text-center">
                      <div className="text-xs text-muted-foreground">Packet Loss</div>
                      <div className={cn(
                        "text-2xl font-bold mt-1",
                        Number(packetLoss) > 0 ? "text-red-500" : "text-emerald-500"
                      )}>
                        {packetLoss}%
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-xs">Host</TableHead>
                          <TableHead className="text-xs">Latency</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pingResults.map((result, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono text-[13px]">{result.host}</TableCell>
                            <TableCell className="text-[13px]">{result.latency.toFixed(1)} ms</TableCell>
                            <TableCell>
                              {result.success ? (
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Scan Tab */}
        <TabsContent value="network">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                    <Network className="h-4 w-4 text-primary" />
                  </div>
                  Local Network Devices
                </CardTitle>
                <Button onClick={scanLocalNetwork} disabled={networkScanRunning} className="gap-2">
                  {networkScanRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                  Scan Network
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {localDevices.length > 0 ? (
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs">IP Address</TableHead>
                        <TableHead className="text-xs">MAC Address</TableHead>
                        <TableHead className="text-xs">Vendor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localDevices.map((device, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-[13px]">{device.ip}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{device.mac}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">
                              {device.vendor || 'Unknown'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Server className="h-10 w-10 mb-3 text-muted-foreground/50" />
                  <p className="text-sm">Click "Scan Network" to discover devices</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
