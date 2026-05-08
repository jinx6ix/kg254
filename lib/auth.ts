import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const JWT_SECRET = process.env.JWT_SECRET || "PTK AFRICA-secret-change-in-prod";

export interface SessionUser {
  id: string;
  username: string;
  role: string;
  plan: string;
  avatar: string;
}

export function signToken(payload: SessionUser, expiresIn = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): SessionUser | null {
  try { return jwt.verify(token, JWT_SECRET) as SessionUser; }
  catch { return null; }
}

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export async function comparePassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ptk_session")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch { return null; }
}
