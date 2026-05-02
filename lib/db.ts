import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export type UserRole = "admin" | "subscriber" | "member" | "guest";
export type Plan = "admin" | "elite" | "pro" | "basic" | "none";
export type Status = "active" | "banned" | "suspended";
export type PostStatus = "published" | "flagged" | "deleted" | "draft";
export type SubStatus = "active" | "pending" | "cancelled" | "expired";
export type TournamentStatus = "open" | "live" | "upcoming" | "ended";
export type EventStatus = "published" | "draft" | "cancelled";

export interface User { id: string; username: string; email: string; password: string; role: UserRole; plan: Plan; status: Status; joinedAt: string; avatar: string; }
export interface Post { id: string; authorId: string; author: string; role: string; content: string; game: string; likes: number; comments: number; status: PostStatus; createdAt: string; }
export interface Tournament { id: string; title: string; game: string; date: string; prize: string; spots: number; registered: string[]; status: TournamentStatus; format: string; }
export interface Event { id: string; title: string; date: string; time: string; location: string; category: string; desc: string; status: EventStatus; rsvps: number; }
export interface Subscription { id: string; userId: string; username: string; email: string; plan: Plan; amount: string; status: SubStatus; startDate: string; nextBilling: string; mpesa: string; }
export interface DB { users: User[]; posts: Post[]; tournaments: Tournament[]; events: Event[]; subscriptions: Subscription[]; stats: Record<string, any>; }

export function readDB(): DB {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { users: [], posts: [], tournaments: [], events: [], subscriptions: [], stats: {} };
  }
}

export function writeDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function saveDB(updater: (db: DB) => DB): DB {
  const db = readDB();
  const updated = updater(db);
  writeDB(updated);
  return updated;
}
