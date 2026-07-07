import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-xs font-medium text-muted-foreground', className)}
    {...props}
  />
))
Label.displayName = 'Label'
