import { NextResponse } from "next/server";
import { getSession, signToken } from "@/lib/auth";
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ token: null });
  const token = signToken({ id: session.id, username: session.username, role: session.role, plan: session.plan, avatar: session.avatar }, "1d");
  return NextResponse.json({ token });
}
