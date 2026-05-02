import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

const PLAN_AMOUNTS: Record<string, string> = { basic: "KSh 299", pro: "KSh 699", elite: "KSh 1,499" };

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { plan, mpesa } = await req.json();
  if (!plan || !PLAN_AMOUNTS[plan]) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  if (!mpesa?.trim()) return NextResponse.json({ error: "M-Pesa number required" }, { status: 400 });

  const db = createServerClient();
  const nextBilling = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { error } = await db
    .from("subscriptions")
    .upsert({
      user_id:      session.id,
      plan,
      amount:       PLAN_AMOUNTS[plan],
      sub_status:   "pending",
      mpesa:        mpesa.trim(),
      next_billing: nextBilling,
    }, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Mark user plan as pending (full activation after admin approval)
  await db.from("users").update({ plan }).eq("id", session.id);
  return NextResponse.json({ success: true, message: "Subscription submitted! Awaiting payment verification." });
}
