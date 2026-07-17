import { type VideoInfoResponse } from "../types/video";

const API_BASE = "http://localhost:5000/api";

export async function getVideoInfo(url: string): Promise<VideoInfoResponse> {
  const response = await fetch(`${API_BASE}/video-info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}