import { cn } from '../../lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'audio' | 'video' | 'muted'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium font-mono uppercase tracking-wide',
        variant === 'default' && 'bg-zinc-800 text-zinc-400',
        variant === 'audio' && 'bg-blue-900/40 text-blue-400',
        variant === 'video' && 'bg-violet-900/40 text-violet-400',
        variant === 'muted' && 'bg-zinc-900 text-zinc-600',
        className
      )}
      {...props}
    />
  )
}
