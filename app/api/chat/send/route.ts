import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required to chat" }, { status: 401 });
  const { channel, message } = await req.json();
  if (!message?.trim() || message.trim().length > 500)
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  const CHANNELS = ["general","tournaments","efootball","pubg","mods-only"];
  if (!CHANNELS.includes(channel))
    return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
  if (channel === "mods-only" && session.role !== "admin")
    return NextResponse.json({ error: "Admin only" }, { status: 403 });

  const db = createServerClient();
  const { data, error } = await db
    .from("chat_messages")
    .insert({ user_id: session.id, channel, message: message.trim() })
    .select("id, message, channel, created_at, users!user_id(username, role, plan, avatar)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    id:         (data as any).id,
    message:    (data as any).message,
    channel:    (data as any).channel,
    created_at: (data as any).created_at,
    username:   (data as any).users?.username,
    role:       (data as any).users?.role,
    plan:       (data as any).users?.plan,
    avatar:     (data as any).users?.avatar,
  });
}
