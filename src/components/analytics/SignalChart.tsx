import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts'

interface SignalHistory {
  time: Date
  rssi: number
  ssid: string
}

interface SignalChartProps {
  data: SignalHistory[]
}

export function SignalChart({ data }: SignalChartProps) {
  const chartData = data.map((entry, index) => ({
    time: entry.time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }),
    rssi: entry.rssi,
    index,
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground">
        <div className="text-4xl mb-4">📡</div>
        <p className="text-lg">Waiting for signal data...</p>
        <p className="text-sm">Connect to a network to start tracking</p>
      </div>
    )
  }

  const avgRssi = Math.round(data.reduce((sum, d) => sum + d.rssi, 0) / data.length)
  const minRssi = Math.min(...data.map(d => d.rssi))
  const maxRssi = Math.max(...data.map(d => d.rssi))

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <div className="text-xs text-muted-foreground">Current</div>
          <div className="text-xl font-bold">{data[data.length - 1]?.rssi || '--'} dBm</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <div className="text-xs text-muted-foreground">Average</div>
          <div className="text-xl font-bold">{avgRssi} dBm</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <div className="text-xs text-muted-foreground">Range</div>
          <div className="text-xl font-bold">{minRssi} to {maxRssi}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[-100, -20]}
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickLine={false}
              tickFormatter={(value) => `${value}`}
              label={{ value: 'dBm', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`${value} dBm`, 'Signal Strength']}
            />
            
            {/* Reference lines for signal quality zones */}
            <ReferenceLine 
              y={-50} 
              stroke="hsl(142, 76%, 36%)" 
              strokeDasharray="5 5"
            />
            <ReferenceLine 
              y={-60} 
              stroke="hsl(142, 69%, 58%)" 
              strokeDasharray="5 5"
            />
            <ReferenceLine 
              y={-70} 
              stroke="hsl(48, 96%, 53%)" 
              strokeDasharray="5 5"
            />
            <ReferenceLine 
              y={-80} 
              stroke="hsl(0, 84%, 60%)" 
              strokeDasharray="5 5"
            />

            <Area
              type="monotone"
              dataKey="rssi"
              stroke="transparent"
              fill="url(#signalGradient)"
            />
            <Line
              type="monotone"
              dataKey="rssi"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
