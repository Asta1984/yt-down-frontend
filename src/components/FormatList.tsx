import { useMemo } from 'react'
import { Check } from 'lucide-react'
import type { VideoFormat } from '@/types/video'
import { Badge } from '@/components/ui/badge'
import { formatBytes } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { hasVideo, hasAudio, isVideoOnly, isAudioOnly } from '@/lib/format'

interface Props {
  formats: VideoFormat[]
  selected: VideoFormat | null
  onSelect: (format: VideoFormat) => void
}

export default function FormatList({ formats, selected, onSelect }: Props) {
  const { combined, videoOnly, audioOnly } = useMemo(() => {
    const useful = formats.filter(
      f => f.ext !== 'mhtml' && (hasVideo(f) || hasAudio(f))
    )

    return {
      combined: useful.filter(f => hasVideo(f) && hasAudio(f)),
      videoOnly: useful.filter(f => isVideoOnly(f)),
      audioOnly: useful.filter(f => isAudioOnly(f)),
    }
  }, [formats])

  const sections = [
    { label: 'Video + Audio', formats: combined, variant: 'video' as const },
    { label: 'Video + Audio(Custom)', formats: videoOnly, variant: 'video' as const },
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
                      ? 'border-cyan-700 bg-cyan-950/50 text-zinc-100'
                      : 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-zinc-200'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                        isSelected
                          ? 'border-cyan-500 bg-cyan-600'
                          : 'border-zinc-700 group-hover:border-zinc-500'
                      )}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                    </div>
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
                     {isVideoOnly(format) && (
                      <Badge variant="muted">+ audio</Badge>
                    )}
                    {isAudioOnly(format) && (
                      <Badge variant="muted">+ cover art</Badge>
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
