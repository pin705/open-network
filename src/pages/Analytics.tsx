import { useWifiScanner } from '@/hooks/useWifiScanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignalChart } from '../components/analytics/SignalChart'
import { ChannelChart } from '../components/analytics/ChannelChart'
import { SecurityChart } from '../components/analytics/SecurityChart'
import { BandDistribution } from '../components/analytics/BandDistribution'
import { LineChart, BarChart3, PieChart, Radio } from 'lucide-react'

export default function Analytics() {
  const { 
    networks, 
    signalHistory, 
    securityStats,
    networksByBand,
  } = useWifiScanner()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Signal Analytics</h1>
        <p className="text-muted-foreground">
          Detailed analysis and visualization of your wireless environment
        </p>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="signal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="signal" className="gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Signal</span>
          </TabsTrigger>
          <TabsTrigger value="channels" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Channels</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="bands" className="gap-2">
            <Radio className="h-4 w-4" />
            <span className="hidden sm:inline">Bands</span>
          </TabsTrigger>
        </TabsList>

        {/* Signal Strength Tab */}
        <TabsContent value="signal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Signal Strength</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track your connected network's signal stability over time
              </p>
            </CardHeader>
            <CardContent>
              <SignalChart data={signalHistory} />
            </CardContent>
          </Card>

          {/* Signal Quality Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Signal Quality Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Excellent', range: '-30 to -50', color: 'bg-emerald-500' },
                  { label: 'Good', range: '-50 to -60', color: 'bg-green-500' },
                  { label: 'Fair', range: '-60 to -70', color: 'bg-amber-500' },
                  { label: 'Weak', range: '-70 to -80', color: 'bg-orange-500' },
                  { label: 'Poor', range: '-80 to -100', color: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <div>
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.range} dBm</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channel Analysis Tab */}
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Channel Interference Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Find the least congested channel for optimal performance
              </p>
            </CardHeader>
            <CardContent>
              <ChannelChart networks={networks} />
            </CardContent>
          </Card>

          {/* Channel Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="font-medium text-emerald-500">Best 2.4 GHz Channels</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use channels 1, 6, or 11 to minimize interference. These non-overlapping channels prevent crosstalk.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-medium text-blue-500">Best 5 GHz Channels</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    5 GHz offers more non-overlapping channels. Consider channels 36-48 or 149-165 for best results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Analysis Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Breakdown of security protocols in your area
                </p>
              </CardHeader>
              <CardContent>
                <SecurityChart data={securityStats} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {securityStats['Open'] > 0 && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <h4 className="font-medium text-red-500">⚠️ Open Networks Detected</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {securityStats['Open']} open network(s) found. Avoid connecting to these as they offer no encryption.
                    </p>
                  </div>
                )}
                {securityStats['WEP'] > 0 && (
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <h4 className="font-medium text-orange-500">⚠️ WEP Networks Detected</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {securityStats['WEP']} WEP network(s) found. WEP is outdated and easily cracked.
                    </p>
                  </div>
                )}
                {securityStats['WPA3'] > 0 && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <h4 className="font-medium text-emerald-500">✓ WPA3 Networks Available</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {securityStats['WPA3']} WPA3 network(s) found. This is the most secure standard available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Band Distribution Tab */}
        <TabsContent value="bands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequency Band Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare 2.4 GHz vs 5 GHz network density
              </p>
            </CardHeader>
            <CardContent>
              <BandDistribution networksByBand={networksByBand} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
