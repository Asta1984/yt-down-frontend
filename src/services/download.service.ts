export async function downloadStream(
  videoUrl: string,
  formatId: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const response = await fetch("http://localhost:5000/api/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: videoUrl,
      formatId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to download stream");
  }

  if (!response.body) {
    throw new Error("ReadableStream not supported");
  }

  const total = Number(response.headers.get("content-length") ?? 0);

  const reader = response.body.getReader();

  const chunks: ArrayBuffer[] = [];
  let received = 0;
  while (true) {
  const { done, value } = await reader.read();

  if (done) break;

  chunks.push(value.buffer.slice(
    value.byteOffset,
    value.byteOffset + value.byteLength
  ));

  received += value.byteLength;

  if (total > 0 && onProgress) {
    onProgress(received / total);
  }
  }

  return new Blob(chunks);
}