import type { Dispatch, SetStateAction } from "react";
import type { VideoFormat } from "../types/video";

interface Props {
  formats: VideoFormat[];
  selected: VideoFormat | null;
  onSelect: Dispatch<SetStateAction<VideoFormat | null>>;
}

export default function FormatList({
  formats,
  selected,
  onSelect,
}: Props) {
  return (
    <div>
      {formats.map((format) => (
        <button
          key={format.format_id}
          onClick={() => onSelect(format)}
        >
          {format.format}
        </button>
      ))}
    </div>
  );
}