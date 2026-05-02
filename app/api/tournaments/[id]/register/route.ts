import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required to register" }, { status: 401 });
  const { id } = await params;
  const db = createServerClient();

  const { data: t } = await db.from("tournaments").select("status,spots").eq("id", id).single();
  if (!t) return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
  if (t.status === "ended") return NextResponse.json({ error: "Tournament has ended" }, { status: 400 });
  if (t.status === "live")  return NextResponse.json({ error: "Registration closed — tournament is live" }, { status: 400 });

  const { count } = await db
    .from("tournament_registrations")
    .select("*", { count: "exact", head: true })
    .eq("tournament_id", id);
  if ((count ?? 0) >= t.spots) return NextResponse.json({ error: "Tournament is full" }, { status: 400 });

  const { data: already } = await db
    .from("tournament_registrations")
    .select("user_id")
    .eq("user_id", session.id)
    .eq("tournament_id", id)
    .single();
  if (already) return NextResponse.json({ error: "Already registered" }, { status: 409 });

  const { error } = await db
    .from("tournament_registrations")
    .insert({ user_id: session.id, tournament_id: id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, message: "Registered successfully! 🎮" });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  const db = createServerClient();
  await db.from("tournament_registrations").delete().eq("user_id", session.id).eq("tournament_id", id);
  return NextResponse.json({ success: true });
}
