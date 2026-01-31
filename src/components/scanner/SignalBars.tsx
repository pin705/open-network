import { cn } from '@/lib/utils'
import { getSignalStrength } from '@/lib/utils'

interface SignalBarsProps {
  rssi: number
  className?: string
}

export function SignalBars({ rssi, className }: SignalBarsProps) {
  const strength = getSignalStrength(rssi)
  
  const bars = [
    { height: 'h-2', active: true },
    { height: 'h-3', active: strength !== 'poor' },
    { height: 'h-4', active: strength === 'excellent' || strength === 'good' || strength === 'fair' },
    { height: 'h-5', active: strength === 'excellent' || strength === 'good' },
  ]

  const colorClass = 
    strength === 'excellent' ? 'bg-emerald-500' :
    strength === 'good' ? 'bg-green-500' :
    strength === 'fair' ? 'bg-amber-500' :
    strength === 'weak' ? 'bg-orange-500' :
    'bg-red-500'

  return (
    <div className={cn("flex items-end gap-0.5", className)}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-sm transition-all",
            bar.height,
            bar.active ? colorClass : 'bg-muted'
          )}
        />
      ))}
    </div>
  )
}
