import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createServerClient();
  const [users, activeSubs, pendingSubs, posts, flagged, tournaments, live, events] = await Promise.all([
    db.from("users").select("*", { count: "exact", head: true }),
    db.from("subscriptions").select("*", { count: "exact", head: true }).eq("sub_status", "active"),
    db.from("subscriptions").select("*", { count: "exact", head: true }).eq("sub_status", "pending"),
    db.from("posts").select("*", { count: "exact", head: true }).eq("post_status", "published"),
    db.from("posts").select("*", { count: "exact", head: true }).eq("post_status", "flagged"),
    db.from("tournaments").select("*", { count: "exact", head: true }),
    db.from("tournaments").select("*", { count: "exact", head: true }).eq("status", "live"),
    db.from("events").select("*", { count: "exact", head: true }).eq("event_status", "published"),
  ]);

  return NextResponse.json({
    totalUsers:        users.count        ?? 0,
    activeSubscribers: activeSubs.count   ?? 0,
    pendingSubs:       pendingSubs.count  ?? 0,
    totalPosts:        posts.count        ?? 0,
    flaggedPosts:      flagged.count      ?? 0,
    totalTournaments:  tournaments.count  ?? 0,
    liveTournaments:   live.count         ?? 0,
    totalEvents:       events.count       ?? 0,
  });
}
