import { getVideoInfo } from '../api/videoApi'
import { useVideoStore } from '../store/videoStore'
import { useDownloadStore } from '../store/downloadStore'
import { UrlSchema } from '../types/video'

export function useVideoInfo() {
  const { url, setVideo, setFetchLoading, setFetchError } = useVideoStore()
  const { reset: resetDownload } = useDownloadStore()

  async function fetchVideo() {
    // Zod validate before hitting the network
    const result = UrlSchema.safeParse({ url })
    if (!result.success) {
      setFetchError(result.error.issues[0]?.message ?? 'Invalid URL')
      return
    }

    setFetchLoading(true)
    setFetchError('')
    resetDownload()

    try {
      const res = await getVideoInfo(url)
      setVideo(res.data)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch video info')
      setVideo(null)
    } finally {
      setFetchLoading(false)
    }
  }

  return { fetchVideo }
}
