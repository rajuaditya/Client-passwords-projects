import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  outline: 'border border-border text-muted-foreground',
}

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
