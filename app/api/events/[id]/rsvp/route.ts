import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  const db = createServerClient();

  const { data: existing } = await db
    .from("event_rsvps")
    .select("event_id")
    .eq("user_id", session.id)
    .eq("event_id", id)
    .single();

  if (existing) {
    await db.from("event_rsvps").delete().eq("user_id", session.id).eq("event_id", id);
    const { count } = await db.from("event_rsvps").select("*", { count: "exact", head: true }).eq("event_id", id);
    await db.from("events").update({ rsvps: count || 0 }).eq("id", id);
    return NextResponse.json({ rsvped: false });
  } else {
    await db.from("event_rsvps").insert({ user_id: session.id, event_id: id });
    const { count } = await db.from("event_rsvps").select("*", { count: "exact", head: true }).eq("event_id", id);
    await db.from("events").update({ rsvps: count || 0 }).eq("id", id);
    return NextResponse.json({ rsvped: true });
  }
}
