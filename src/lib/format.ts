import type { VideoFormat } from '@/types/video'

export function hasVideo(f: VideoFormat) {
  return f.vcodec !== 'none' && !!f.width
}

export function hasAudio(f: VideoFormat) {
  return f.acodec !== 'none'
}

export function isVideoOnly(f: VideoFormat) {
  return hasVideo(f) && !hasAudio(f)
}

export function isAudioOnly(f: VideoFormat) {
  return hasAudio(f) && !hasVideo(f)
}
/**
 * yt-dlp's -f value to actually request.
 * 1080p+ on YouTube is served as video-only, so we pair it with the best
 * available audio track and let yt-dlp/ffmpeg mux the two into one file.
 */
export function getDownloadFormatId(f: VideoFormat): string {
  return isVideoOnly(f) ? `${f.format_id}+bestaudio/best` : f.format_id
}