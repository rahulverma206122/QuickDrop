import { NextRequest, NextResponse } from "next/server";
import { getFile } from "@/lib/fileStore";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> } // ✅ params is now a Promise
) {
  const { code } = await context.params; // ✅ await the promise

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const fileName = getFile(code);
  if (!fileName) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads", fileName);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Disposition": `attachment; filename="${fileName.split("_").slice(1).join("_")}"`,
      "Content-Type": "application/octet-stream",
    },
  });
}
