import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

interface SignalHistory {
  time: Date
  rssi: number
  ssid: string
}

interface SignalMiniChartProps {
  data: SignalHistory[]
}

export function SignalMiniChart({ data }: SignalMiniChartProps) {
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
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        <p>Waiting for signal data...</p>
      </div>
    )
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            tickLine={false}
          />
          <YAxis 
            domain={[-100, -30]}
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            tickLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelClassName="text-foreground"
            formatter={(value: number) => [`${value} dBm`, 'Signal']}
          />
          <ReferenceLine 
            y={-50} 
            stroke="hsl(142, 76%, 36%)" 
            strokeDasharray="5 5"
            label={{ value: 'Excellent', position: 'right', fontSize: 10 }}
          />
          <ReferenceLine 
            y={-70} 
            stroke="hsl(48, 96%, 53%)" 
            strokeDasharray="5 5"
            label={{ value: 'Fair', position: 'right', fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey="rssi"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
