import { create } from 'zustand'
import type { VideoInfo, VideoFormat } from '@/types/video'

interface VideoState {
  url: string
  video: VideoInfo | null
  selectedFormat: VideoFormat | null
  fetchLoading: boolean
  fetchError: string

  setUrl: (url: string) => void
  setVideo: (video: VideoInfo | null) => void
  setSelectedFormat: (format: VideoFormat | null) => void
  setFetchLoading: (v: boolean) => void
  setFetchError: (msg: string) => void
  reset: () => void
}

export const useVideoStore = create<VideoState>(set => ({
  url: '',
  video: null,
  selectedFormat: null,
  fetchLoading: false,
  fetchError: '',

  setUrl: url => set({ url }),
  setVideo: video => set({ video, selectedFormat: null, fetchError: '' }),
  setSelectedFormat: selectedFormat => set({ selectedFormat }),
  setFetchLoading: fetchLoading => set({ fetchLoading }),
  setFetchError: fetchError => set({ fetchError }),
  reset: () =>
    set({ url: '', video: null, selectedFormat: null, fetchLoading: false, fetchError: '' }),
}))
