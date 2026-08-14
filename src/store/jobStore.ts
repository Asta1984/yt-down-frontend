import { create } from 'zustand'
import type { JobSummary } from '@/types/video'

export type QueueJob = JobSummary

interface JobsStoreState {
  jobs: Record<string, QueueJob>
  setJobs: (jobs: QueueJob[]) => void
  upsertJob: (partial: Partial<QueueJob> & { jobId: string }) => void
  removeJob: (jobId: string) => void
}

export const useJobsStore = create<JobsStoreState>(set => ({
  jobs: {},

  setJobs: jobs =>
    set({ jobs: Object.fromEntries(jobs.map(j => [j.jobId, j])) }),

  upsertJob: partial =>
    set(state => ({
      jobs: {
        ...state.jobs,
        [partial.jobId]: { ...state.jobs[partial.jobId], ...partial } as QueueJob,
      },
    })),

  removeJob: jobId =>
    set(state => {
      const rest = { ...state.jobs }
      delete rest[jobId]
      return { jobs: rest }
    }),
}))