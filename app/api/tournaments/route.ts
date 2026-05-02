import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const db = createServerClient();
  const { data } = await db
    .from("tournaments")
    .select("*, tournament_registrations(count)")
    .order("date", { ascending: true });

  const result = (data || []).map((t: any) => ({
    ...t,
    registered_count: t.tournament_registrations?.[0]?.count ?? 0,
    tournament_registrations: undefined,
  }));
  return NextResponse.json(result);
}
