import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = createServerClient();
  const { data } = await db
    .from("users")
    .select("id,username,email,role,plan,status,avatar,bio,joined_at,last_seen")
    .order("joined_at", { ascending: false });
  return NextResponse.json(data || []);
}
