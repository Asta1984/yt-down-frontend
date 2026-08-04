import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDownload } from '@/hooks/useDownload';
import { useVideoStore } from '@/store/videoStore';
import { cn } from '@/lib/utils';
import {Progress} from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { getDownloadOptions} from '@/lib/format';

// Strip characters that are unsafe in filenames across OSes
function sanitizeForInput(title: string): string {
  return title.replace(/[/\\?%*:|"<>]/g, '').trim().slice(0, 150)
}

export default function DownloadPanel() {
  const { selectedFormat, video } = useVideoStore()
  const { downloadState, progress, error, startDownload, triggerSave, reset } = useDownload()
  const [filename, setFilename] = useState('')
 
  // Pre-fill whenever a new video is loaded
  useEffect(() => {
    if (video?.title) setFilename(sanitizeForInput(video.title))
  }, [video?.title])
  const canStart = !!selectedFormat && downloadState === 'idle'
  const isActive = downloadState === 'queued' || downloadState === 'active'
  const isDone = downloadState === 'completed'
  const isFailed = downloadState === 'failed'

  function handleClick() {
    if (isDone) { triggerSave(); return }
    if (isFailed) { reset(); return }
    if (canStart){
        const opts = getDownloadOptions(selectedFormat)
        startDownload(opts.formatId, filename, opts.embedThumbnail, opts.audioFormat)
    }
  }

  return (
    <div className="space-y-3">
       {/* Filename input — shown once a video is loaded, disabled while downloading */}
      {video && (
        <div className="space-y-1">
          <label className="text-xs text-zinc-500">Filename</label>
          <Input
            value={filename}
            onChange={e => setFilename(e.target.value)}
            disabled={isActive}
            placeholder="Enter filename (without extension)"
            className="text-sm font-mono"
          />
        </div>
      )}
      {/* Morphing button */}
      <Button
        onClick={handleClick}
        disabled={(!selectedFormat && !isDone && !isFailed) || isActive}
        variant={isDone ? 'default' : isFailed ? 'destructive' : 'default'}
        size="lg"
        className={cn(
          'w-full transition-all duration-300',
          isActive && 'cursor-wait'
        )}
      >
        {isActive && <Loader2 className="h-4 w-4 animate-spin" />}
        {isDone && <CheckCircle2 className="h-4 w-4" />}
        {isFailed && <AlertCircle className="h-4 w-4" />}
        {!isActive && !isDone && !isFailed && <Download className="h-4 w-4" />}

        <span>
          {downloadState === 'queued' && 'Queuing…'}
          {downloadState === 'active' && `Downloading`}
          {downloadState === 'completed' && 'Save file'}
          {downloadState === 'failed' && 'Retry'}
          {downloadState === 'idle' && (selectedFormat ? 'Download' : 'Select a format')}
        </span>
      </Button>
       {isActive && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-zinc-600">
            <span>
              {downloadState === 'queued' ? 'waiting in queue' : 'downloading'}
            </span>
          </div>
        <Progress value={progress} />
        </div>
      )}

      {/* Error message */}
      {isFailed && error && (
        <div className="flex items-start gap-2 rounded-md border border-red-900/50 bg-red-950/20 px-3 py-2 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success hint */}
      {isDone && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-900/50 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>
            Ready — click <strong>Save file</strong> to download, or{' '}
            <button
              onClick={reset}
              className="underline underline-offset-2 hover:text-emerald-300 transition-colors"
            >
              pick another format
            </button>
          </span>
        </div>
      )}
    </div>
  )
}
