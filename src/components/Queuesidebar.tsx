import { useState } from 'react'
import { ListChecks, X, ChevronDown } from 'lucide-react'
import { cancelJob } from '@/api/videoApi'
import { useJobsStore, type QueueJob } from '@/store/jobStore'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const RANK: Record<string, number> = { active: 0, waiting: 1, delayed: 1 }

function statusVariant(status: string): 'default' | 'audio' | 'video' | 'muted' {
  if (status === 'active') return 'video'
  if (status === 'completed') return 'audio'
  if (status === 'waiting' || status === 'delayed') return 'muted'
  return 'default' // failed / cancelled / cancelling
}

function statusLabel(status: string) {
  switch (status) {
    case 'active': return 'Downloading'
    case 'waiting': return 'Queued'
    case 'delayed': return 'Retrying'
    case 'completed': return 'Done'
    case 'failed': return 'Failed'
    case 'cancelled': return 'Cancelled'
    case 'cancelling': return 'Cancelling…'
    default: return status
  }
}

function isCancellable(status: string) {
  return status === 'waiting' || status === 'active' || status === 'delayed'
}

function JobRow({ job, onCancel }: { job: QueueJob; onCancel: (jobId: string) => void }) {
  return (
    <div className="space-y-1.5 rounded-md border border-zinc-800/60 bg-zinc-900/50 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs text-zinc-300" title={job.title ?? undefined}>
          {job.title || 'Untitled download'}
        </p>
        {isCancellable(job.status) && (
          <button
            onClick={() => onCancel(job.jobId)}
            className="shrink-0 text-zinc-500 transition-colors hover:text-red-400"
            aria-label="Cancel download"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Progress value={job.progress} className="h-1.5" />
        <Badge variant={statusVariant(job.status)}>{statusLabel(job.status)}</Badge>
      </div>
    </div>
  )
}

export default function QueueSidebar() {
  const jobs = useJobsStore(s => s.jobs)
  const [open, setOpen] = useState(false)

  const jobList = Object.values(jobs).sort(
    (a, b) => (RANK[a.status] ?? 2) - (RANK[b.status] ?? 2)
  )
  const activeCount = jobList.filter(j => j.status === 'active' || j.status === 'waiting').length

  async function handleCancel(jobId: string) {
    try {
      await cancelJob(jobId)
    } catch {
      // no-op — the SSE feed will reflect whatever the real state ends up being
    }
  }

  const countBadge = activeCount > 0 && (
    <span className="rounded-full bg-cyan-500 px-1.5 text-[10px] font-medium text-zinc-950">
      {activeCount}
    </span>
  )

  const list = (
    <div className="space-y-2 overflow-y-auto">
      {jobList.length === 0 ? (
        <p className="px-1 py-6 text-center text-xs text-zinc-600">No downloads yet</p>
      ) : (
        jobList.map(job => <JobRow key={job.jobId} job={job} onCancel={handleCancel} />)
      )}
    </div>
  )

  return (
    <>
      {/* Desktop: collapsible right sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-30 hidden flex-col border-l border-zinc-800/60 opacity-85 bg-zinc-950 transition-[width] duration-200 md:flex',
          open ? 'w-80 p-4' : 'w-12 items-center py-4'
        )}
      >
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-200"
        >
          <ListChecks className="size-4" />
          {open && <span className="text-xs font-medium">Queue</span>}
          {countBadge}
        </button>
        {open && <div className="mt-4 flex-1 overflow-y-auto">{list}</div>}
      </aside>

      {/* Mobile: collapsible topbar */}
      <div className="fixed inset-x-0 top-0 z-30 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur md:hidden">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex w-full items-center justify-between px-4 py-2.5"
        >
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
            <ListChecks className="size-3.5" />
            Queue
            {countBadge}
          </span>
          <ChevronDown className={cn('size-3.5 text-zinc-500 transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <div className="max-h-64 overflow-y-auto border-t border-zinc-800/60 p-3">
            {list}
          </div>
        )}
      </div>
    </>
  )
}