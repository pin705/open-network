import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { WifiNetwork } from '@/lib/types'

interface BandDistributionProps {
  networksByBand: {
    '2.4GHz': WifiNetwork[]
    '5GHz': WifiNetwork[]
    '6GHz': WifiNetwork[]
  }
}

const BAND_COLORS = {
  '2.4GHz': 'hsl(221.2 83.2% 53.3%)',
  '5GHz': 'hsl(142, 76%, 36%)',
  '6GHz': 'hsl(280, 65%, 60%)',
}

export function BandDistribution({ networksByBand }: BandDistributionProps) {
  const chartData = [
    { band: '2.4 GHz', count: networksByBand['2.4GHz'].length, key: '2.4GHz' },
    { band: '5 GHz', count: networksByBand['5GHz'].length, key: '5GHz' },
    { band: '6 GHz', count: networksByBand['6GHz'].length, key: '6GHz' },
  ]


  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="band" 
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value} networks`, 'Count']}
            />
            <Bar 
              dataKey="count" 
              radius={[0, 4, 4, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={BAND_COLORS[entry.key as keyof typeof BAND_COLORS]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Band Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(networksByBand).map(([band, networks]) => (
          <div 
            key={band} 
            className="p-4 rounded-lg border"
            style={{ borderLeftColor: BAND_COLORS[band as keyof typeof BAND_COLORS], borderLeftWidth: 4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">{band}</span>
              <Badge variant="outline">{networks.length} networks</Badge>
            </div>
            
            {networks.length > 0 ? (
              <ScrollArea className="h-[120px]">
                <div className="space-y-2">
                  {networks.slice(0, 5).map((network) => (
                    <div 
                      key={network.bssid}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate max-w-[120px]">
                        {network.ssid || 'Hidden'}
                      </span>
                      <span className="text-muted-foreground">
                        {network.rssi} dBm
                      </span>
                    </div>
                  ))}
                  {networks.length > 5 && (
                    <div className="text-xs text-muted-foreground">
                      +{networks.length - 5} more
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[120px] flex items-center justify-center text-sm text-muted-foreground">
                No networks
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Band Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <h4 className="font-medium text-blue-500">2.4 GHz</h4>
          <p className="text-muted-foreground mt-1">
            Better range, more interference. Good for IoT devices.
          </p>
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <h4 className="font-medium text-emerald-500">5 GHz</h4>
          <p className="text-muted-foreground mt-1">
            Faster speeds, less interference. Ideal for streaming.
          </p>
        </div>
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <h4 className="font-medium text-purple-500">6 GHz (WiFi 6E)</h4>
          <p className="text-muted-foreground mt-1">
            Newest band, minimal congestion. Requires WiFi 6E devices.
          </p>
        </div>
      </div>
    </div>
  )
}
