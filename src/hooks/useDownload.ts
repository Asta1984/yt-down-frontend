import { queueDownload, getJobStatus, getDownloadUrl } from '../api/videoApi'
import { useDownloadStore } from '../store/downloadStore'
import { useVideoStore } from '../store/videoStore'
import { sleep } from '../lib/utils'

const POLL_INTERVAL_MS = 1000
const MAX_POLLS = 300 // 5 minutes max

export function useDownload() {
  const { url } = useVideoStore()
  const {
    jobId,
    downloadState,
    progress,
    error,
    setJobId,
    setDownloadState,
    setProgress,
    setError,
    reset,
  } = useDownloadStore()

  async function startDownload(formatId: string) {
    reset()
    setDownloadState('queued')

    try {
      // 1. Queue the job
      const { jobId: newJobId } = await queueDownload(url, formatId)
      setJobId(newJobId)
      setDownloadState('active')

      // 2. Poll for completion
      let polls = 0
      while (polls < MAX_POLLS) {
        await sleep(POLL_INTERVAL_MS)
        polls++

        const status = await getJobStatus(newJobId)
        setProgress(status.progress ?? 0)

        if (status.status === 'completed') {
          setDownloadState('completed')
          setProgress(100)
          return newJobId
        }

        if (status.status === 'failed') {
          throw new Error('Download job failed on the server')
        }
      }

      throw new Error('Download timed out')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed')
      return null
    }
  }

  function triggerSave() {
    if (!jobId) return
    // Let the browser handle the file save via Content-Disposition: attachment
    window.open(getDownloadUrl(jobId), '_blank')
  }

  return {
    jobId,
    downloadState,
    progress,
    error,
    startDownload,
    triggerSave,
    reset,
  }
}
