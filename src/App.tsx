import { useVideoStore} from '@/store/videoStore'
import UrlInput from '@/components/UrlInput'
import VideoCard from '@/components/VideoCard'
import FormatList from '@/components/FormatList'
import DownloadPanel from '@/components/DownloadPanel'

export default function App() {
  const { video, selectedFormat, setSelectedFormat } = useVideoStore()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-baseline gap-2">
          <span className="font-mono text-cyan-400 text-lg font-medium tracking-tight">
            Freedowm
          </span>
          <span className="text-xs text-zinc-600">
            download anything, any format
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-2xl px-6 py-10 space-y-8">

        {/* URL Input */}
        <section className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-600">
            Video URL
          </label>
          <UrlInput />
        </section>

        {/* Video info + format picker + download */}
        {video && (
          <>
            <section>
              <VideoCard video={video} />
            </section>

            <section className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-600">
                Format
              </label>
              <FormatList
                formats={video.formats}
                selected={selectedFormat}
                onSelect={setSelectedFormat}
              />
            </section>

            <section>
              <DownloadPanel />
            </section>
          </>
        )}

        {/* Empty state */}
        {!video && (
          <div className="rounded-lg border border-dashed border-zinc-800 px-8 py-16 text-center">
            <p className="text-sm text-zinc-600">
              Paste a URL above to get started
            </p>
            <p className="mt-1 text-xs text-zinc-700">
              YouTube 
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
