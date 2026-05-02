import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createServerClient();
  const { data } = await db
    .from("comments")
    .select(`*, users!author_id(username, avatar, role)`)
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const comments = (data || []).map((c: any) => ({
    ...c,
    username: c.users?.username,
    avatar:   c.users?.avatar,
    role:     c.users?.role,
    users:    undefined,
  }));
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const db = createServerClient();
  const { data, error } = await db
    .from("comments")
    .insert({ post_id: id, author_id: session.id, content: content.trim() })
    .select(`*, users!author_id(username, avatar, role)`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update comment count
  const { count } = await db.from("comments").select("*", { count: "exact", head: true }).eq("post_id", id);
  await db.from("posts").update({ comments: count || 0 }).eq("id", id);

  return NextResponse.json({
    ...data,
    username: (data as any).users?.username,
    avatar:   (data as any).users?.avatar,
    role:     (data as any).users?.role,
    users:    undefined,
  });
}
