import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { WifiNetwork } from '@/lib/types'

interface ChannelChartProps {
  networks: WifiNetwork[]
}

export function ChannelChart({ networks }: ChannelChartProps) {
  const [band, setBand] = useState<'2.4' | '5'>('2.4')

  // 2.4 GHz channels (1-14)
  const channels24 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  
  // 5 GHz channels (common ones)
  const channels5 = [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165]

  const channels = band === '2.4' ? channels24 : channels5

  const chartData = channels.map(channel => {
    const channelNetworks = networks.filter(n => n.channel === channel)
    return {
      channel: channel.toString(),
      count: channelNetworks.length,
      networks: channelNetworks.map(n => n.ssid).join(', '),
    }
  })

  const getColor = (count: number) => {
    if (count === 0) return 'hsl(142, 76%, 36%)' // Green - clean
    if (count === 1) return 'hsl(142, 69%, 58%)' // Light green
    if (count === 2) return 'hsl(48, 96%, 53%)' // Yellow
    if (count === 3) return 'hsl(25, 95%, 53%)' // Orange
    return 'hsl(0, 84%, 60%)' // Red - congested
  }

  // Find best channels
  const cleanChannels = chartData
    .filter(c => c.count === 0)
    .map(c => c.channel)
    .slice(0, 3)

  return (
    <div className="space-y-4">
      {/* Band Selector */}
      <Tabs value={band} onValueChange={(v) => setBand(v as '2.4' | '5')}>
        <TabsList>
          <TabsTrigger value="2.4">2.4 GHz</TabsTrigger>
          <TabsTrigger value="5">5 GHz</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Clean channel recommendation */}
      {cleanChannels.length > 0 && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-sm">
            <span className="font-medium text-emerald-500">✓ Recommended channels: </span>
            {cleanChannels.join(', ')}
          </span>
        </div>
      )}

      {/* Chart */}
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
          >
            <XAxis 
              dataKey="channel" 
              tick={{ fontSize: 10 }}
              className="text-muted-foreground"
              tickLine={false}
              interval={band === '5' ? 2 : 0}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickLine={false}
              allowDecimals={false}
              label={{ value: 'Networks', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="p-3 rounded-lg bg-card border shadow-lg">
                      <p className="font-medium">Channel {data.channel}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.count} network{data.count !== 1 ? 's' : ''}
                      </p>
                      {data.networks && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                          {data.networks}
                        </p>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.count)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-muted-foreground">Clean</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span className="text-muted-foreground">Moderate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-muted-foreground">Congested</span>
        </div>
      </div>
    </div>
  )
}
