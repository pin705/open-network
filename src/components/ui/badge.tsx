import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-primary/15 text-primary border-transparent',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    destructive: 'bg-destructive/15 text-destructive border-transparent',
    outline: 'text-muted-foreground bg-muted/50 border-border/50',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-transparent',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
