import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const db = createServerClient();
  const { data } = await db
    .from("events")
    .select("*")
    .eq("event_status", "published")
    .order("date", { ascending: true });
  return NextResponse.json(data || []);
}
