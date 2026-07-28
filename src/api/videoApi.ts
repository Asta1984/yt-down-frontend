import { apiClient } from './client'
import {
  VideoInfoResponseSchema,
  QueueResponseSchema,
  JobStatusSchema,
  type VideoInfoResponse,
  type QueueResponse,
  type JobStatus,
} from '@/types/video'

export async function getVideoInfo(url: string): Promise<VideoInfoResponse> {
  const { data } = await apiClient.post('/video-info', { url })
  return VideoInfoResponseSchema.parse(data)
}

export async function queueDownload(url: string, formatId: string): Promise<QueueResponse> {
  const { data } = await apiClient.post('/download', { url, formatId })
  return QueueResponseSchema.parse(data)
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const { data } = await apiClient.get(`/job/${jobId}`)
  return JobStatusSchema.parse(data)
}

export function getDownloadUrl(jobId: string): string {
  const base = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000/api'
  return `${base}/job/${jobId}/download`
}
