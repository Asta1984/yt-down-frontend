import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useVideoStore } from '@/store/videoStore'
import { useVideoInfo } from '@/hooks/useVideoInfo'
import { useDownloadStore } from '@/store/downloadStore'
import { cn } from '@/lib/utils'

export default function UrlInput() {
  const { url, setUrl, fetchLoading, fetchError } = useVideoStore()
  const { reset: resetDownload } = useDownloadStore()
  const { fetchVideo } = useVideoInfo()
  const [focused, setFocused] = useState(false)

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && url.trim()) fetchVideo()
  }

  function handleClear() {
    setUrl('')
    resetDownload()
    useVideoStore.getState().reset()
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border bg-zinc-900 px-3 transition-colors',
          focused ? 'border-violet-500' : 'border-zinc-700',
          fetchError && !focused && 'border-red-800'
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-zinc-500" />

        <Input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Paste a video URL — YouTube, Vimeo, and more"
          className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-100 placeholder:text-zinc-600"
          spellCheck={false}
          autoComplete="off"
        />

        {url && (
          <button
            onClick={handleClear}
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
            aria-label="Clear"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <Button
          onClick={fetchVideo}
          disabled={fetchLoading || !url.trim()}
          size="sm"
          className="shrink-0"
        >
          {fetchLoading ? (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Fetching
            </span>
          ) : (
            'Fetch'
          )}
        </Button>
      </div>

      {fetchError && (
        <p className="text-xs text-red-400 pl-1">{fetchError}</p>
      )}
    </div>
  )
}
