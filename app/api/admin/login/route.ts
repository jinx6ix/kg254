import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // Any admin role is sufficient; no password check required
  return NextResponse.json({ success: true });
}
