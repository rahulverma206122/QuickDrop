// src/lib/fileStore.ts

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// ── Constants ──────────────────────────────────────────
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const FILE_MAP_PATH = path.join(UPLOADS_DIR, 'fileMap.json');

// ── Directory Setup ────────────────────────────────────
function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

// ── File Map (code → filenames) ────────────────────────

// string | string[] handles both old and new format entries
function loadMap(): Map<string, string | string[]> {
  if (!fs.existsSync(FILE_MAP_PATH)) return new Map();

  try {
    const data = fs.readFileSync(FILE_MAP_PATH, 'utf-8');
    const parsed = JSON.parse(data) as [string, string | string[]][];
    return new Map(parsed);
  } catch {
    return new Map();
  }
}

function saveMap(fileMap: Map<string, string | string[]>) {
  try {
    ensureUploadsDir();
    fs.writeFileSync(FILE_MAP_PATH, JSON.stringify([...fileMap]), 'utf-8');
  } catch (err) {
    console.error('Failed to save file map:', err);
  }
}

// ── Public API ─────────────────────────────────────────

/** Save files to disk, generate an invite code, persist mapping */
export function saveFiles(
  files: { buffer: Buffer; originalName: string }[]
): string {
  ensureUploadsDir();

  // Save each file with a unique name (uuid + original name)
  const savedFilenames = files.map((file) => {
    const uniqueName = `${uuidv4()}_${file.originalName}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, uniqueName), file.buffer);
    return uniqueName;
  });

  // Generate a 4-digit invite code and store mapping
  const inviteCode = Math.floor(1000 + Math.random() * 9000).toString();
  const fileMap = loadMap();
  fileMap.set(inviteCode, savedFilenames);
  saveMap(fileMap);

  return inviteCode;
}

/** Get all filenames associated with an invite code */
export function getFile(code: string): string[] {
  const fileMap = loadMap();
  const result = fileMap.get(code);

  if (!result) return [];

  // Handle old format where value was saved as a plain string
  if (typeof result === 'string') return [result];

  return result;
}