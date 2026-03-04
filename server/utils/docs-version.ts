import { createHash } from "node:crypto";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

let cachedVersion: string | null = null;

export function getDocsVersion() {
  const isDev = (globalThis as any).process?.dev || import.meta.dev;
  if (cachedVersion && !isDev) {
    return cachedVersion;
  }

  const contentDir = join(process.cwd(), "content");
  const files = getAllFiles(contentDir);

  const hash = createHash("md5");
  for (const file of files) {
    const stats = statSync(file);
    // Hash filename and mtime
    hash.update(`${file}:${stats.mtimeMs}`);
  }

  cachedVersion = hash.digest("hex").slice(0, 8);
  return cachedVersion;
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    }
    else if (file.endsWith(".md")) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles.sort(); // Sort to ensure deterministic hash
}
