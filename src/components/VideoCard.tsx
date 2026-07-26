import { Clock, User } from 'lucide-react'
import type { VideoInfo } from '../types/video'
import { formatDuration } from '../lib/utils'

interface Props {
  video: VideoInfo
}

export default function VideoCard({ video }: Props) {
  return (
    <div className="flex gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="relative shrink-0 overflow-hidden rounded-md">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-24 w-40 object-cover"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
          {formatDuration(video.duration)}
        </span>
      </div>

      <div className="flex flex-col justify-between min-w-0">
        <div>
          <h2 className="font-medium text-zinc-100 leading-snug line-clamp-2 text-sm">
            {video.title}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            {video.uploader}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {formatDuration(video.duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
