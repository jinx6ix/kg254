import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { id } = await params;
  const db = createServerClient();

  const { data: existing } = await db
    .from("post_likes")
    .select("post_id")
    .eq("user_id", session.id)
    .eq("post_id", id)
    .maybeSingle();

  if (existing) {
    await db.from("post_likes").delete().eq("user_id", session.id).eq("post_id", id);
  } else {
    await db.from("post_likes").insert({ user_id: session.id, post_id: id });
  }

  const { count } = await db
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", id);

  await db.from("posts").update({ likes: count ?? 0 }).eq("id", id);
  return NextResponse.json({ liked: !existing });
}
