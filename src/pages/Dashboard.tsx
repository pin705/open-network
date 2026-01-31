import { useWifiScanner } from '@/hooks/useWifiScanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Wifi, 
  Signal, 
  Shield, 
  Radio,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { rssiToQuality, getSignalStrength, getSecurityColor } from '@/lib/utils'
import { SignalMiniChart } from '@/components/dashboard/SignalMiniChart'
import { NetworkQuickList } from '@/components/dashboard/NetworkQuickList'
import { ChannelMiniChart } from '@/components/dashboard/ChannelMiniChart'

export default function Dashboard() {
  const { 
    networks, 
    connectedNetwork, 
    totalNetworks,
    securityStats,
    networksByBand,
    signalHistory,
    channelDistribution,
  } = useWifiScanner()

  const insecureNetworks = (securityStats['Open'] || 0) + (securityStats['WEP'] || 0)
  const signalQuality = connectedNetwork ? rssiToQuality(connectedNetwork.rssi) : 0
  const signalLevel = connectedNetwork ? getSignalStrength(connectedNetwork.rssi) : 'poor'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your wireless environment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Networks */}
        <Card className="glass-card gradient-blue">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Networks Found
            </CardTitle>
            <Wifi className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalNetworks}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {networksByBand['2.4GHz'].length} 2.4G
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {networksByBand['5GHz'].length} 5G
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Connected Network */}
        <Card className="glass-card gradient-green">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Connected
            </CardTitle>
            <Radio className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {connectedNetwork?.ssid || 'Not connected'}
            </div>
            {connectedNetwork && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  Ch {connectedNetwork.channel}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {connectedNetwork.band}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signal Strength */}
        <Card className="glass-card gradient-yellow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Signal Strength
            </CardTitle>
            <Signal className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {connectedNetwork?.rssi || '--'}
              </span>
              <span className="text-muted-foreground">dBm</span>
            </div>
            <div className="mt-2">
              <Progress 
                value={signalQuality} 
                className="h-2"
                indicatorClassName={
                  signalLevel === 'excellent' ? 'bg-emerald-500' :
                  signalLevel === 'good' ? 'bg-green-500' :
                  signalLevel === 'fair' ? 'bg-amber-500' :
                  signalLevel === 'weak' ? 'bg-orange-500' :
                  'bg-red-500'
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card className="glass-card gradient-red">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Security
            </CardTitle>
            <Shield className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            {connectedNetwork && (
              <>
                <div className="flex items-center gap-2">
                  <Badge className={getSecurityColor(connectedNetwork.security)}>
                    {connectedNetwork.security}
                  </Badge>
                </div>
                {insecureNetworks > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-amber-500">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{insecureNetworks} insecure nearby</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signal History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Signal History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time signal strength tracking
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <SignalMiniChart data={signalHistory} />
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Channel Usage</CardTitle>
              <p className="text-sm text-muted-foreground">
                Find the cleanest channel
              </p>
            </div>
            <Radio className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ChannelMiniChart data={channelDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Network List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nearby Networks</CardTitle>
          <p className="text-sm text-muted-foreground">
            Quick overview of all detected networks
          </p>
        </CardHeader>
        <CardContent>
          <NetworkQuickList networks={networks.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  )
}
