import { Menu, Sun, Moon, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWifiStore } from '@/stores/wifi-store'
import { useTheme } from '@/hooks/useTheme'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { scanning, lastScanTime, scan } = useWifiStore()

  const formatLastScan = () => {
    if (!lastScanTime) return 'Never'
    const diff = Date.now() - lastScanTime.getTime()
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return lastScanTime.toLocaleTimeString()
  }

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Last scan:</span>
          <span className="font-medium text-foreground">{formatLastScan()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={scan}
          disabled={scanning}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Scan Now'}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>
    </header>
  )
}
