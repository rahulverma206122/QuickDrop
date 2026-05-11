// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { saveFiles } from '@/lib/fileStore';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_MB = 1000;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('file');

    // Validate — at least one file required
    const validFiles = files.filter(f => f instanceof File) as File[];
    if (validFiles.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Validate — check each file size
    const oversizedFile = validFiles.find(f => f.size > MAX_FILE_SIZE_BYTES);
    if (oversizedFile) {
      return NextResponse.json(
        { error: `File "${oversizedFile.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit` },
        { status: 400 }
      );
    }

    // Convert browser File objects to Node.js Buffers
    const fileBuffers = await Promise.all(
      validFiles.map(async (file) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        originalName: file.name,
      }))
    );

    // Save files and get single invite code for all
    const inviteCode = saveFiles(fileBuffers);

    return NextResponse.json({ inviteCode });

  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}