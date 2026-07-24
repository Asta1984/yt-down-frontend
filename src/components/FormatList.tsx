import { useMemo } from 'react'
import { Check, Star } from 'lucide-react'
import type { VideoFormat } from '@/types/video'
import { Badge } from '@/components/ui/badge'
import { formatBytes } from '@/lib/utils'
import { cn } from '@/lib/utils'

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

function getQualityTier(height: number | null): { label: string; color: string } {
  if (!height) return { label: 'Audio', color: 'text-cyan-400' }
  if (height >= 2160) return { label: '4K', color: 'text-yellow-400' }
  if (height >= 1440) return { label: 'QHD', color: 'text-emerald-400' }
  if (height >= 1080) return { label: 'FHD', color: 'text-blue-400' }
  if (height >= 720) return { label: 'HD', color: 'text-violet-400' }
  return { label: 'SD', color: 'text-zinc-400' }
}

function getCodecLabel(codec: string | null): string {
  if (!codec || codec === 'none') return ''
  if (codec.includes('h264')) return 'H.264'
  if (codec.includes('h265') || codec.includes('hevc')) return 'H.265'
  if (codec.includes('vp')) return 'VP9'
  if (codec.includes('opus')) return 'Opus'
  if (codec.includes('aac')) return 'AAC'
  if (codec.includes('mp3')) return 'MP3'
  if (codec.includes('vorbis')) return 'Vorbis'
  return codec.toUpperCase().split('.')[0]
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
    { label: 'Recommended', formats: combined.slice(0, 1), variant: 'video' as const, isRecommended: true },
    { label: 'Video + Audio', formats: combined.slice(1), variant: 'video' as const, isRecommended: false },
    { label: 'Video only', formats: videoOnly, variant: 'video' as const, isRecommended: false },
    { label: 'Audio only', formats: audioOnly, variant: 'audio' as const, isRecommended: false },
  ].filter(s => s.formats.length > 0)

  return (
    <div className="space-y-4">
      {sections.map(section => (
        <div key={section.label}>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-600">
              {section.label}
            </p>
            {section.isRecommended && (
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <div className="space-y-2">
            {section.formats.map(format => {
              const isSelected = selected?.format_id === format.format_id
              const resolution = format.height ? `${format.height}p` : null
              const fps = format.fps && format.fps > 30 ? `${Math.round(format.fps)}fps` : null
              const qualityTier = getQualityTier(format.height ?? null)
              const vCodec = getCodecLabel(format.vcodec)
              const aCodec = getCodecLabel(format.acodec)
              const fileSize = format.filesize || format.filesize_approx
              const hasHighBitrate = (format.vbr && format.vbr > 5000) || (format.tbr && format.tbr > 5000)

              return (
                <button
                  key={format.format_id}
                  onClick={() => onSelect(format)}
                  className={cn(
                    'group w-full flex flex-col gap-2 rounded-lg border px-3.5 py-3 text-left transition-all',
                    isSelected
                      ? 'border-violet-600 bg-violet-950/60 shadow-lg shadow-violet-500/10'
                      : 'border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/60'
                  )}
                >
                  {/* Top row: Selection + Format info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0 pt-0.5">
                      <div
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                          isSelected
                            ? 'border-violet-400 bg-violet-600'
                            : 'border-zinc-600 group-hover:border-zinc-500'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </div>

                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn('text-xs font-semibold', qualityTier.color)}>
                            {qualityTier.label}
                          </span>
                          {resolution && (
                            <span className="font-mono text-xs font-medium text-zinc-300">
                              {resolution}
                            </span>
                          )}
                          {fps && (
                            <span className="font-mono text-xs text-zinc-500">
                              {fps}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs text-zinc-500">
                          Format #{format.format_id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="default">.{format.ext}</Badge>
                      {hasHighBitrate && (
                        <Badge className="bg-orange-950 border-orange-700 text-orange-300">
                          HQ
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Middle row: Codecs and specs */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {vCodec && (
                      <span className="inline-flex items-center px-2 py-1 rounded-sm bg-zinc-800/60 text-[11px] font-medium text-zinc-300">
                        {vCodec}
                      </span>
                    )}
                    {aCodec && (
                      <span className="inline-flex items-center px-2 py-1 rounded-sm bg-zinc-800/60 text-[11px] font-medium text-zinc-300">
                        {aCodec}
                      </span>
                    )}
                    {format.audio_channels && (
                      <span className="text-[11px] font-medium text-zinc-500">
                        {format.audio_channels}ch
                      </span>
                    )}
                  </div>

                  {/* Bottom row: Size and bitrate */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {fileSize && (
                        <span className="font-mono text-xs text-zinc-500">
                          ~{formatBytes(fileSize)}
                        </span>
                      )}
                      {format.abr && (
                        <span className="text-xs text-zinc-600">
                          {Math.round(format.abr)} kbps
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-600">
                      {format.format_note ? format.format_note : 'Standard'}
                    </span>
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
