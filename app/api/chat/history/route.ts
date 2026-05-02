import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel") || "general";
  const db = createServerClient();
  const { data } = await db
    .from("chat_messages")
    .select("id, message, channel, created_at, users!user_id(username, role, plan, avatar)")
    .eq("channel", channel)
    .order("created_at", { ascending: false })
    .limit(60);

  const messages = (data || []).reverse().map((m: any) => ({
    id:         m.id,
    message:    m.message,
    channel:    m.channel,
    created_at: m.created_at,
    username:   m.users?.username,
    role:       m.users?.role,
    plan:       m.users?.plan,
    avatar:     m.users?.avatar,
  }));
  return NextResponse.json(messages);
}
