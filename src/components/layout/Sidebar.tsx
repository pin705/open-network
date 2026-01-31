import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Wifi, 
  LineChart, 
  Wrench, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', description: 'Overview' },
  { path: '/scanner', icon: Wifi, label: 'Scanner', description: 'WiFi networks' },
  { path: '/analytics', icon: LineChart, label: 'Analytics', description: 'Signal data' },
  { path: '/toolbox', icon: Wrench, label: 'Toolbox', description: 'Network tools' },
  { path: '/settings', icon: Settings, label: 'Settings', description: 'Preferences' },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside 
      className={cn(
        "flex flex-col h-full macos-sidebar border-r border-border/50 transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo & App Title */}
      <div className="flex items-center h-14 px-4 border-b border-border/30 drag-region">
        <div className="flex items-center gap-3 no-drag">
          {/* macOS-style App Icon */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <Wifi className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-[15px] leading-tight tracking-tight">Open Network</span>
              <span className="text-[11px] text-muted-foreground">WiFi Analyzer</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          const linkContent = (
            <NavLink
              to={item.path}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-[13px] transition-all duration-150",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                collapsed && "justify-center px-2"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary/15" 
                  : "bg-transparent group-hover:bg-accent"
              )}>
                <Icon className={cn(
                  "w-[18px] h-[18px]", 
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className={cn(isActive && "text-primary")}>{item.label}</span>
                </div>
              )}
            </NavLink>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  {linkContent}
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  sideOffset={8}
                  className="font-medium text-[13px] px-3 py-1.5"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          }

          return <div key={item.path}>{linkContent}</div>
        })}
      </nav>

      {/* Bottom section with version & collapse */}
      <div className="px-2 py-3 border-t border-border/30 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2">
            <div className="text-[11px] text-muted-foreground">
              <span className="font-medium">v1.0.0</span>
              <span className="mx-1.5">•</span>
              <span className="text-green-500">●</span>
              <span className="ml-1">Ready</span>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "w-full h-8 text-muted-foreground hover:text-foreground",
            collapsed ? "justify-center" : "justify-start px-3"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-[13px]">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
