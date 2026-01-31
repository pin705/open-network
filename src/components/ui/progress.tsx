import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const progressVariants = cva(
  'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: {
        default: 'h-4',
        sm: 'h-2',
        lg: 'h-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number
  indicatorClassName?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, size, indicatorClassName, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(progressVariants({ size }), className)}
      {...props}
    >
      <div
        className={cn(
          'h-full w-full flex-1 bg-primary transition-all',
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
)
Progress.displayName = 'Progress'

export { Progress }
