import { useState } from "react";

import { downloadStream } from "../services/download.service";
import { saveBlob } from "../services/save.service";

export function useDownload() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  async function download(
    videoUrl: string,
    formatId: string,
    filename: string
  ) {
    setLoading(true);
    setProgress(0);

    try {
      const blob = await downloadStream(
        videoUrl,
        formatId,
        setProgress
      );

      saveBlob(blob, filename);
    } finally {
      setLoading(false);
    }
  }

  return {
    download,
    progress,
    loading,
  };
}