import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  const db = createServerClient();
  const { data } = await db
    .from("users")
    .select("id,username,role,plan,status,avatar,bio,joined_at,last_seen")
    .eq("id", session.id)
    .single();
  return NextResponse.json({ user: data || null });
}
