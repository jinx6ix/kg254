import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username?.trim() || !email?.trim() || !password)
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username))
      return NextResponse.json({ error: "Username: 3-20 chars, letters/numbers/underscore only" }, { status: 400 });

    const db = createServerClient();

    // Check uniqueness
    const { data: existing } = await db
      .from("users")
      .select("id")
      .or(`username.eq.${username},email.eq.${email}`)
      .limit(1);
    if (existing && existing.length > 0)
      return NextResponse.json({ error: "Username or email already taken" }, { status: 409 });

    const hash   = await hashPassword(password);
    const avatar = username.slice(0, 2).toUpperCase();

    const { data: user, error } = await db
      .from("users")
      .insert({ username, email, password: hash, avatar, role: "member", plan: "none", status: "active" })
      .select("id,username,role,plan,avatar")
      .single();

    if (error || !user)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });

    const token = signToken({ id: user.id, username: user.username, role: user.role, plan: user.plan, avatar: user.avatar });
    const res   = NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role, plan: user.plan, avatar: user.avatar } });
    res.cookies.set("kg254_session", token, { httpOnly: true, path: "/", maxAge: 604800, sameSite: "lax" });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
