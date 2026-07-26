import { useMemo } from 'react'
import { Check } from 'lucide-react'
import type { VideoFormat } from '../types/video'
import { Badge } from '../components/ui/badge'
import { formatBytes } from '../lib/utils'
import { cn } from '../lib/utils'

interface Props {
  formats: VideoFormat[]
  selected: VideoFormat | null
  onSelect: (format: VideoFormat) => void
}

function hasVideo(f: VideoFormat) {
  return f.vcodec !== 'none' && !!f.width
}

function hasAudio(f: VideoFormat) {
  return f.acodec !== 'none'
}

export default function FormatList({ formats, selected, onSelect }: Props) {
  const { combined, videoOnly, audioOnly } = useMemo(() => {
    const useful = formats.filter(
      f => f.ext !== 'mhtml' && (hasVideo(f) || hasAudio(f))
    )

    return {
      combined: useful.filter(f => hasVideo(f) && hasAudio(f)),
      videoOnly: useful.filter(f => hasVideo(f) && !hasAudio(f)),
      audioOnly: useful.filter(f => !hasVideo(f) && hasAudio(f)),
    }
  }, [formats])

  const sections = [
    { label: 'Video + Audio', formats: combined, variant: 'video' as const },
    { label: 'Video only', formats: videoOnly, variant: 'video' as const },
    { label: 'Audio only', formats: audioOnly, variant: 'audio' as const },
  ].filter(s => s.formats.length > 0)

  return (
    <div className="space-y-4">
      {sections.map(section => (
        <div key={section.label}>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
            {section.label}
          </p>
          <div className="space-y-1">
            {section.formats.map(format => {
              const isSelected = selected?.format_id === format.format_id
              const resolution = format.height ? `${format.height}p` : null
              const fps = format.fps && format.fps > 30 ? `${Math.round(format.fps)}fps` : null

              return (
                <button
                  key={format.format_id}
                  onClick={() => onSelect(format)}
                  className={cn(
                    'group w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-left transition-colors',
                    isSelected
                      ? 'border-violet-700 bg-violet-950/50 text-zinc-100'
                      : 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-zinc-200'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                        isSelected
                          ? 'border-violet-500 bg-violet-600'
                          : 'border-zinc-700 group-hover:border-zinc-500'
                      )}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                    </div>

                    <span className="font-mono text-xs text-zinc-500 shrink-0">
                      {format.format_id}
                    </span>

                    <span className="truncate text-sm">
                      {format.format.split(' - ').slice(1).join(' - ') || format.format}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    {resolution && (
                      <Badge variant={section.variant}>{resolution}</Badge>
                    )}
                    {fps && (
                      <Badge variant="muted">{fps}</Badge>
                    )}
                    <Badge variant="default">.{format.ext}</Badge>
                    {format.filesize && (
                      <span className="font-mono text-[11px] text-zinc-600">
                        {formatBytes(format.filesize)}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
