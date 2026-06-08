import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("events")
      .select("id, title, date, time, location, category, description, event_status, rsvps, image_url, game, prize, spots, event_type")
      .eq("event_status", "published")
      .order("date", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events: data || [] }, { status: 200 });
  } catch (err) {
    console.error("Events API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}