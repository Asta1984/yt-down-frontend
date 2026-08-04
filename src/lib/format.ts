import type { VideoFormat } from '@/types/video'
import type { AudioTarget } from '@/types/video'

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

/**
 * Picks the --audio-format target for an audio-only download based on the
 * *source* codec, so yt-dlp can remux (copy the existing stream into a
 * cover-art-friendly container) instead of re-encoding whenever possible.
 * Only genuinely unrecognized codecs fall back to a lossy mp3 transcode.
 */
export function getAudioTarget(f: VideoFormat): AudioTarget {
  const codec = f.acodec.toLowerCase()
  if (codec.startsWith('opus')) return 'opus'                    // native remux
  if (codec.startsWith('mp4a') || codec.startsWith('aac')) return 'm4a' // native remux
  if (codec.startsWith('mp3')) return 'mp3'
  if (codec.startsWith('vorbis')) return 'vorbis'
  if (codec.startsWith('flac')) return 'flac'
  return 'mp3' // only unknown codecs get transcoded
}
export interface DownloadOptions {
  formatId: string
  embedThumbnail: boolean
  audioFormat: AudioTarget | null
}
 
/**
 * Single entry point DownloadPanel calls to get everything it needs to
 * queue a download, regardless of whether the pick is video, video-only,
 * or audio-only.
 */
export function getDownloadOptions(f: VideoFormat): DownloadOptions {
  if (isAudioOnly(f)) {
    return {
      formatId: f.format_id,
      embedThumbnail: true,
      audioFormat: getAudioTarget(f),
    }
  }
 
  return {
    formatId: getDownloadFormatId(f),
    embedThumbnail: false,
    audioFormat: null,
  }
}