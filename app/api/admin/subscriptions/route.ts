import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = createServerClient();
  const { data } = await db
    .from("subscriptions")
    .select("*, users!user_id(username, email)")
    .order("start_date", { ascending: false });
  return NextResponse.json((data || []).map((s: any) => ({ ...s, username: s.users?.username, email: s.users?.email, users: undefined })));
}
