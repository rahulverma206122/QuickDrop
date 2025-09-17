import fs from "fs";
import path from "path";

const FILE_MAP_PATH = path.join(process.cwd(), "uploads", "fileMap.json");

// Load map from disk
function loadMapFromDisk(): Map<string, string[]> {
  if (fs.existsSync(FILE_MAP_PATH)) {
    try {
      const data = fs.readFileSync(FILE_MAP_PATH, "utf-8");
      const parsed = JSON.parse(data) as [string, string[]][];
      return new Map<string, string[]>(parsed);
    } catch (error) {
      return new Map<string, string[]>();
    }
  }
  return new Map<string, string[]>();
}

// Save map to disk
function saveMapToDisk(fileMap: Map<string, string[]>) {
  try {
    const uploadsDir = path.dirname(FILE_MAP_PATH);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(FILE_MAP_PATH, JSON.stringify([...fileMap]), "utf-8");
  } catch (error) {
    // optionally handle error
  }
}

// Add file(s) to a code
export function addFile(code: string, fileNames: string | string[]) {
  const fileMap = loadMapFromDisk();
  const existingFiles = fileMap.get(code) || [];
  const newFiles = Array.isArray(fileNames) ? fileNames : [fileNames];
  fileMap.set(code, [...existingFiles, ...newFiles]);
  saveMapToDisk(fileMap);
}

// Get all files for a code
export function getFile(code: string): string[] {
  const fileMap = loadMapFromDisk();
  return fileMap.get(code) || [];
}
