import { NextRequest, NextResponse } from "next/server";
import { getFile } from "@/lib/fileStore";
import fs from "fs";
import path from "path";
import JSZip from "jszip";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const fileNames = getFile(code); // returns string[]
  if (!fileNames || fileNames.length === 0) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 400 });
  }

  const zip = new JSZip();

  for (const fileName of fileNames) {
    const filePath = path.join(process.cwd(), "uploads", fileName);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const cleanName = fileName.split("_").slice(1).join("_");
      zip.file(cleanName, fileBuffer);
    }
  }

  // Generate zip as ArrayBuffer
  const zipBuffer: ArrayBuffer = await zip.generateAsync({ type: "arraybuffer" });

  return new NextResponse(zipBuffer, {
    headers: {
      "Content-Disposition": `attachment; filename="files_${code}.zip"`,
      "Content-Type": "application/zip",
    },
  });
}
