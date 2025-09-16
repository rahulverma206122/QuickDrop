
import { NextRequest, NextResponse } from "next/server";
import { saveFile } from "@/utils/fileHelper"; // saves to disk & returns inviteCode

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert browser File to Node.js Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // saveFile returns the 6-character invite code
    const inviteCode = saveFile(buffer, file.name);

    return NextResponse.json({ inviteCode });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

