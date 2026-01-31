import { Menu, Sun, Moon, RefreshCw, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWifiStore } from '@/stores/wifi-store'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { scanning, lastScanTime, scan, networks } = useWifiStore()

  const formatLastScan = () => {
    if (!lastScanTime) return 'Never'
    const diff = Date.now() - lastScanTime.getTime()
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return lastScanTime.toLocaleTimeString()
  }

  return (
    <header className="flex items-center justify-between h-12 px-4 border-b border-border/50 bg-background/80 backdrop-blur-md drag-region">
      <div className="flex items-center gap-3 no-drag">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden h-8 w-8"
        >
          <Menu className="w-4 h-4" />
        </Button>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-[12px]">
          <Circle 
            className={cn(
              "w-2 h-2 fill-current",
              scanning ? "text-yellow-500 animate-pulse" : 
              networks.length > 0 ? "text-green-500" : "text-muted-foreground"
            )} 
          />
          <span className="text-muted-foreground">
            {scanning ? 'Scanning...' : 
             networks.length > 0 ? `${networks.length} networks` : 'Ready'}
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span className="text-muted-foreground">{formatLastScan()}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 no-drag">
        <Button
          variant="ghost"
          size="sm"
          onClick={scan}
          disabled={scanning}
          className={cn(
            "h-8 px-3 gap-2 text-[13px] font-medium rounded-lg",
            "bg-primary/10 text-primary hover:bg-primary/20",
            scanning && "opacity-70"
          )}
        >
          <RefreshCw className={cn("w-3.5 h-3.5", scanning && 'animate-spin')} />
          {scanning ? 'Scanning' : 'Scan'}
        </Button>

        <div className="w-px h-5 bg-border/50 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-lg"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  )
}
