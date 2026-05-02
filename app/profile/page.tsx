"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Edit2, Save, Trophy, MessageSquare, Heart, Calendar, Shield, Zap } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const ROLE_COLORS: Record<string, string> = { admin: "#00ff88", subscriber: "#9147ff", member: "#00d4ff", guest: "#8a9bb5" };
const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  admin:  { label: "Admin",       color: "#00ff88" },
  elite:  { label: "Elite VIP",   color: "#ff6b00" },
  pro:    { label: "Pro Member",  color: "#9147ff" },
  basic:  { label: "Supporter",   color: "#00d4ff" },
  none:   { label: "Free",        color: "#8a9bb5" },
};

export default function ProfilePage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.push("/login"); return; }
    if (user) {
      fetch("/api/auth/me").then(r => r.json()).then(d => {
        setProfile(d.user);
        setBio(d.user?.bio || "");
      });
      fetch("/api/posts?limit=10").then(r => r.json()).then(d => {
        if (Array.isArray(d)) setPosts(d.filter((p: any) => p.author_id === user.id));
      });
    }
  }, [user, loading]);

  const saveBio = async () => {
    setSaving(true);
    const res = await fetch("/api/profile/bio", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bio }) });
    const data = await res.json();
    setSaving(false);
    if (data.error) return toast.error(data.error);
    setEditBio(false);
    toast.success("Bio updated!");
    refreshUser();
  };

  if (loading || !user) return <div style={{ paddingTop: 120, textAlign: "center", color: "#8a9bb5" }}>Loading...</div>;

  const roleColor = ROLE_COLORS[user.role] || "#8a9bb5";
  const planInfo = PLAN_LABELS[user.plan] || PLAN_LABELS.none;

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      {/* Header banner */}
      <div style={{ background: `linear-gradient(135deg, ${roleColor}08, #040810)`, borderBottom: "1px solid #1a2840", padding: "3rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: `${roleColor}15`, border: `3px solid ${roleColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "2rem", color: roleColor }}>
            {(user.avatar || user.username[0]).slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <h1 style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.8rem", color: "#e8f4ff" }}>{user.username}</h1>
              <span style={{ background: `${roleColor}15`, color: roleColor, fontFamily: "Share Tech Mono,monospace", fontSize: "0.72rem", padding: "3px 8px", border: `1px solid ${roleColor}30`, textTransform: "uppercase" }}>{user.role}</span>
              <span style={{ background: `${planInfo.color}15`, color: planInfo.color, fontFamily: "Share Tech Mono,monospace", fontSize: "0.72rem", padding: "3px 8px", border: `1px solid ${planInfo.color}30`, textTransform: "uppercase" }}>{planInfo.label}</span>
            </div>

            {/* Bio */}
            {editBio ? (
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <input className="game-input" style={{ flex: 1, minWidth: 200 }} placeholder="Write a short bio..." value={bio} onChange={e => setBio(e.target.value)} maxLength={160} />
                <button onClick={saveBio} className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.72rem", opacity: saving ? 0.7 : 1 }} disabled={saving}>
                  <Save size={13} style={{ display: "inline", marginRight: 4 }} />{saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditBio(false)} style={{ background: "none", border: "1px solid #1a2840", color: "#8a9bb5", padding: "0.5rem 0.75rem", cursor: "pointer" }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ color: profile?.bio ? "#c8d8e8" : "#8a9bb5", fontSize: "0.95rem", fontStyle: profile?.bio ? "normal" : "italic" }}>{profile?.bio || "No bio yet."}</span>
                <button onClick={() => setEditBio(true)} style={{ background: "none", border: "none", color: "#8a9bb5", cursor: "pointer", padding: "0.2rem" }}>
                  <Edit2 size={14} />
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {profile?.joined_at && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#8a9bb5", fontSize: "0.85rem" }}>
                  <Calendar size={13} color="#00d4ff" />
                  Joined {(() => { try { return formatDistanceToNow(new Date(profile.joined_at), { addSuffix: true }); } catch { return profile.joined_at; } })()}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#8a9bb5", fontSize: "0.85rem" }}>
                <MessageSquare size={13} color="#00ff88" /> {posts.length} posts
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {user.plan === "none" && (
              <Link href="/subscribe" className="btn-primary" style={{ fontSize: "0.72rem", padding: "0.5rem 1.1rem", display: "flex", alignItems: "center", gap: 5 }}>
                <Zap size={12} /> Upgrade Plan
              </Link>
            )}
            {user.role === "admin" && (
              <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 5, color: "#00ff88", fontFamily: "Orbitron,monospace", fontSize: "0.72rem", textDecoration: "none", border: "1px solid #00ff88", padding: "0.5rem 1.1rem" }}>
                <Shield size={12} /> Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ fontFamily: "Orbitron,monospace", fontSize: "0.85rem", color: "#00ff88", marginBottom: "1.25rem", letterSpacing: "0.08em" }}>MY POSTS</div>
        {posts.length === 0 ? (
          <div className="game-card" style={{ padding: "2.5rem", textAlign: "center" }}>
            <MessageSquare size={40} style={{ margin: "0 auto 1rem", opacity: 0.3, color: "#8a9bb5" }} />
            <div style={{ color: "#8a9bb5", fontFamily: "Orbitron,monospace", fontSize: "0.85rem" }}>No posts yet</div>
            <Link href="/community" style={{ color: "#00ff88", fontSize: "0.9rem", textDecoration: "none", marginTop: "0.5rem", display: "block" }}>Go post in the community →</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {posts.map(p => (
              <div key={p.id} className="game-card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span className="badge-cyan" style={{ fontSize: "0.65rem" }}>{p.game}</span>
                  <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.7rem", color: "#8a9bb5" }}>
                    ❤️ {p.likes} · 💬 {p.comments}
                  </span>
                </div>
                <p style={{ color: "#c8d8e8", fontSize: "0.92rem", lineHeight: 1.55 }}>{p.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
