import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = createServerClient();
  const { data } = await db
    .from("posts")
    .select("*, users!author_id(username, avatar)")
    .order("created_at", { ascending: false })
    .limit(100);
  return NextResponse.json((data || []).map((p: any) => ({ ...p, username: p.users?.username, avatar: p.users?.avatar, users: undefined })));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });
  const db = createServerClient();
  const { data, error } = await db.from("posts").insert({ author_id: session.id, content: body.content.trim(), game: body.game || "General", post_status: "published" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id: (data as any).id });
}
