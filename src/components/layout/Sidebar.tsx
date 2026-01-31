import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Wifi, 
  LineChart, 
  Wrench, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/scanner', icon: Wifi, label: 'Scanner' },
  { path: '/analytics', icon: LineChart, label: 'Analytics' },
  { path: '/toolbox', icon: Wrench, label: 'Toolbox' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside 
      className={cn(
        "flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-8 h-8 text-primary" />
            <div className="absolute inset-0 animate-pulse-signal">
              <Radio className="w-8 h-8 text-primary opacity-50" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">Open</span>
              <span className="text-xs text-muted-foreground -mt-1">Network</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            const linkContent = (
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200",
                  "hover:bg-accent/50",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.path}>{linkContent}</div>
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Button */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "w-full justify-center",
            !collapsed && "justify-start"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
