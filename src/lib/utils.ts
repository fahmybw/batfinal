import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chunkText(input: string, size = 1000, overlap = 200) {
  const chunks: string[] = [];
  let i = 0;
  while (i < input.length) {
    chunks.push(input.slice(i, i + size));
    i += size - overlap;
  }
  return chunks.filter(Boolean);
}
