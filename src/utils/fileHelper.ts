import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { addFile } from "@/lib/fileStore";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

/**
 * Ensures the uploads directory exists
 */
export function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  return UPLOADS_DIR;
}

/**
 * Saves multiple file buffers to disk, generates a single invite code,
 * stores mapping, and returns the invite code
 */
export function saveFiles(
  files: { buffer: Buffer; originalName: string }[]
): string {
  ensureUploadsDir();

  const savedFilenames: string[] = [];

  for (const file of files) {
    const uniqueFilename = `${uuidv4()}_${file.originalName}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);
    fs.writeFileSync(filePath, file.buffer);
    savedFilenames.push(uniqueFilename);
  }

  // Generate a 4-character invite code
  const inviteCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Persist mapping (multiple files under the same code)
  addFile(inviteCode, savedFilenames);

  return inviteCode;
}
