import { useEffect } from 'react'
import { listJobs, getJobsEventsUrl } from '@/api/videoApi'
import { useJobsStore } from '@/store/jobStore'

/**
 * Mount once (e.g. in App). Loads the current job list, then keeps it live
 * via the /jobs/events SSE feed — no polling needed.
 */
export function useJobsFeed() {
  const setJobs = useJobsStore(s => s.setJobs)
  const upsertJob = useJobsStore(s => s.upsertJob)

  useEffect(() => {
    let cancelled = false

    listJobs()
      .then(jobs => {
        if (!cancelled) setJobs(jobs)
      })
      .catch(() => {
        // sidebar just starts empty; SSE will still populate it as jobs update
      })

    const es = new EventSource(getJobsEventsUrl())
    es.onmessage = event => {
      try {
        const payload = JSON.parse(event.data)
        if (payload?.jobId) upsertJob(payload)
      } catch {
        // ignore malformed events
      }
    }

    return () => {
      cancelled = true
      es.close()
    }
  }, [setJobs, upsertJob])
}