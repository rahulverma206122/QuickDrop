import { NextRequest, NextResponse } from "next/server";
import { saveFiles } from "@/utils/fileHelper"; // updated helper

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");

    // Filter and validate files
    const validFiles = files.filter(f => f instanceof File) as File[];
    if (validFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Convert browser File objects to Node.js Buffers
    const fileBuffers = await Promise.all(
      validFiles.map(async (file) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        originalName: file.name,
      }))
    );

    // saveFiles returns a single invite code for all files
    const inviteCode = saveFiles(fileBuffers);

    return NextResponse.json({ inviteCode });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
