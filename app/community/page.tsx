"use client";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Check, Copy, Send, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

type Post = { id: string; content: string; game: string; likes: number; comments: number; post_status: string; created_at: string; username: string; user_role: string; avatar: string; plan: string; liked?: boolean; };
type Comment = { id: string; content: string; created_at: string; username: string; avatar: string; role: string; };

const ROLE_COLORS: Record<string, string> = { admin: "#00ff88", subscriber: "#9147ff", member: "#00d4ff", guest: "#8a9bb5" };
const GAMES = ["All", "General", "eFootball Mobile", "eFootball Console", "PUBG Mobile", "PUBG PC"];

function ShareMenu({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/community/post/${postId}` : "";
  const copy = () => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#8a9bb5", fontSize: "0.85rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 600 }}>
        <Share2 size={14} /> Share
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "120%", left: 0, background: "#0d1826", border: "1px solid #1a2840", padding: "0.5rem", zIndex: 100, minWidth: 160, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
          {[
            { label: "Twitter/X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Check this out on PTK Africa!")}`, color: "#1da1f2" },
            { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent("Check this out on PTK Africa! " + url)}`, color: "#25d366" },
            { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: "#1877f2" },
          ].map(({ label, href, color }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "0.4rem 0.75rem", color, textDecoration: "none", fontSize: "0.85rem" }} onMouseEnter={e => (e.currentTarget.style.background="#1a2840")} onMouseLeave={e => (e.currentTarget.style.background="transparent")}>{label}</a>
          ))}
          <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: 4, padding: "0.4rem 0.75rem", color: "#8a9bb5", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", width: "100%" }}>
            {copied ? <Check size={13} color="#00ff88" /> : <Copy size={13} />} {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike }: { post: Post; onLike: (id: string) => void }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const roleColor = ROLE_COLORS[post.user_role] || "#8a9bb5";

  const loadComments = async () => {
    if (comments.length > 0) { setShowComments(p => !p); return; }
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
      setShowComments(true);
    } finally { setLoadingComments(false); }
  };

  const submitComment = async () => {
    if (!commentInput.trim() || !user) return;
    const res = await fetch(`/api/posts/${post.id}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: commentInput }) });
    const data = await res.json();
    if (data.error) return toast.error(data.error);
    setComments(p => [...p, data]);
    setCommentInput("");
  };

  const timeLabel = () => { try { return formatDistanceToNow(new Date(post.created_at), { addSuffix: true }); } catch { return ""; } };

  return (
    <div className="game-card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${roleColor}15`, border: `1px solid ${roleColor}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "0.75rem", color: roleColor }}>
          {(post.avatar || post.username[0]).slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "1rem", color: roleColor }}>{post.username}</span>
            <span className="badge-green" style={{ background: `${roleColor}15`, color: roleColor, border: `1px solid ${roleColor}30`, fontSize: "0.6rem" }}>{post.user_role?.toUpperCase()}</span>
            {post.game !== "General" && <span className="badge-cyan" style={{ fontSize: "0.6rem" }}>{post.game}</span>}
            <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.7rem", color: "#8a9bb5", marginLeft: "auto" }}>{timeLabel()}</span>
          </div>
        </div>
      </div>
      <p style={{ color: "#c8d8e8", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1rem" }}>{post.content}</p>
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", borderTop: "1px solid #1a2840", paddingTop: "0.75rem" }}>
        <button onClick={() => user ? onLike(post.id) : toast.error("Login to like posts")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: post.liked ? "#ff2244" : "#8a9bb5", fontSize: "0.85rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, transition: "color 0.2s" }}>
          <Heart size={15} fill={post.liked ? "#ff2244" : "none"} /> {post.likes}
        </button>
        <button onClick={loadComments} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: showComments ? "#00ff88" : "#8a9bb5", fontSize: "0.85rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 600 }}>
          <MessageCircle size={15} /> {post.comments} {showComments ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        <ShareMenu postId={post.id} />
      </div>
      {showComments && (
        <div style={{ marginTop: "1rem", borderTop: "1px solid #1a2840", paddingTop: "1rem" }}>
          {loadingComments && <div style={{ color: "#8a9bb5", fontSize: "0.85rem" }}>Loading...</div>}
          {comments.map(c => (
            <div key={c.id} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.65rem", fontFamily: "Orbitron,monospace", fontWeight: 900, color: "#00d4ff" }}>{(c.avatar || c.username[0]).slice(0,2).toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "0.4rem", marginBottom: 2 }}>
                  <span style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#00d4ff" }}>{c.username}</span>
                  <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.68rem", color: "#8a9bb5" }}>{(() => { try { return formatDistanceToNow(new Date(c.created_at), { addSuffix: true }); } catch { return ""; } })()}</span>
                </div>
                <div style={{ color: "#c8d8e8", fontSize: "0.88rem", lineHeight: 1.5 }}>{c.content}</div>
              </div>
            </div>
          ))}
          {user ? (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <input className="game-input" style={{ flex: 1, fontSize: "0.9rem", padding: "0.5rem 0.75rem" }} placeholder="Add a comment..." value={commentInput} onChange={e => setCommentInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submitComment()} />
              <button onClick={submitComment} className="btn-primary" style={{ padding: "0.5rem 0.75rem", fontSize: "0.72rem" }}><Send size={14} /></button>
            </div>
          ) : (
            <Link href="/login" style={{ color: "#00ff88", fontSize: "0.85rem", textDecoration: "none" }}>Log in to comment</Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [newPost, setNewPost] = useState("");
  const [newGame, setNewGame] = useState("General");
  const [posting, setPosting] = useState(false);

  const fetchPosts = async (game?: string) => {
    setLoading(true);
    try {
      const q = game && game !== "All" ? `?game=${encodeURIComponent(game)}` : "";
      const res = await fetch(`/api/posts${q}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(filter); }, [filter]);

  const handleLike = async (postId: string) => {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    const data = await res.json();
    if (data.error) return toast.error(data.error);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, liked: data.liked, likes: data.liked ? p.likes + 1 : p.likes - 1 } : p));
  };

  const submitPost = async () => {
    if (!newPost.trim()) return toast.error("Write something first!");
    if (!user) return toast.error("Login to post");
    setPosting(true);
    const res = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: newPost, game: newGame }) });
    const data = await res.json();
    setPosting(false);
    if (data.error) return toast.error(data.error);
    setPosts(prev => [data, ...prev]);
    setNewPost("");
    toast.success("Post published!");
  };

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// K.G 254</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Community</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1rem" }}>Share posts, tips, squad lookups and community updates.</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {user ? (
          <div className="game-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "Orbitron,monospace", fontSize: "0.78rem", color: "#00ff88", marginBottom: "0.75rem" }}>POST TO COMMUNITY</div>
            <textarea className="game-input" placeholder="Share news, tips, squad lookups…" value={newPost} onChange={e => setNewPost(e.target.value)} rows={3} style={{ resize: "vertical", marginBottom: "0.75rem" }} />
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
              <select className="game-input" style={{ width: "auto", flex: 1 }} value={newGame} onChange={e => setNewGame(e.target.value)}>
                {GAMES.filter(g => g !== "All").map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <button className="btn-primary" style={{ padding: "0.6rem 1.5rem", opacity: posting ? 0.7 : 1 }} onClick={submitPost} disabled={posting}>
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        ) : (
          <div className="game-card" style={{ padding: "1.25rem", marginBottom: "2rem", textAlign: "center" }}>
            <span style={{ color: "#8a9bb5" }}>
              <Link href="/login" style={{ color: "#00ff88", textDecoration: "none", fontWeight: 600 }}>Log in</Link> or <Link href="/register" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>register</Link> to post in the community.
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {GAMES.map(g => (
            <button key={g} onClick={() => setFilter(g)}
              style={{ background: filter === g ? "#00ff88" : "transparent", color: filter === g ? "#040810" : "#8a9bb5", border: "1px solid", borderColor: filter === g ? "#00ff88" : "#1a2840", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, padding: "0.35rem 0.9rem", cursor: "pointer", transition: "all 0.2s", fontSize: "0.9rem" }}>
              {g}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#8a9bb5", fontFamily: "Share Tech Mono,monospace" }}>Loading posts...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {posts.map(p => <PostCard key={p.id} post={p} onLike={handleLike} />)}
            {posts.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "#8a9bb5" }}>
                <div style={{ fontFamily: "Orbitron,monospace", marginBottom: 8 }}>No posts yet</div>
                <div style={{ fontSize: "0.9rem" }}>Be the first to post!</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
