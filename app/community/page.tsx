"use client";
import { useState } from "react";
import { Heart, MessageCircle, Share2, AtSign, Globe, Copy, Check, Gamepad2, Trophy, Users, ThumbsUp } from "lucide-react";

type Post = { id: number; author: string; role: "admin"|"sub"|"member"; avatar: string; time: string; content: string; game: string; likes: number; comments: number; liked: boolean; img?: string };

const INITIAL_POSTS: Post[] = [
  { id: 1, author: "KenyanGamer254", role: "admin", avatar: "KG", time: "2h ago", content: "Just hit 12K subscribers! 🔥🇰🇪 Thank you all for the love. Special giveaway stream this Friday — don't miss it! Stay locked.", game: "General", likes: 248, comments: 42, liked: false },
  { id: 2, author: "EagleFC254", role: "sub", avatar: "EF", time: "4h ago", content: "My eFootball tips from the KG254 tutorial actually worked! Won 5 ranked matches straight 😭⚽ Big up KG for the content!", game: "eFootball Mobile", likes: 89, comments: 14, liked: false },
  { id: 3, author: "PUBGKingKE", role: "member", avatar: "PK", time: "6h ago", content: "PUBG squad looking for one more for the Nairobi Classic tournament. Must be Gold+ rank. Drop your tag in comments! 🎯", game: "PUBG Mobile", likes: 34, comments: 27, liked: false },
  { id: 4, author: "KenyanGamer254", role: "admin", avatar: "KG", time: "1d ago", content: "Tournament bracket for the eFootball Spring Cup has been set! Check the Tournaments page. Quarter-finals start Saturday 2PM EAT. All matches will be streamed. Good luck to all 16 players!", game: "eFootball Mobile", likes: 187, comments: 55, liked: false },
  { id: 5, author: "NairobiGamer", role: "sub", avatar: "NG", time: "1d ago", content: "Shoutout to the entire K.G 254 community! This is legit the best gaming community in Kenya 🇰🇪 Proud to be a subscriber!", game: "General", likes: 112, comments: 19, liked: false },
];

const ROLE_COLORS: Record<string, string> = { admin: "#00ff88", sub: "#9147ff", member: "#00d4ff" };
const ROLE_LABELS: Record<string, string> = { admin: "ADMIN", sub: "SUB", member: "MEMBER" };

function ShareMenu({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = `https://kenyangamer254.com/community/post/${post.id}`;
  const text = `${post.content.slice(0, 80)}... — KenyanGamer254 Community`;
  const copy = () => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#8a9bb5", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.85rem", fontFamily: "Rajdhani, sans-serif", fontWeight: 600 }}>
        <Share2 size={15} /> Share
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "120%", left: 0, background: "#0d1826", border: "1px solid #1a2840", padding: "0.5rem", zIndex: 100, minWidth: 160, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
          {[
            { label: "Twitter/X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`, color: "#1da1f2" },
            { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: "#1877f2" },
            { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, color: "#25d366" },
          ].map(({ label, href, color }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ display: "block", padding: "0.4rem 0.75rem", color, textDecoration: "none", fontSize: "0.85rem" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1a2840")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {label}
            </a>
          ))}
          <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.4rem 0.75rem", color: "#8a9bb5", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", width: "100%" }}>
            {copied ? <Check size={13} color="#00ff88" /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPost, setNewPost] = useState("");
  const [game, setGame] = useState("General");
  const [filter, setFilter] = useState("All");
  const games = ["General", "eFootball Mobile", "eFootball Console", "PUBG Mobile", "PUBG PC"];
  const filters = ["All", "General", "eFootball Mobile", "PUBG Mobile"];

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const submitPost = () => {
    if (!newPost.trim()) return;
    const p: Post = {
      id: Date.now(), author: "You", role: "member", avatar: "YO", time: "Just now",
      content: newPost, game, likes: 0, comments: 0, liked: false,
    };
    setPosts(prev => [p, ...prev]);
    setNewPost("");
  };

  const filtered = filter === "All" ? posts : posts.filter(p => p.game === filter);

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// K.G 254</div>
            <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Community</h1>
            <p style={{ color: "#8a9bb5", fontSize: "1rem" }}>Posts, highlights, squad lookups and community updates.</p>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[["8K+", "Members"], ["1.2K", "Posts"], ["48", "Tournaments"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.5rem", color: "#00ff88" }}>{v}</div>
                <div style={{ fontSize: "0.8rem", color: "#8a9bb5" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Post composer */}
        <div className="game-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.8rem", color: "#00ff88", marginBottom: "0.75rem" }}>POST TO COMMUNITY</div>
          <textarea
            className="game-input"
            placeholder="Share news, tips, squad lookups…"
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            rows={3}
            style={{ resize: "vertical", marginBottom: "0.75rem" }}
          />
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <select className="game-input" style={{ width: "auto", flex: 1 }} value={game} onChange={e => setGame(e.target.value)}>
              {games.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <button className="btn-primary" style={{ padding: "0.6rem 1.5rem" }} onClick={submitPost}>Post</button>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ background: filter === f ? "#00ff88" : "transparent", color: filter === f ? "#040810" : "#8a9bb5", border: "1px solid", borderColor: filter === f ? "#00ff88" : "#1a2840", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, padding: "0.35rem 0.9rem", cursor: "pointer", transition: "all 0.2s", fontSize: "0.9rem" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {filtered.map(post => {
            const roleColor = ROLE_COLORS[post.role];
            return (
              <div key={post.id} className="game-card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, background: `${roleColor}20`, border: `1px solid ${roleColor}50`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "0.75rem", color: roleColor }}>
                    {post.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1rem", color: roleColor }}>{post.author}</span>
                      <span style={{ background: `${roleColor}15`, color: roleColor, fontFamily: "Share Tech Mono, monospace", fontSize: "0.62rem", padding: "1px 5px", border: `1px solid ${roleColor}40` }}>{ROLE_LABELS[post.role]}</span>
                      <span className="badge-cyan" style={{ fontSize: "0.62rem" }}>{post.game}</span>
                      <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.72rem", color: "#8a9bb5", marginLeft: "auto" }}>{post.time}</span>
                    </div>
                  </div>
                </div>
                <p style={{ color: "#c8d8e8", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1rem" }}>{post.content}</p>
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", borderTop: "1px solid #1a2840", paddingTop: "0.75rem" }}>
                  <button onClick={() => toggleLike(post.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: post.liked ? "#ff2244" : "#8a9bb5", fontSize: "0.85rem", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, transition: "color 0.2s" }}>
                    <Heart size={15} fill={post.liked ? "#ff2244" : "none"} /> {post.likes}
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#8a9bb5", fontSize: "0.85rem", fontFamily: "Rajdhani, sans-serif", fontWeight: 600 }}>
                    <MessageCircle size={15} /> {post.comments}
                  </button>
                  <ShareMenu post={post} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
