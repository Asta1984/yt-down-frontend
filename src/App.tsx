import { useVideoStore } from '@/store/videoStore'
import UrlInput from '@/components/UrlInput'
import VideoCard from '@/components/VideoCard'
import FormatList from '@/components/FormatList'
import DownloadPanel from '@/components/DownloadPanel'
import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { lazy, Suspense } from 'react'


const NotFound = lazy(() => import('@/components/Notfound'))


export default function App() {
  const { video, selectedFormat, setSelectedFormat } = useVideoStore()

  return (
    <div className="relative min-h-screen text-zinc-100">
      <div className="fixed inset-0 z-0 flex justify-center overflow-hidden bg-zinc-950">
        <img
          src="https://pub-d02e3aa7d09f4d5d9261e5d7e4bae228.r2.dev/%20.jpg"
          alt="background wallpaper"
          className="scale-125"
        />
      </div>

      <div className="fixed top-0 z-50 w-full">
        <Navbar />
        <Suspense fallback={<div className="min-h-screen bg-[#05070c]" />}>
          <Routes>
            <Route path="/"/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      <main className="relative z-0 mx-auto max-w-2xl px-6 py-10 pt-24 space-y-8">
        <section  id='hero'  className="space-y-2">
          <label className="font-mono uppercase tracking-widest text-accent/80">
            Video URL
          </label>
          <UrlInput />
        </section>

        {video && (
          <>
            <section>
              <VideoCard video={video} />
            </section>

            <section className="space-y-2 md:-mx-72 bg-gray-950/30 rounded-4xl p-3">
              <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-100">
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

        {!video && (
          <div className="rounded-lg bg-gray-950/30 border border-dashed border-zinc-800 px-8 py-16 text-center">
            <p className="text-sm text-accent">
              Paste a URL above to get started
            </p>
            <p className="mt-1 text-xs text-red-700">
              YouTube
            </p>
          </div>
        )}
      </main>
    </div>
  )
}