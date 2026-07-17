export interface VideoFormat {
  format_id: string;
  ext: string;
  format: string;

  filesize: number | null;

  width: number | null;
  height: number | null;

  fps: number | null;

  vcodec: string;
  acodec: string;

  hasVideo: boolean;
  hasAudio: boolean;

  url: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  uploader: string;
  webpage_url: string;

  formats: VideoFormat[];
}