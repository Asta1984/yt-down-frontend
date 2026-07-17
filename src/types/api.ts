import type { VideoInfo } from "./video";

export interface VideoInfoResponse {
  success: boolean;
  data: VideoInfo;
}