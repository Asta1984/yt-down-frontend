import { create } from 'zustand'
import type { DownloadState } from '@/types/video'

interface DownloadStoreState {
  jobId: string | null
  downloadState: DownloadState
  progress: number
  error: string

  setJobId: (id: string | null) => void
  setDownloadState: (s: DownloadState) => void
  setProgress: (p: number) => void
  setError: (msg: string) => void
  reset: () => void
}

export const useDownloadStore = create<DownloadStoreState>(set => ({
  jobId: null,
  downloadState: 'idle',
  progress: 0,
  error: '',

  setJobId: jobId => set({ jobId }),
  setDownloadState: downloadState => set({ downloadState }),
  setProgress: progress => set({ progress }),
  setError: error => set({ error, downloadState: 'failed' }),
  reset: () => set({ jobId: null, downloadState: 'idle', progress: 0, error: '' }),
}))
