import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main 
            className={cn(
              "flex-1 overflow-auto p-6 transition-all duration-300",
              sidebarCollapsed ? "ml-0" : "ml-0"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
