import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { bio } = await req.json();
  const db = createServerClient();
  await db.from("users").update({ bio: (bio || "").slice(0, 160) }).eq("id", session.id);
  return NextResponse.json({ success: true });
}
