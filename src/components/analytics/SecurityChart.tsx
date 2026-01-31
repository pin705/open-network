import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface SecurityChartProps {
  data: Record<string, number>
}

const SECURITY_COLORS: Record<string, string> = {
  'WPA3': 'hsl(142, 76%, 36%)',
  'WPA2/WPA3': 'hsl(142, 70%, 45%)',
  'WPA2': 'hsl(142, 69%, 58%)',
  'WPA': 'hsl(48, 96%, 53%)',
  'WEP': 'hsl(25, 95%, 53%)',
  'Open': 'hsl(0, 84%, 60%)',
}

export function SecurityChart({ data }: SecurityChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    color: SECURITY_COLORS[name] || 'hsl(var(--muted))',
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>No security data available</p>
      </div>
    )
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number, name: string) => [
              `${value} networks (${((value / total) * 100).toFixed(1)}%)`,
              name
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
