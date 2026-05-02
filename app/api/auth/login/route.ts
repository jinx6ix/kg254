import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password)
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });

    const db = createServerClient();
    const { data: user } = await db
      .from("users")
      .select("*")
      .or(`username.eq.${username},email.eq.${username}`)
      .single();

    if (!user)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    if (user.status === "banned")
      return NextResponse.json({ error: "Account banned. Contact KG254 support." }, { status: 403 });

    const valid = await comparePassword(password, user.password);
    if (!valid)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    await db.from("users").update({ last_seen: new Date().toISOString() }).eq("id", user.id);

    const payload = { id: user.id, username: user.username, role: user.role, plan: user.plan, avatar: user.avatar };
    const token   = signToken(payload);
    const res     = NextResponse.json({ success: true, user: payload });
    res.cookies.set("kg254_session", token, { httpOnly: true, path: "/", maxAge: 604800, sameSite: "lax" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
