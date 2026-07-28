import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number, 
  decimals: number = 2, 
  useBinaryBase: boolean = true
): string {
  if (bytes === 0) return '0 Bytes';

  const k = useBinaryBase ? 1024 : 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = useBinaryBase 
    ? ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'] 
    : ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
