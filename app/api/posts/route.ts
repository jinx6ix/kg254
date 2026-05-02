import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const game   = searchParams.get("game");
  const limit  = Math.min(parseInt(searchParams.get("limit")  || "20"), 50);
  const offset = parseInt(searchParams.get("offset") || "0");

  const db = createServerClient();
  let query = db
    .from("posts")
    .select(`*, users!author_id(username, role, avatar, plan)`)
    .eq("post_status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (game && game !== "All") query = query.eq("game", game);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Flatten user join
  const posts = (data || []).map((p: any) => ({
    ...p,
    username:  p.users?.username,
    user_role: p.users?.role,
    avatar:    p.users?.avatar,
    plan:      p.users?.plan,
    users:     undefined,
  }));
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { content, game } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const db = createServerClient();
  const { data: user } = await db.from("users").select("status").eq("id", session.id).single();
  if (!user || user.status !== "active")
    return NextResponse.json({ error: "Account not active" }, { status: 403 });

  const { data, error } = await db
    .from("posts")
    .insert({ author_id: session.id, content: content.trim(), game: game || "General", post_status: "published" })
    .select(`*, users!author_id(username, role, avatar, plan)`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    ...data,
    username:  (data as any).users?.username,
    user_role: (data as any).users?.role,
    avatar:    (data as any).users?.avatar,
    plan:      (data as any).users?.plan,
    users:     undefined,
  });
}
