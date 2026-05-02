import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = createServerClient();
  const { data } = await db.from("events").select("*").order("date", { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.title || !body.date || !body.category)
    return NextResponse.json({ error: "title, date, category required" }, { status: 400 });
  const db = createServerClient();
  const { data, error } = await db.from("events").insert({ title: body.title, date: body.date, time: body.time || "TBD", location: body.location || "Online", category: body.category, description: body.description || "", event_status: body.event_status || "published", rsvps: 0 }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id: (data as any).id });
}
