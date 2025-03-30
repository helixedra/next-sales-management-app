import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const { number } = await params;

    if (!number) {
      return NextResponse.json(
        { error: "Sale number is required" },
        { status: 400 }
      );
    }
    const stmt = db.prepare(
      "SELECT * FROM uploads WHERE number = ? AND category = 'sale'"
    );
    const files = stmt.all(number);

    if (files.length === 0) {
      //   return NextResponse.json({ error: "No files found for the given sale number" }, { status: 404 });
      return NextResponse.json({});
    }

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch files",
      },
      { status: 500 }
    );
  }
}
