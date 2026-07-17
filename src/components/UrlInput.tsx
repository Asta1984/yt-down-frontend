interface Props {
  url: string;
  setUrl: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function UrlInput({
  url,
  setUrl,
  onSubmit,
  loading
}: Props) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste video URL"
        style={{ flex: 1, padding: 12 }}
      />

      <button onClick={onSubmit} disabled={loading}>
        {loading ? "Loading..." : "Fetch"}
      </button>
    </div>
  );
}