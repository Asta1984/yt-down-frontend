import { useState } from "react";

import UrlInput from "./components/UrlInput";
import VideoCard from "./components/VideoCard";
import FormatList from "./components/FormatList";

import { getVideoInfo } from "./api/videoApi";
import { useDownload } from "./hooks/useDownload";

import type { VideoInfo, VideoFormat } from "./types/video";

export default function App() {
  const [url, setUrl] = useState("");

  const [video, setVideo] = useState<VideoInfo | null>(null);

  const [selected, setSelected] = useState<VideoFormat | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // NEW
  const {
    download,
    progress,
    loading: downloadLoading,
  } = useDownload();

  
  const handleFetch = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getVideoInfo(url);

      setVideo(response.data);

      // optional
      setSelected(null);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unknown error"
      );

    } finally {

      setLoading(false);

    }
  };
  const handleDownload = async () => {
  if (!video || !selected) return;

  await download(
    url, // original YouTube URL from the input
    selected.format_id,
    `${video.title}.${selected.ext}`
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1>Video Downloader</h1>

      <UrlInput
        url={url}
        setUrl={setUrl}
        onSubmit={handleFetch}
        loading={loading}
      />

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}
      {video && (
        <>
        <VideoCard video={video} />

        <FormatList
          formats={video.formats}
          selected={selected}
          onSelect={setSelected}
        />

        <button
          onClick={handleDownload}
          disabled={!selected || downloadLoading}
        >
          {downloadLoading ? "Downloading..." : "Download"}
        </button>

        {downloadLoading && (
          <p>{Math.round(progress * 100)}%</p>
        )}
        </>
        )}
      </div>
    );
}