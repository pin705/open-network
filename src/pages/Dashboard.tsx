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
  AlertTriangle,
  Activity
} from 'lucide-react'
import { rssiToQuality, getSignalStrength } from '@/lib/utils'
import { SignalMiniChart } from '@/components/dashboard/SignalMiniChart'
import { NetworkQuickList } from '@/components/dashboard/NetworkQuickList'
import { ChannelMiniChart } from '@/components/dashboard/ChannelMiniChart'
import { cn } from '@/lib/utils'

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

  const stats = [
    {
      title: 'Networks',
      value: totalNetworks,
      icon: Wifi,
      gradient: 'gradient-blue',
      iconColor: 'text-blue-500',
      subtitle: `${networksByBand['2.4GHz'].length} / ${networksByBand['5GHz'].length}`,
      subtitleLabel: '2.4G / 5G'
    },
    {
      title: 'Connected',
      value: connectedNetwork?.ssid || '—',
      icon: Radio,
      gradient: 'gradient-green',
      iconColor: 'text-emerald-500',
      subtitle: connectedNetwork ? `Ch ${connectedNetwork.channel}` : 'No connection',
      subtitleLabel: connectedNetwork?.band || ''
    },
    {
      title: 'Signal',
      value: connectedNetwork ? `${connectedNetwork.rssi}` : '—',
      unit: 'dBm',
      icon: Signal,
      gradient: 'gradient-yellow',
      iconColor: 'text-amber-500',
      progress: signalQuality,
      progressColor: signalLevel === 'excellent' ? 'bg-emerald-500' :
                     signalLevel === 'good' ? 'bg-green-500' :
                     signalLevel === 'fair' ? 'bg-amber-500' :
                     signalLevel === 'weak' ? 'bg-orange-500' : 'bg-red-500'
    },
    {
      title: 'Security',
      value: connectedNetwork?.security || '—',
      icon: Shield,
      gradient: 'gradient-purple',
      iconColor: 'text-purple-500',
      subtitle: insecureNetworks > 0 ? `${insecureNetworks} insecure nearby` : 'All secure',
      subtitleColor: insecureNetworks > 0 ? 'text-amber-500' : 'text-emerald-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of your wireless environment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {networks.length} networks detected
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className={cn("glass-card", stat.gradient)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-muted-foreground">{stat.title}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className={cn(
                        "font-semibold",
                        typeof stat.value === 'number' ? "text-3xl" : "text-xl truncate max-w-[140px]"
                      )}>
                        {stat.value}
                      </span>
                      {stat.unit && <span className="text-sm text-muted-foreground">{stat.unit}</span>}
                    </div>
                    
                    {stat.progress !== undefined && (
                      <div className="mt-3">
                        <Progress 
                          value={stat.progress} 
                          className="h-1.5"
                          indicatorClassName={stat.progressColor}
                        />
                      </div>
                    )}
                    
                    {stat.subtitle && (
                      <div className={cn(
                        "flex items-center gap-1.5 mt-2 text-xs",
                        stat.subtitleColor || "text-muted-foreground"
                      )}>
                        {stat.subtitleColor?.includes('amber') && <AlertTriangle className="w-3 h-3" />}
                        <span>{stat.subtitle}</span>
                        {stat.subtitleLabel && (
                          <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0">
                            {stat.subtitleLabel}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl bg-background/60",
                    stat.iconColor
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Signal History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Signal History</CardTitle>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Real-time signal strength
              </p>
            </div>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/50">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <SignalMiniChart data={signalHistory} />
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Channel Usage</CardTitle>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Find the cleanest channel
              </p>
            </div>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/50">
              <Radio className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <ChannelMiniChart data={channelDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Network List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Nearby Networks</CardTitle>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                Quick overview of detected networks
              </p>
            </div>
            {networks.length > 5 && (
              <Badge variant="outline">{networks.length} total</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <NetworkQuickList networks={networks.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  )
}
