import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { sub_status } = await req.json();
  const db = createServerClient();
  await db.from("subscriptions").update({ sub_status }).eq("id", id);
  if (sub_status === "cancelled" || sub_status === "expired") {
    const { data: sub } = await db.from("subscriptions").select("user_id").eq("id", id).single();
    if (sub) await db.from("users").update({ plan: "none", role: "member" }).eq("id", (sub as any).user_id);
  }
  if (sub_status === "active") {
    const { data: sub } = await db.from("subscriptions").select("user_id, plan").eq("id", id).single();
    if (sub) await db.from("users").update({ role: "subscriber" }).eq("id", (sub as any).user_id);
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const db = createServerClient();
  // Reset user plan before deleting
  const { data: sub } = await db.from("subscriptions").select("user_id").eq("id", id).single();
  if (sub) await db.from("users").update({ plan: "none", role: "member" }).eq("id", (sub as any).user_id);
  await db.from("subscriptions").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
