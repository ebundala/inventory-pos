import { tryJsonParse } from "./tryJsonParse";

function getImageUrls(path: string) {
  const urls = tryJsonParse<string[]>(path, "[]");
  return urls;
}
