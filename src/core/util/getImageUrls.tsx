import { tryJsonParse } from "./tryJsonParse";

export function getImageUrls(path: string) {
  const urls = tryJsonParse<string[]>(path, "[]");
  return urls;
}
