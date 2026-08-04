import { z } from 'zod'

// ── Zod schemas ──────────────────────────────────────────────────────────────

export const VideoFormatSchema = z.object({
  format_id: z.string(),
  ext: z.string(),
  format: z.string(),
  vcodec: z.string(),
  acodec: z.string(),
  url: z.string(),

  // Absent on some formats (e.g. format 18 only has filesize_approx)
  filesize: z.number().nullable().optional(),
  filesize_approx: z.number().nullable().optional(),

  // Absent on audio-only formats
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  fps: z.number().nullable().optional(),
  resolution: z.string().optional(),
  dynamic_range: z.string().nullable().optional(),

  // Absent on video-only formats
  audio_channels: z.number().nullable().optional(),
  asr: z.number().nullable().optional(),

  // Bitrate fields — present on most but nullable
  tbr: z.number().nullable().optional(),
  vbr: z.number().nullable().optional(),
  abr: z.number().nullable().optional(),

  // Human-readable quality label e.g. "720p", "medium"
  format_note: z.string().optional(),
})

export const VideoInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.number(),
  thumbnail: z.string(),
  uploader: z.string(),
  webpage_url: z.string(),
  formats: z.array(VideoFormatSchema),

  // Optional enrichment fields the UI can use if present
  description: z.string().optional(),
  view_count: z.number().nullable().optional(),
  like_count: z.number().nullable().optional(),
  channel: z.string().optional(),
  upload_date: z.string().optional(),         // "20240221"
  duration_string: z.string().optional(),     // "3:36"
})

export const VideoInfoResponseSchema = z.object({
  success: z.boolean(),
  data: VideoInfoSchema,
})

export const QueueResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  jobId: z.string(),
  status: z.string(),
})

export const UrlSchema = z.object({
  url: z.string().min(1, 'URL is required').url('Please enter a valid URL'),
})

// ── Inferred types ────────────────────────────────────────────────────────────

export type VideoFormat = z.infer<typeof VideoFormatSchema>
export type VideoInfo = z.infer<typeof VideoInfoSchema>
export type VideoInfoResponse = z.infer<typeof VideoInfoResponseSchema>
export type QueueResponse = z.infer<typeof QueueResponseSchema>
export type UrlForm = z.infer<typeof UrlSchema>

// ── Derived helpers ───────────────────────────────────────────────────────────

export type DownloadState =
  | 'idle'
  | 'queued'
  | 'active'
  | 'completed'
  | 'failed'

// yt-dlp's supported --audio-format values that we're willing to target.
export type AudioTarget = 'm4a' | 'mp3' | 'opus' | 'vorbis' | 'flac' | 'wav'