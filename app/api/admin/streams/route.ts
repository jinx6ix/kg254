import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = createServerClient();
  const { data } = await db
    .from("streams")
    .select("*")
    .order("created_at", { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.title || !body.url || !body.platform)
    return NextResponse.json({ error: "title, url, platform required" }, { status: 400 });
  const db = createServerClient();
  const { data, error } = await db
    .from("streams")
    .insert({
      title: body.title, url: body.url, platform: body.platform,
      game: body.game || "General", type: body.type || "vod",
      is_live: body.is_live || false
    })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id: (data as any).id });
}
