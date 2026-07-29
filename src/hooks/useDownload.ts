import { queueDownload, getDownloadUrl } from '@/api/videoApi'
import { useDownloadStore } from '@/store/downloadStore'
import { useVideoStore } from '@/store/videoStore'

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
      await new Promise<void>((resolve, reject) => {
        const base = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000/api'
        const es = new EventSource(`${base}/job/${newJobId}/progress`)

        es.onmessage = (e) => {
          const { progress, status } = JSON.parse(e.data)
          setProgress(progress)

          if (status === 'completed') {
            setDownloadState('completed')
            setProgress(100)
            es.close()
            resolve()
          }

          if (status === 'failed') {
            es.close()
            reject(new Error('Download job failed on the server'))
          }
        }

        es.onerror = () => {
          es.close()
          reject(new Error('Lost connection to server'))
        }
      })

      return newJobId
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
