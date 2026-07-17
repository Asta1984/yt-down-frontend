import { type VideoInfo } from "../types/video";

interface Props {
  video: VideoInfo;
}

export default function VideoCard({ video }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <img
        src={video.thumbnail}
        alt={video.title}
        width={320}
      />

      <h2>{video.title}</h2>
      <p>Uploader: {video.uploader}</p>
      <p>Duration: {video.duration}s</p>
    </div>
  );
}