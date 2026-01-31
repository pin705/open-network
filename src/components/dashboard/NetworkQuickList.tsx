import { Badge } from '@/components/ui/badge'
import { SignalBars } from '@/components/scanner/SignalBars'
import { getSecurityColor } from '@/lib/utils'
import { Wifi } from 'lucide-react'
import { WifiNetwork } from '@/lib/types'

interface NetworkQuickListProps {
  networks: WifiNetwork[]
}

export function NetworkQuickList({ networks }: NetworkQuickListProps) {
  if (networks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Wifi className="h-8 w-8 mb-2" />
        <p>No networks detected</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {networks.map((network) => (
        <div
          key={network.bssid}
          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
            network.isConnected 
              ? 'bg-primary/5 border-primary/20' 
              : 'bg-muted/50 hover:bg-muted'
          }`}
        >
          <div className="flex items-center gap-3">
            <SignalBars rssi={network.rssi} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {network.ssid || <span className="italic text-muted-foreground">Hidden</span>}
                </span>
                {network.isConnected && (
                  <Badge variant="success" className="text-xs">Connected</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {network.vendor} • Ch {network.channel}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {network.band}
            </Badge>
            <Badge className={getSecurityColor(network.security)}>
              {network.security}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
