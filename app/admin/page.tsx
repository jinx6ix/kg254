"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Users, FileText, Trophy, Calendar, CreditCard, BarChart2, Shield, Trash2, Ban, CheckCircle, Edit, Plus, X, Eye, AlertTriangle, RefreshCw, Lock } from "lucide-react";
import toast from "react-hot-toast";

type Tab = "overview"|"users"|"posts"|"tournaments"|"events"|"subscriptions";

const TABS = [
  { id: "overview" as Tab, label: "Overview", Icon: BarChart2 },
  { id: "users" as Tab, label: "Users", Icon: Users },
  { id: "posts" as Tab, label: "Posts", Icon: FileText },
  { id: "tournaments" as Tab, label: "Tournaments", Icon: Trophy },
  { id: "events" as Tab, label: "Events", Icon: Calendar },
  { id: "subscriptions" as Tab, label: "Subscriptions", Icon: CreditCard },
];

const STATUS_COLORS: Record<string, string> = { active: "#00ff88", banned: "#ff2244", suspended: "#ff6b00", published: "#00ff88", flagged: "#ff6b00", deleted: "#ff2244", draft: "#8a9bb5", open: "#00ff88", live: "#ff2244", upcoming: "#00d4ff", ended: "#8a9bb5", pending: "#ff6b00", cancelled: "#ff2244", expired: "#8a9bb5" };

