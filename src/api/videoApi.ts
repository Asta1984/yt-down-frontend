import { apiClient } from './client'
import {
  VideoInfoResponseSchema,
  QueueResponseSchema,
  type VideoInfoResponse,
  type QueueResponse,
} from '@/types/video'

export async function getVideoInfo(url: string): Promise<VideoInfoResponse> {
  const { data } = await apiClient.post('/video-info', { url })
  return VideoInfoResponseSchema.parse(data)
}

export async function queueDownload(url: string, formatId: string, filename?: string, videoTitle?: string, embedThumbnail = false, audioFormat?:string): Promise<QueueResponse> {
  const { data } = await apiClient.post('/download', { url, formatId, filename, videoTitle, embedThumbnail, audioFormat})
  return QueueResponseSchema.parse(data)
}

export function getDownloadUrl(jobId: string): string {
  const base = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000/api'
  return `${base}/job/${jobId}/download`
}
