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
  Square,
  Globe,
  Server,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'

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
  const [pingResults, setPingResults] = useState<PingResult[]>([])
  const [pingRunning, setPingRunning] = useState(false)
  const [pingHost, setPingHost] = useState('8.8.8.8')
  const [localDevices, setLocalDevices] = useState<LocalDevice[]>([])
  const [networkScanRunning, setNetworkScanRunning] = useState(false)

  // Mock speed test
  const runSpeedTest = async () => {
    setSpeedTestRunning(true)
    setSpeedTestProgress(0)
    setDownloadSpeed(null)
    setUploadSpeed(null)

    // Simulate download test
    for (let i = 0; i <= 50; i++) {
      await new Promise(r => setTimeout(r, 50))
      setSpeedTestProgress(i)
    }
    setDownloadSpeed(Math.random() * 200 + 50)

    // Simulate upload test
    for (let i = 50; i <= 100; i++) {
      await new Promise(r => setTimeout(r, 50))
      setSpeedTestProgress(i)
    }
    setUploadSpeed(Math.random() * 50 + 20)
    
    setSpeedTestRunning(false)
  }

  // Mock ping test
  const runPing = async () => {
    setPingRunning(true)
    const results: PingResult[] = []
    
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 500))
      const result: PingResult = {
        host: pingHost,
        latency: Math.random() * 30 + 10,
        success: Math.random() > 0.1,
        timestamp: new Date(),
      }
      results.push(result)
      setPingResults([...results])
    }
    
    setPingRunning(false)
  }

  // Mock network scan
  const scanLocalNetwork = async () => {
    setNetworkScanRunning(true)
    await new Promise(r => setTimeout(r, 2000))
    
    setLocalDevices([
      { ip: '192.168.1.1', mac: 'AA:BB:CC:DD:EE:01', hostname: 'router.local', vendor: 'ASUS' },
      { ip: '192.168.1.2', mac: 'AA:BB:CC:DD:EE:02', hostname: 'macbook.local', vendor: 'Apple' },
      { ip: '192.168.1.3', mac: 'AA:BB:CC:DD:EE:03', hostname: 'iphone.local', vendor: 'Apple' },
      { ip: '192.168.1.4', mac: 'AA:BB:CC:DD:EE:04', hostname: 'nas.local', vendor: 'Synology' },
      { ip: '192.168.1.5', mac: 'AA:BB:CC:DD:EE:05', vendor: 'Unknown' },
    ])
    
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
        <h1 className="text-3xl font-bold tracking-tight">Network Toolbox</h1>
        <p className="text-muted-foreground">
          Test your network performance and discover local devices
        </p>
      </div>

      <Tabs defaultValue="speedtest" className="space-y-4">
        <TabsList>
          <TabsTrigger value="speedtest" className="gap-2">
            <Gauge className="h-4 w-4" />
            Speed Test
          </TabsTrigger>
          <TabsTrigger value="ping" className="gap-2">
            <Timer className="h-4 w-4" />
            Ping & Latency
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2">
            <Network className="h-4 w-4" />
            Network Scan
          </TabsTrigger>
        </TabsList>

        {/* Speed Test Tab */}
        <TabsContent value="speedtest">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Internet Speed Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  onClick={runSpeedTest} 
                  disabled={speedTestRunning}
                  className="gap-2 px-8"
                >
                  {speedTestRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Test
                    </>
                  )}
                </Button>
              </div>

              {speedTestRunning && (
                <div className="space-y-2">
                  <Progress value={speedTestProgress} />
                  <p className="text-sm text-center text-muted-foreground">
                    {speedTestProgress <= 50 ? 'Testing download...' : 'Testing upload...'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-lg bg-muted/50 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Download</div>
                  <div className="text-4xl font-bold text-primary">
                    {downloadSpeed !== null ? `${downloadSpeed.toFixed(1)}` : '--'}
                  </div>
                  <div className="text-sm text-muted-foreground">Mbps</div>
                </div>
                <div className="p-6 rounded-lg bg-muted/50 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Upload</div>
                  <div className="text-4xl font-bold text-primary">
                    {uploadSpeed !== null ? `${uploadSpeed.toFixed(1)}` : '--'}
                  </div>
                  <div className="text-sm text-muted-foreground">Mbps</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ping Tab */}
        <TabsContent value="ping">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Ping & Latency Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Host (IP or domain)"
                  value={pingHost}
                  onChange={(e) => setPingHost(e.target.value)}
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
                <span className="text-sm text-muted-foreground">Quick targets:</span>
                {['8.8.8.8', '1.1.1.1', 'google.com', 'cloudflare.com'].map(host => (
                  <Badge
                    key={host}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
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
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm text-muted-foreground">Avg Latency</div>
                      <div className="text-2xl font-bold">{avgLatency} ms</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <div className="text-sm text-muted-foreground">Packet Loss</div>
                      <div className="text-2xl font-bold">{packetLoss}%</div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Host</TableHead>
                          <TableHead>Latency</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pingResults.map((result, i) => (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{result.host}</TableCell>
                            <TableCell>{result.latency.toFixed(1)} ms</TableCell>
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
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP Address</TableHead>
                        <TableHead>MAC Address</TableHead>
                        <TableHead>Hostname</TableHead>
                        <TableHead>Vendor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localDevices.map((device, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono">{device.ip}</TableCell>
                          <TableCell className="font-mono text-muted-foreground">{device.mac}</TableCell>
                          <TableCell>{device.hostname || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{device.vendor}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Server className="h-12 w-12 mb-4" />
                  <p>Click "Scan Network" to discover devices</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
