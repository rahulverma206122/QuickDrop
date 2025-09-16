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
 * Saves a file buffer to disk, generates a 6-char invite code,
 * stores mapping, and returns the invite code
 */
export function saveFile(fileBuffer: Buffer, originalName: string): string {
  ensureUploadsDir();

  const uniqueFilename = `${uuidv4()}_${originalName}`;
  const filePath = path.join(UPLOADS_DIR, uniqueFilename);

  fs.writeFileSync(filePath, fileBuffer);

  // Generate a 4-character invite code
  const inviteCode = Math.floor(1000 + Math.random() * 9000).toString();

  // Persist mapping
  addFile(inviteCode, uniqueFilename);

  return inviteCode;
}
