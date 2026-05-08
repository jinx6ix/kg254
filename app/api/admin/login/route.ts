import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { password } = await req.json();
  if (password !== (process.env.ADMIN_PASSWORD || "ptkAdmin!"))
    return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
  return NextResponse.json({ success: true });
}
