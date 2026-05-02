import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = createServerClient();
  const { data } = await db.from("tournaments").select("*, tournament_registrations(count)").order("date", { ascending: false });
  return NextResponse.json((data || []).map((t: any) => ({ ...t, registered_count: t.tournament_registrations?.[0]?.count ?? 0, tournament_registrations: undefined })));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.title || !body.game || !body.date || !body.prize)
    return NextResponse.json({ error: "title, game, date, prize required" }, { status: 400 });
  const db = createServerClient();
  const { data, error } = await db.from("tournaments").insert({ title: body.title, game: body.game, date: body.date, prize: body.prize, spots: body.spots || 16, format: body.format || "1v1 Knockout", status: body.status || "open", description: body.description || "" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id: (data as any).id });
}