function StatCard({ label, value, sub, color = "#00ff88" }: { label: string; value: string|number; sub?: string; color?: string }) {
  return (
    <div className="game-card" style={{ padding: "1.25rem" }}>
      <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.8rem", color }}>{value}</div>
      <div style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#e8f4ff", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.7rem", color: "#8a9bb5", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ---- ADMIN LOGIN ----
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!pw) return;
    setLoading(true);
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    const data = await res.json();
    setLoading(false);
    if (data.error) return toast.error(data.error);
    toast.success("Admin access granted");
    onLogin();
  };
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="game-card" style={{ padding: "2.5rem", maxWidth: 380, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Shield size={40} color="#00ff88" style={{ margin: "0 auto 1rem" }} />
          <h2 style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.4rem", color: "#e8f4ff" }}>Admin Panel</h2>
          <p style={{ color: "#8a9bb5", fontSize: "0.9rem", marginTop: 4 }}>Enter admin password to continue</p>
        </div>
        <input className="game-input" type="password" placeholder="Admin password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ marginBottom: "1rem" }} />
        <button className="btn-primary" style={{ width: "100%", opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
          <Lock size={14} style={{ display: "inline", marginRight: 6 }} />{loading ? "Authenticating..." : "Access Admin Panel"}
        </button>
      </div>
    </div>
  );
}

// ---- USERS TAB ----
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateUser = async (id: string, patch: any) => {
    const res = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    if (res.ok) { toast.success("User updated"); load(); setEditUser(null); } else toast.error("Failed to update");
  };
  const deleteUser = async (id: string, username: string) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("User deleted"); load(); } else toast.error("Failed");
  };

  const filtered = users.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ fontFamily: "Orbitron,monospace", fontSize: "1.1rem", color: "#00ff88" }}>Users ({users.length})</h2>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input className="game-input" style={{ width: 220 }} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={load} style={{ background: "none", border: "1px solid #1a2840", color: "#8a9bb5", padding: "0.5rem 0.75rem", cursor: "pointer" }}><RefreshCw size={16} /></button>
        </div>
      </div>

      {loading ? <div style={{ color: "#8a9bb5", fontFamily: "Share Tech Mono,monospace" }}>Loading...</div> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a2840" }}>
                {["Username","Email","Role","Plan","Status","Joined","Actions"].map(h => (
                  <th key={h} style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontFamily: "Orbitron,monospace", fontSize: "0.7rem", color: "#8a9bb5", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #1a2840" }} onMouseEnter={e => (e.currentTarget.style.background = "#080f1a")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "0.75rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 700, color: "#e8f4ff", fontSize: "0.95rem" }}>{u.username}</td>
                  <td style={{ padding: "0.75rem", fontFamily: "Share Tech Mono,monospace", fontSize: "0.78rem", color: "#8a9bb5" }}>{u.email}</td>
                  <td style={{ padding: "0.75rem" }}><span style={{ color: u.role === "admin" ? "#00ff88" : "#00d4ff", fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>{u.role}</span></td>
                  <td style={{ padding: "0.75rem" }}><span style={{ color: "#ff6b00", fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", textTransform: "uppercase" }}>{u.plan}</span></td>
                  <td style={{ padding: "0.75rem" }}><span style={{ color: STATUS_COLORS[u.status] || "#8a9bb5", fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem" }}>{u.status}</span></td>
                  <td style={{ padding: "0.75rem", fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#8a9bb5" }}>{u.joined_at?.split("T")[0]}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => setEditUser(u)} style={{ background: "none", border: "1px solid #1a2840", color: "#00d4ff", padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.75rem" }} title="Edit"><Edit size={13} /></button>
                      {u.status === "active" ? (
                        <button onClick={() => updateUser(u.id, { status: "banned" })} style={{ background: "none", border: "1px solid #1a2840", color: "#ff6b00", padding: "0.3rem 0.5rem", cursor: "pointer" }} title="Ban"><Ban size={13} /></button>
                      ) : u.role !== "admin" && (
                        <button onClick={() => updateUser(u.id, { status: "active" })} style={{ background: "none", border: "1px solid #1a2840", color: "#00ff88", padding: "0.3rem 0.5rem", cursor: "pointer" }} title="Unban"><CheckCircle size={13} /></button>
                      )}
                      {u.role !== "admin" && (
                        <button onClick={() => deleteUser(u.id, u.username)} style={{ background: "none", border: "1px solid #1a2840", color: "#ff2244", padding: "0.3rem 0.5rem", cursor: "pointer" }} title="Delete"><Trash2 size={13} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="game-card" style={{ padding: "2rem", maxWidth: 420, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "Orbitron,monospace", color: "#00ff88" }}>Edit: {editUser.username}</h3>
              <button onClick={() => setEditUser(null)} style={{ background: "none", border: "none", color: "#8a9bb5", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { field: "role", label: "Role", type: "select", options: ["member","subscriber","admin"] },
                { field: "plan", label: "Plan", type: "select", options: ["none","basic","pro","elite","admin"] },
                { field: "status", label: "Status", type: "select", options: ["active","banned","suspended"] },
              ].map(({ field, label, type, options }) => (
                <div key={field}>
                  <label style={{ display: "block", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#8a9bb5", marginBottom: "0.3rem", textTransform: "uppercase" }}>{label}</label>
                  <select className="game-input" value={editUser[field]} onChange={e => setEditUser((p: any) => ({ ...p, [field]: e.target.value }))}>
                    {options!.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <button className="btn-primary" style={{ marginTop: "0.5rem" }} onClick={() => updateUser(editUser.id, { role: editUser.role, plan: editUser.plan, status: editUser.status })}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- POSTS TAB ----
function PostsTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const res = await fetch("/api/admin/posts"); const d = await res.json(); setPosts(Array.isArray(d) ? d : []); setLoading(false); };
  useEffect(() => { load(); }, []);
  const updatePost = async (id: string, patch: any) => {
    const res = await fetch(`/api/admin/posts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    if (res.ok) { toast.success("Post updated"); load(); } else toast.error("Failed");
  };
  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Post deleted"); load(); } else toast.error("Failed");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "Orbitron,monospace", fontSize: "1.1rem", color: "#00ff88" }}>Posts ({posts.length})</h2>
        <button onClick={load} style={{ background: "none", border: "1px solid #1a2840", color: "#8a9bb5", padding: "0.5rem 0.75rem", cursor: "pointer" }}><RefreshCw size={16} /></button>
      </div>
      {loading ? <div style={{ color: "#8a9bb5" }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {posts.map(p => (
            <div key={p.id} className="game-card" style={{ padding: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, color: "#00d4ff", fontSize: "0.9rem" }}>{p.username || p.author_id}</span>
                  <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", color: STATUS_COLORS[p.post_status] || "#8a9bb5", border: `1px solid ${STATUS_COLORS[p.post_status] || "#8a9bb5"}50`, padding: "1px 5px" }}>{p.post_status}</span>
                  <span className="badge-cyan" style={{ fontSize: "0.62rem" }}>{p.game}</span>
                  <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", color: "#8a9bb5", marginLeft: "auto" }}>❤️ {p.likes} · 💬 {p.comments}</span>
                </div>
                <p style={{ color: "#c8d8e8", fontSize: "0.9rem", lineHeight: 1.5 }}>{p.content?.slice(0, 160)}{p.content?.length > 160 ? "..." : ""}</p>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, flexWrap: "wrap" }}>
                {p.post_status === "flagged" && <button onClick={() => updatePost(p.id, { post_status: "published" })} style={{ background: "none", border: "1px solid #00ff88", color: "#00ff88", padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.72rem" }}>Approve</button>}
                {p.post_status === "published" && <button onClick={() => updatePost(p.id, { post_status: "flagged" })} style={{ background: "none", border: "1px solid #ff6b00", color: "#ff6b00", padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.72rem" }}>Flag</button>}
                <button onClick={() => deletePost(p.id)} style={{ background: "none", border: "1px solid #ff2244", color: "#ff2244", padding: "0.3rem 0.5rem", cursor: "pointer" }}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- SUBSCRIPTIONS TAB ----
function SubsTab() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); const res = await fetch("/api/admin/subscriptions"); const d = await res.json(); setSubs(Array.isArray(d) ? d : []); setLoading(false); };
  useEffect(() => { load(); }, []);
  const updateSub = async (id: string, patch: any) => {
    const res = await fetch(`/api/admin/subscriptions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    if (res.ok) { toast.success("Subscription updated"); load(); } else toast.error("Failed");
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "Orbitron,monospace", fontSize: "1.1rem", color: "#00ff88" }}>Subscriptions ({subs.length})</h2>
        <button onClick={load} style={{ background: "none", border: "1px solid #1a2840", color: "#8a9bb5", padding: "0.5rem 0.75rem", cursor: "pointer" }}><RefreshCw size={16} /></button>
      </div>
      {loading ? <div style={{ color: "#8a9bb5" }}>Loading...</div> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ borderBottom: "1px solid #1a2840" }}>
              {["User","Plan","Amount","M-Pesa","Status","Start","Next Billing","Actions"].map(h => (
                <th key={h} style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontFamily: "Orbitron,monospace", fontSize: "0.68rem", color: "#8a9bb5", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {subs.map(s => (
                <tr key={s.id} style={{ borderBottom: "1px solid #1a2840" }}>
                  <td style={{ padding: "0.75rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 700, color: "#e8f4ff" }}>{s.username}</td>
                  <td style={{ padding: "0.75rem", color: "#ff6b00", fontFamily: "Share Tech Mono,monospace", fontSize: "0.8rem", textTransform: "uppercase" }}>{s.plan}</td>
                  <td style={{ padding: "0.75rem", color: "#00ff88", fontFamily: "Share Tech Mono,monospace", fontSize: "0.8rem" }}>{s.amount}</td>
                  <td style={{ padding: "0.75rem", color: "#8a9bb5", fontFamily: "Share Tech Mono,monospace", fontSize: "0.78rem" }}>{s.mpesa}</td>
                  <td style={{ padding: "0.75rem" }}><span style={{ color: STATUS_COLORS[s.sub_status] || "#8a9bb5", fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem" }}>{s.sub_status}</span></td>
                  <td style={{ padding: "0.75rem", color: "#8a9bb5", fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem" }}>{s.start_date?.split("T")[0]}</td>
                  <td style={{ padding: "0.75rem", color: "#8a9bb5", fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem" }}>{s.next_billing}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.3rem" }}>
                      {s.sub_status === "pending" && <button onClick={() => updateSub(s.id, { sub_status: "active" })} style={{ background: "none", border: "1px solid #00ff88", color: "#00ff88", padding: "0.25rem 0.5rem", cursor: "pointer", fontSize: "0.7rem" }}>Approve</button>}
                      {s.sub_status === "active" && <button onClick={() => updateSub(s.id, { sub_status: "cancelled" })} style={{ background: "none", border: "1px solid #ff2244", color: "#ff2244", padding: "0.25rem 0.5rem", cursor: "pointer", fontSize: "0.7rem" }}>Cancel</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) { router.push("/"); return; }
    if (user?.role === "admin") {
      fetch("/api/admin/stats").then(r => r.json()).then(d => setStats(d)).catch(() => {});
    }
  }, [user, authLoading]);

  if (authLoading) return <div style={{ paddingTop: 120, textAlign: "center", color: "#8a9bb5" }}>Loading...</div>;
  if (!user || user.role !== "admin") return null;
  if (!adminAuthed) return <AdminLogin onLogin={() => setAdminAuthed(true)} />;

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ background: "#080f1a", padding: "2rem 1.5rem 1.5rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Shield size={20} color="#00ff88" />
            <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.5rem", color: "#00ff88" }}>Admin Panel</div>
          </div>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#8a9bb5" }}>KenyanGamer254 — Full Control Dashboard</div>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: 1280, margin: "0 auto" }}>
        {/* Sidebar tabs */}
        <div style={{ width: 200, background: "#080f1a", borderRight: "1px solid #1a2840", minHeight: "calc(100vh - 128px)", padding: "1rem 0", flexShrink: 0 }}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.7rem 1rem", background: tab === id ? "rgba(0,255,136,0.08)" : "none", border: "none", color: tab === id ? "#00ff88" : "#8a9bb5", cursor: "pointer", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.95rem", borderLeft: tab === id ? "2px solid #00ff88" : "2px solid transparent", transition: "all 0.15s" }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "2rem 1.5rem", minWidth: 0 }}>
          {tab === "overview" && stats && (
            <div>
              <h2 style={{ fontFamily: "Orbitron,monospace", fontSize: "1.1rem", color: "#00ff88", marginBottom: "1.5rem" }}>Site Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                <StatCard label="Total Users" value={stats.totalUsers || 0} color="#00ff88" />
                <StatCard label="Active Subs" value={stats.activeSubscribers || 0} color="#9147ff" />
                <StatCard label="Pending Subs" value={stats.pendingSubs || 0} color="#ff6b00" />
                <StatCard label="Total Posts" value={stats.totalPosts || 0} color="#00d4ff" />
                <StatCard label="Flagged Posts" value={stats.flaggedPosts || 0} color="#ff2244" />
                <StatCard label="Tournaments" value={stats.totalTournaments || 0} color="#ff6b00" />
                <StatCard label="Live Now" value={stats.liveTournaments || 0} color="#ff2244" />
                <StatCard label="Events" value={stats.totalEvents || 0} color="#00d4ff" />
              </div>
              {stats.flaggedPosts > 0 && (
                <div style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.3)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <AlertTriangle size={18} color="#ff6b00" />
                  <span style={{ color: "#ff6b00", fontFamily: "Rajdhani,sans-serif", fontWeight: 600 }}>{stats.flaggedPosts} flagged post{stats.flaggedPosts !== 1 ? "s" : ""} need review.</span>
                  <button onClick={() => setTab("posts")} style={{ background: "none", border: "1px solid #ff6b00", color: "#ff6b00", padding: "0.25rem 0.75rem", cursor: "pointer", fontFamily: "Orbitron,monospace", fontSize: "0.72rem", marginLeft: "auto" }}>Review Posts</button>
                </div>
              )}
            </div>
          )}
          {tab === "users" && <UsersTab />}
          {tab === "posts" && <PostsTab />}
          {tab === "subscriptions" && <SubsTab />}
          {tab === "tournaments" && <div style={{ color: "#8a9bb5" }}>Tournament management — use API at <code style={{ color: "#00ff88" }}>/api/admin/tournaments</code></div>}
          {tab === "events" && <div style={{ color: "#8a9bb5" }}>Events management — use API at <code style={{ color: "#00ff88" }}>/api/admin/events</code></div>}
        </div>
      </div>
    </div>
  );
}
