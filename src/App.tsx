import { useVideoStore} from '@/store/videoStore'
// import { useJobsFeed } from './hooks/useJobfeed'
import UrlInput from '@/components/UrlInput'
import VideoCard from '@/components/VideoCard'
import FormatList from '@/components/FormatList'
import DownloadPanel from '@/components/DownloadPanel'
import QueueSidebar from '@/components/Queuesidebar'

export default function App() {
  const { video, selectedFormat, setSelectedFormat } = useVideoStore()

  return (
    <div className="min-h-screen text-zinc-100 z-0">
      <div className='flex justify-center fixed -z-20 w-full scale-110 bg-zinc-950'>
        <img src="https://pub-d02e3aa7d09f4d5d9261e5d7e4bae228.r2.dev/%20.jpg" alt="background wallpaper"/>
      </div>
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-baseline gap-2">
          <span className="font-mono text-amber-700 text-lg font-medium tracking-tight">
            Freedowm
          </span>
          <span className="text-xs text-accent-foreground">
            download anything, any format
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-2xl px-6 py-10 space-y-8">
        {/* URL Input */}
        <section className="space-y-2">
          <label className="font-medium uppercase tracking-widest text-accent-foreground">
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

            <section className="space-y-2 md:-mx-72">
              <label className="text-[11px] font-medium uppercase tracking-widest text-zinc-100">
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
            <p className="text-sm text-accent">
              Paste a URL above to get started
            </p>
            <p className="mt-1 text-xs text-zinc-700">
              YouTube 
            </p>
          </div>
        )}
      </main>
        <QueueSidebar />
    </div>
  )
}
