import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'

interface ChannelMiniChartProps {
  data: Record<number, number>
}

export function ChannelMiniChart({ data }: ChannelMiniChartProps) {
  // All 2.4 GHz channels
  const channels24 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  
  const chartData = channels24.map(channel => ({
    channel: channel.toString(),
    count: data[channel] || 0,
  }))

  const maxCount = Math.max(...Object.values(data), 1)

  const getColor = (count: number) => {
    if (count === 0) return 'hsl(142, 76%, 36%)'
    if (count <= maxCount * 0.33) return 'hsl(142, 69%, 58%)'
    if (count <= maxCount * 0.66) return 'hsl(48, 96%, 53%)'
    return 'hsl(0, 84%, 60%)'
  }

  if (Object.keys(data).length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        <p>No channel data yet...</p>
      </div>
    )
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <XAxis 
            dataKey="channel" 
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value} networks`, 'Channel']}
            labelFormatter={(label) => `Channel ${label}`}
          />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
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
  )
}
