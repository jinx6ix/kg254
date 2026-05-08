"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Users, FileText, Trophy, Calendar, CreditCard, BarChart2, Shield,
  Trash2, Ban, CheckCircle, Edit, X, AlertTriangle, RefreshCw, Lock,
  Plus, Play, Link as LinkIcon, MessageSquare, Send, Youtube, Twitch,
  Video, Check, ChevronDown, ChevronUp, Search, Filter
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = "overview"|"users"|"posts"|"tournaments"|"events"|"streams"|"subscriptions"|"chat";

const TABS: { id: Tab; label: string; Icon: any }[] = [
  { id: "overview",      label: "Overview",      Icon: BarChart2    },
  { id: "users",         label: "Users",         Icon: Users        },
  { id: "subscriptions", label: "Subscriptions", Icon: CreditCard   },
  { id: "tournaments",   label: "Tournaments",   Icon: Trophy       },
  { id: "events",        label: "Events",        Icon: Calendar     },
  { id: "streams",       label: "Streams",       Icon: Video        },
  { id: "posts",         label: "Community",     Icon: FileText     },
  { id: "chat",          label: "Live Chat",     Icon: MessageSquare},
];

const SC: Record<string,string> = {
  active:"#00ff88", banned:"#ff2244", suspended:"#ff6b00",
  published:"#00ff88", flagged:"#ff6b00", deleted:"#ff2244", draft:"#8a9bb5",
  open:"#00ff88", live:"#ff2244", upcoming:"#00d4ff", ended:"#8a9bb5",
  pending:"#ff6b00", cancelled:"#ff2244", expired:"#8a9bb5",
};

/* ─── tiny reusable helpers ─── */
const Th = ({ children }: { children: string }) => (
  <th style={{ padding:"0.55rem 0.75rem", textAlign:"left", fontFamily:"Orbitron,monospace",
    fontSize:"0.67rem", color:"#8a9bb5", letterSpacing:"0.08em", whiteSpace:"nowrap",
    borderBottom:"1px solid #1a2840" }}>{children}</th>
);
const Td = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <td style={{ padding:"0.7rem 0.75rem", borderBottom:"1px solid #0d1826", verticalAlign:"middle", ...style }}>{children}</td>
);
const Badge = ({ v, fallback="#8a9bb5" }: { v: string; fallback?: string }) => (
  <span style={{ color: SC[v]||fallback, fontFamily:"Share Tech Mono,monospace",
    fontSize:"0.72rem", border:`1px solid ${SC[v]||fallback}40`,
    background:`${SC[v]||fallback}10`, padding:"1px 6px", textTransform:"uppercase" }}>{v}</span>
);
const Btn = ({ onClick, color="#00d4ff", title, children, style={} }:
  { onClick:()=>void; color?:string; title?:string; children:React.ReactNode; style?:React.CSSProperties }) => (
  <button onClick={onClick} title={title}
    style={{ background:"none", border:`1px solid ${color}40`, color, padding:"0.28rem 0.55rem",
      cursor:"pointer", fontSize:"0.78rem", transition:"all 0.15s", lineHeight:1, ...style }}
    onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=`${color}18`; }}
    onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background="none"; }}>
    {children}
  </button>
);

function StatCard({ label, value, color="#00ff88" }: { label:string; value:any; color?:string }) {
  return (
    <div className="game-card" style={{ padding:"1.25rem" }}>
      <div style={{ fontFamily:"Orbitron,monospace", fontWeight:900, fontSize:"1.8rem", color }}>{value}</div>
      <div style={{ fontFamily:"Rajdhani,sans-serif", fontWeight:600, fontSize:"0.88rem", color:"#e8f4ff", marginTop:2 }}>{label}</div>
    </div>
  );
}

/* ─── MODAL wrapper ─── */
function Modal({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:2000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
      <div className="game-card" style={{ padding:"2rem", maxWidth:520, width:"100%", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"1.5rem" }}>
          <h3 style={{ fontFamily:"Orbitron,monospace", fontSize:"1rem", color:"#00ff88" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#8a9bb5", cursor:"pointer" }}><X size={20}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div>
      <label style={{ display:"block", fontFamily:"Rajdhani,sans-serif", fontWeight:600,
        fontSize:"0.8rem", color:"#8a9bb5", marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADMIN LOGIN
═══════════════════════════════════════════ */
function AdminLogin({ onLogin }: { onLogin:()=>void }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const go = async () => {
    if (!pw) return;
    setLoading(true);
    const r = await fetch("/api/admin/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ password:pw }) });
    const d = await r.json();
    setLoading(false);
    if (d.error) return toast.error(d.error);
    toast.success("Welcome, Admin 🎮");
    onLogin();
  };
  return (
    <div style={{ paddingTop:64, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="game-card" style={{ padding:"2.5rem", maxWidth:380, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <Shield size={44} color="#00ff88" style={{ margin:"0 auto 1rem" }} />
          <h2 style={{ fontFamily:"Orbitron,monospace", fontWeight:900, fontSize:"1.4rem", color:"#e8f4ff" }}>Admin Panel</h2>
          <p style={{ color:"#8a9bb5", fontSize:"0.9rem", marginTop:4 }}>Enter your admin password</p>
        </div>
        <input className="game-input" type="password" placeholder="Admin password" value={pw}
          onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} style={{ marginBottom:"1rem" }}/>
        <button className="btn-primary" style={{ width:"100%", opacity:loading?0.7:1 }} onClick={go} disabled={loading}>
          <Lock size={13} style={{ display:"inline", marginRight:6 }}/>{loading?"Checking...":"Access Admin Panel"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   USERS TAB
═══════════════════════════════════════════ */
function UsersTab() {
  const [users, setUsers]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/users");
    const d = await r.json();
    setUsers(Array.isArray(d) ? d : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (patch: any) => {
    const r = await fetch(`/api/admin/users/${editing.id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(patch) });
    if (r.ok) { toast.success("User updated"); setEditing(null); load(); } else toast.error("Failed");
  };
  const del = async (u: any) => {
    if (!confirm(`Delete "${u.username}"? Cannot be undone.`)) return;
    const r = await fetch(`/api/admin/users/${u.id}`, { method:"DELETE" });
    if (r.ok) { toast.success("Deleted"); load(); } else toast.error("Failed");
  };

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem", flexWrap:"wrap", gap:"0.75rem" }}>
        <h2 style={{ fontFamily:"Orbitron,monospace", fontSize:"1rem", color:"#00ff88" }}>Users ({users.length})</h2>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <div style={{ position:"relative" }}>
            <Search size={14} style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:"#8a9bb5" }}/>
            <input className="game-input" style={{ width:200, paddingLeft:"2rem" }} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <Btn onClick={load} color="#8a9bb5"><RefreshCw size={14}/></Btn>
        </div>
      </div>
      {loading ? <div style={{ color:"#8a9bb5", fontFamily:"Share Tech Mono,monospace", fontSize:"0.85rem" }}>Loading users...</div> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              {["User","Email","Role","Plan","Status","Joined","Actions"].map(h=><Th key={h}>{h}</Th>)}
            </tr></thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u.id} onMouseEnter={e=>(e.currentTarget.style.background="#080f1a")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <Td><div style={{ fontFamily:"Rajdhani,sans-serif", fontWeight:700, color:"#e8f4ff", fontSize:"0.95rem" }}>{u.username}</div></Td>
                  <Td><span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.76rem", color:"#8a9bb5" }}>{u.email}</span></Td>
                  <Td><Badge v={u.role} fallback="#00d4ff"/></Td>
                  <Td><Badge v={u.plan} fallback="#ff6b00"/></Td>
                  <Td><Badge v={u.status}/></Td>
                  <Td><span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", color:"#8a9bb5" }}>{u.joined_at?.split("T")[0]}</span></Td>
                  <Td>
                    <div style={{ display:"flex", gap:"0.3rem" }}>
                      <Btn onClick={()=>setEditing({...u})} color="#00d4ff" title="Edit"><Edit size={13}/></Btn>
                      {u.status==="active"
                        ? <Btn onClick={()=>save.bind(null,{status:"banned"})&&fetch(`/api/admin/users/${u.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"banned"})}).then(()=>{toast.success("Banned");load()})} color="#ff6b00" title="Ban"><Ban size={13}/></Btn>
                        : u.role!=="admin" && <Btn onClick={()=>fetch(`/api/admin/users/${u.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:"active"})}).then(()=>{toast.success("Unbanned");load()})} color="#00ff88" title="Unban"><CheckCircle size={13}/></Btn>
                      }
                      {u.role!=="admin" && <Btn onClick={()=>del(u)} color="#ff2244" title="Delete"><Trash2 size={13}/></Btn>}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{ textAlign:"center", padding:"2rem", color:"#8a9bb5" }}>No users found</div>}
        </div>
      )}

      {editing && (
        <Modal title={`Edit: ${editing.username}`} onClose={()=>setEditing(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            {([["role","Role",["member","subscriber","admin"]],["plan","Plan",["none","basic","pro","elite","admin"]],["status","Status",["active","banned","suspended"]]] as any[]).map(([field,label,opts])=>(
              <Field key={field} label={label}>
                <select className="game-input" value={editing[field]} onChange={e=>setEditing((p:any)=>({...p,[field]:e.target.value}))}>
                  {opts.map((o:string)=><option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
            ))}
            <button className="btn-primary" style={{ marginTop:"0.5rem" }} onClick={()=>save({ role:editing.role, plan:editing.plan, status:editing.status })}>Save Changes</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUBSCRIPTIONS TAB
═══════════════════════════════════════════ */
function SubsTab() {
  const [subs, setSubs]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/subscriptions");
    const d = await r.json();
    setSubs(Array.isArray(d) ? d : []);
    setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const update = async (id:string, patch:any) => {
    const r = await fetch(`/api/admin/subscriptions/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(patch)});
    if(r.ok){toast.success("Updated");load();}else toast.error("Failed");
  };
  const del = async (id:string, username:string) => {
    if(!confirm(`Delete subscription for "${username}"?`))return;
    const r = await fetch(`/api/admin/subscriptions/${id}`,{method:"DELETE"});
    if(r.ok){toast.success("Deleted");load();}else toast.error("Failed");
  };

  const filtered = filter==="all" ? subs : subs.filter(s=>s.sub_status===filter);
  const counts = { all:subs.length, pending:subs.filter(s=>s.sub_status==="pending").length, active:subs.filter(s=>s.sub_status==="active").length };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem", flexWrap:"wrap", gap:"0.75rem" }}>
        <h2 style={{ fontFamily:"Orbitron,monospace", fontSize:"1rem", color:"#00ff88" }}>Subscriptions</h2>
        <div style={{ display:"flex", gap:"0.4rem" }}>
          {(["all","pending","active","cancelled"] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ background:filter===f?"#00ff88":"transparent", color:filter===f?"#040810":"#8a9bb5",
                border:"1px solid", borderColor:filter===f?"#00ff88":"#1a2840",
                fontFamily:"Rajdhani,sans-serif", fontWeight:600, padding:"0.3rem 0.75rem",
                cursor:"pointer", fontSize:"0.85rem", transition:"all 0.2s" }}>
              {f} {f==="pending"&&counts.pending>0&&<span style={{ color:"#ff6b00", fontWeight:900 }}>({counts.pending})</span>}
            </button>
          ))}
          <Btn onClick={load} color="#8a9bb5"><RefreshCw size={14}/></Btn>
        </div>
      </div>

      {counts.pending>0&&(
        <div style={{ background:"rgba(255,107,0,0.08)", border:"1px solid rgba(255,107,0,0.3)", padding:"0.75rem 1rem", marginBottom:"1rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <AlertTriangle size={16} color="#ff6b00"/>
          <span style={{ color:"#ff6b00", fontFamily:"Rajdhani,sans-serif", fontWeight:600 }}>{counts.pending} subscription{counts.pending!==1?"s":""} awaiting M-Pesa payment verification</span>
        </div>
      )}

      {loading ? <div style={{ color:"#8a9bb5" }}>Loading...</div> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>
              {["User","Email","Plan","Amount","M-Pesa","Status","Start","Next Billing","Actions"].map(h=><Th key={h}>{h}</Th>)}
            </tr></thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id} onMouseEnter={e=>(e.currentTarget.style.background="#080f1a")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <Td><span style={{ fontFamily:"Rajdhani,sans-serif", fontWeight:700, color:"#e8f4ff" }}>{s.username}</span></Td>
                  <Td><span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.74rem", color:"#8a9bb5" }}>{s.email}</span></Td>
                  <Td><Badge v={s.plan} fallback="#ff6b00"/></Td>
                  <Td><span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.8rem", color:"#00ff88" }}>{s.amount}</span></Td>
                  <Td><span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.78rem", color:"#8a9bb5" }}>{s.mpesa}</span></Td>
                  <Td><Badge v={s.sub_status}/></Td>
                  <Td><span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", color:"#8a9bb5" }}>{s.start_date?.split("T")[0]}</span></Td>
                  <Td><span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", color:"#8a9bb5" }}>{s.next_billing}</span></Td>
                  <Td>
                    <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                      {s.sub_status==="pending"&&<Btn onClick={()=>update(s.id,{sub_status:"active"})} color="#00ff88">Approve</Btn>}
                      {s.sub_status==="active"&&<Btn onClick={()=>update(s.id,{sub_status:"cancelled"})} color="#ff6b00">Cancel</Btn>}
                      {s.sub_status==="expired"&&<Btn onClick={()=>update(s.id,{sub_status:"active"})} color="#00d4ff">Reactivate</Btn>}
                      <Btn onClick={()=>del(s.id,s.username)} color="#ff2244"><Trash2 size={13}/></Btn>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{ textAlign:"center", padding:"2rem", color:"#8a9bb5" }}>No subscriptions found</div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOURNAMENTS TAB
═══════════════════════════════════════════ */
const EMPTY_T = { title:"", game:"eFootball Mobile", date:"", prize:"", spots:16, format:"1v1 Knockout", status:"open", description:"" };
const GAMES   = ["eFootball Mobile","eFootball Console","PUBG Mobile","PUBG PC","Other"];
const T_FMTS  = ["1v1 Knockout","2v2","Squad (4v4)","Trio (3v3)","League + KO","Battle Royale","Free for All"];
const T_STATS = ["open","upcoming","live","ended"];

function TournamentsTab() {
  const [items, setItems]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState<any>(null); // null=closed, {}=new, {...}=edit
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/tournaments");
    const d = await r.json();
    setItems(Array.isArray(d)?d:[]);
    setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const save = async () => {
    if(!form.title||!form.game||!form.date||!form.prize){toast.error("Fill all required fields");return;}
    setSaving(true);
    const isEdit = !!form.id;
    const url    = isEdit ? `/api/admin/tournaments/${form.id}` : "/api/admin/tournaments";
    const method = isEdit ? "PATCH" : "POST";
    const r = await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const d = await r.json();
    setSaving(false);
    if(d.error){toast.error(d.error);return;}
    toast.success(isEdit?"Tournament updated!":"Tournament created!");
    setForm(null); load();
  };
  const del = async (id:string,title:string) => {
    if(!confirm(`Delete "${title}"?`))return;
    const r = await fetch(`/api/admin/tournaments/${id}`,{method:"DELETE"});
    if(r.ok){toast.success("Deleted");load();}else toast.error("Failed");
  };
  const changeStatus = async (id:string, status:string) => {
    await fetch(`/api/admin/tournaments/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    toast.success(`Status → ${status}`); load();
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem", flexWrap:"wrap", gap:"0.75rem" }}>
        <h2 style={{ fontFamily:"Orbitron,monospace", fontSize:"1rem", color:"#00ff88" }}>Tournaments ({items.length})</h2>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <button className="btn-primary" style={{ padding:"0.5rem 1rem", fontSize:"0.72rem" }} onClick={()=>setForm({...EMPTY_T})}>
            <Plus size={13} style={{ display:"inline", marginRight:5 }}/>New Tournament
          </button>
          <Btn onClick={load} color="#8a9bb5"><RefreshCw size={14}/></Btn>
        </div>
      </div>

      {loading ? <div style={{ color:"#8a9bb5" }}>Loading...</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {items.map(t=>(
            <div key={t.id} className="game-card" style={{ padding:"1.1rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.5rem" }}>
                <div>
                  <div style={{ fontFamily:"Orbitron,monospace", fontSize:"0.9rem", color:"#e8f4ff", marginBottom:4 }}>{t.title}</div>
                  <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", alignItems:"center" }}>
                    <Badge v={t.status}/><span className="badge-orange">{t.game}</span>
                    <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", color:"#ff6b00" }}>{t.prize}</span>
                    <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", color:"#8a9bb5" }}>{t.registered_count||0}/{t.spots} players · {t.format} · {t.date}</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:"0.35rem", flexWrap:"wrap" }}>
                  {/* Quick status change */}
                  {T_STATS.filter(s=>s!==t.status).map(s=>(
                    <Btn key={s} onClick={()=>changeStatus(t.id,s)} color={SC[s]||"#8a9bb5"} style={{ fontSize:"0.68rem", padding:"0.22rem 0.5rem" }}>{s}</Btn>
                  ))}
                  <Btn onClick={()=>setForm({...t})} color="#00d4ff"><Edit size={13}/></Btn>
                  <Btn onClick={()=>del(t.id,t.title)} color="#ff2244"><Trash2 size={13}/></Btn>
                </div>
              </div>
              {t.description&&<p style={{ color:"#8a9bb5", fontSize:"0.82rem", marginTop:"0.5rem", lineHeight:1.5 }}>{t.description}</p>}
            </div>
          ))}
          {items.length===0&&<div style={{ textAlign:"center", padding:"3rem", color:"#8a9bb5" }}>No tournaments yet. Create one!</div>}
        </div>
      )}

      {form && (
        <Modal title={form.id?"Edit Tournament":"New Tournament"} onClose={()=>setForm(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <Field label="Title *"><input className="game-input" value={form.title} onChange={e=>setForm((p:any)=>({...p,title:e.target.value}))} placeholder="eFootball Spring Cup 2025"/></Field>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
              <Field label="Game *">
                <select className="game-input" value={form.game} onChange={e=>setForm((p:any)=>({...p,game:e.target.value}))}>
                  {GAMES.map(g=><option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Format">
                <select className="game-input" value={form.format} onChange={e=>setForm((p:any)=>({...p,format:e.target.value}))}>
                  {T_FMTS.map(f=><option key={f} value={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Date *"><input className="game-input" type="date" value={form.date} onChange={e=>setForm((p:any)=>({...p,date:e.target.value}))}/></Field>
              <Field label="Prize *"><input className="game-input" value={form.prize} onChange={e=>setForm((p:any)=>({...p,prize:e.target.value}))} placeholder="KSh 50,000"/></Field>
              <Field label="Max Spots"><input className="game-input" type="number" min={2} max={256} value={form.spots} onChange={e=>setForm((p:any)=>({...p,spots:parseInt(e.target.value)||16}))}/></Field>
              <Field label="Status">
                <select className="game-input" value={form.status} onChange={e=>setForm((p:any)=>({...p,status:e.target.value}))}>
                  {T_STATS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Description"><textarea className="game-input" rows={3} value={form.description} onChange={e=>setForm((p:any)=>({...p,description:e.target.value}))} placeholder="Tournament details, rules, requirements..." style={{ resize:"vertical" }}/></Field>
            <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
              <button className="btn-primary" style={{ flex:1, opacity:saving?0.7:1 }} onClick={save} disabled={saving}>{saving?"Saving...":form.id?"Update Tournament":"Create Tournament"}</button>
              <button onClick={()=>setForm(null)} style={{ background:"none", border:"1px solid #1a2840", color:"#8a9bb5", padding:"0.6rem 1rem", cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   EVENTS TAB
═══════════════════════════════════════════ */
const EMPTY_E = { title:"", date:"", time:"", location:"", category:"Stream", description:"", event_status:"published" };
const E_CATS  = ["Stream","Tournament","IRL","Workshop","Other"];
const E_STATS = ["published","draft","cancelled"];

function EventsTab() {
  const [items, setItems]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState<any>(null);
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/events");
    const d = await r.json();
    setItems(Array.isArray(d)?d:[]);
    setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const save = async () => {
    if(!form.title||!form.date||!form.category){toast.error("Fill all required fields");return;}
    setSaving(true);
    const isEdit = !!form.id;
    const r = await fetch(isEdit?`/api/admin/events/${form.id}`:"/api/admin/events",
      {method:isEdit?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const d = await r.json();
    setSaving(false);
    if(d.error){toast.error(d.error);return;}
    toast.success(isEdit?"Event updated!":"Event created!");
    setForm(null); load();
  };
  const del = async (id:string,title:string) => {
    if(!confirm(`Delete "${title}"?`))return;
    const r = await fetch(`/api/admin/events/${id}`,{method:"DELETE"});
    if(r.ok){toast.success("Deleted");load();}else toast.error("Failed");
  };

  const CAT_COLORS: Record<string,string> = { Stream:"#00ff88",Tournament:"#ff6b00",IRL:"#00d4ff",Workshop:"#9147ff",Other:"#8a9bb5" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem", flexWrap:"wrap", gap:"0.75rem" }}>
        <h2 style={{ fontFamily:"Orbitron,monospace", fontSize:"1rem", color:"#00ff88" }}>Events ({items.length})</h2>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <button className="btn-primary" style={{ padding:"0.5rem 1rem", fontSize:"0.72rem" }} onClick={()=>setForm({...EMPTY_E})}>
            <Plus size={13} style={{ display:"inline", marginRight:5 }}/>New Event
          </button>
          <Btn onClick={load} color="#8a9bb5"><RefreshCw size={14}/></Btn>
        </div>
      </div>

      {loading ? <div style={{ color:"#8a9bb5" }}>Loading...</div> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"0.75rem" }}>
          {items.map(ev=>(
            <div key={ev.id} className="game-card" style={{ padding:"1.1rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.6rem" }}>
                <span style={{ background:`${CAT_COLORS[ev.category]||"#8a9bb5"}18`, color:CAT_COLORS[ev.category]||"#8a9bb5", border:`1px solid ${CAT_COLORS[ev.category]||"#8a9bb5"}40`, fontFamily:"Share Tech Mono,monospace", fontSize:"0.68rem", padding:"2px 7px" }}>{ev.category}</span>
                <Badge v={ev.event_status}/>
              </div>
              <div style={{ fontFamily:"Orbitron,monospace", fontSize:"0.85rem", color:"#e8f4ff", marginBottom:"0.5rem", lineHeight:1.3 }}>{ev.title}</div>
              <div style={{ color:"#8a9bb5", fontSize:"0.82rem", marginBottom:"0.75rem" }}>📅 {ev.date} · ⏰ {ev.time} · 📍 {ev.location}</div>
              <div style={{ color:"#8a9bb5", fontSize:"0.8rem", marginBottom:"0.75rem" }}>👥 {ev.rsvps} RSVPs</div>
              <div style={{ display:"flex", gap:"0.35rem" }}>
                <Btn onClick={()=>setForm({...ev})} color="#00d4ff"><Edit size={13}/> Edit</Btn>
                {ev.event_status!=="published"&&<Btn onClick={async()=>{await fetch(`/api/admin/events/${ev.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({event_status:"published"})});toast.success("Published");load();}} color="#00ff88">Publish</Btn>}
                {ev.event_status==="published"&&<Btn onClick={async()=>{await fetch(`/api/admin/events/${ev.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({event_status:"draft"})});toast.success("Set to draft");load();}} color="#8a9bb5">Draft</Btn>}
                <Btn onClick={()=>del(ev.id,ev.title)} color="#ff2244"><Trash2 size={13}/></Btn>
              </div>
            </div>
          ))}
          {items.length===0&&<div style={{ gridColumn:"1/-1", textAlign:"center", padding:"3rem", color:"#8a9bb5" }}>No events yet. Create one!</div>}
        </div>
      )}

      {form && (
        <Modal title={form.id?"Edit Event":"New Event"} onClose={()=>setForm(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <Field label="Title *"><input className="game-input" value={form.title} onChange={e=>setForm((p:any)=>({...p,title:e.target.value}))} placeholder="eFootball Spring Cup Day"/></Field>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
              <Field label="Date *"><input className="game-input" type="date" value={form.date} onChange={e=>setForm((p:any)=>({...p,date:e.target.value}))}/></Field>
              <Field label="Time"><input className="game-input" value={form.time} onChange={e=>setForm((p:any)=>({...p,time:e.target.value}))} placeholder="8:00 PM EAT"/></Field>
              <Field label="Category">
                <select className="game-input" value={form.category} onChange={e=>setForm((p:any)=>({...p,category:e.target.value}))}>
                  {E_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className="game-input" value={form.event_status} onChange={e=>setForm((p:any)=>({...p,event_status:e.target.value}))}>
                  {E_STATS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Location"><input className="game-input" value={form.location} onChange={e=>setForm((p:any)=>({...p,location:e.target.value}))} placeholder="Online — Twitch & YouTube"/></Field>
            <Field label="Description"><textarea className="game-input" rows={3} value={form.description} onChange={e=>setForm((p:any)=>({...p,description:e.target.value}))} placeholder="Event details..." style={{ resize:"vertical" }}/></Field>
            <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
              <button className="btn-primary" style={{ flex:1, opacity:saving?0.7:1 }} onClick={save} disabled={saving}>{saving?"Saving...":form.id?"Update Event":"Create Event"}</button>
              <button onClick={()=>setForm(null)} style={{ background:"none", border:"1px solid #1a2840", color:"#8a9bb5", padding:"0.6rem 1rem", cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STREAMS TAB
═══════════════════════════════════════════ */
const EMPTY_S = { title:"", platform:"YouTube", url:"", game:"eFootball Mobile", type:"vod", is_live:false };
const PLATFORMS = ["YouTube","Twitch","TikTok","Facebook Gaming","Other"];
const STREAM_TYPES = ["vod","highlight","tutorial","tournament"];

function StreamsTab() {
  const [streams, setStreams]  = useState<any[]>([]);
  const [loading, setLoading]  = useState(true);
  const [form, setForm]        = useState<any>(null);
  const [saving, setSaving]    = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/streams");
    const d = await r.json();
    setStreams(Array.isArray(d)?d:[]);
    setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const save = async () => {
    if(!form.title||!form.url||!form.platform){toast.error("Title, URL and platform required");return;}
    setSaving(true);
    const isEdit = !!form.id;
    const r = await fetch(isEdit?`/api/admin/streams/${form.id}`:"/api/admin/streams",
      {method:isEdit?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const d = await r.json();
    setSaving(false);
    if(d.error){toast.error(d.error);return;}
    toast.success(isEdit?"Stream updated!":"Stream added!");
    setForm(null); load();
  };
  const del = async (id:string,title:string) => {
    if(!confirm(`Remove "${title}"?`))return;
    const r = await fetch(`/api/admin/streams/${id}`,{method:"DELETE"});
    if(r.ok){toast.success("Removed");load();}else toast.error("Failed");
  };
  const toggleLive = async (id:string, is_live:boolean) => {
    await fetch(`/api/admin/streams/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({is_live:!is_live})});
    toast.success(is_live?"Stream set to offline":"Stream set to LIVE 🔴");
    load();
  };

  const PLAT_COLORS: Record<string,string> = { YouTube:"#ff2244",Twitch:"#9147ff",TikTok:"#00d4ff","Facebook Gaming":"#1877f2",Other:"#8a9bb5" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem", flexWrap:"wrap", gap:"0.75rem" }}>
        <h2 style={{ fontFamily:"Orbitron,monospace", fontSize:"1rem", color:"#00ff88" }}>Streams & VODs ({streams.length})</h2>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <button className="btn-primary" style={{ padding:"0.5rem 1rem", fontSize:"0.72rem" }} onClick={()=>setForm({...EMPTY_S})}>
            <Plus size={13} style={{ display:"inline", marginRight:5 }}/>Add Stream
          </button>
          <Btn onClick={load} color="#8a9bb5"><RefreshCw size={14}/></Btn>
        </div>
      </div>

      <div style={{ background:"rgba(0,255,136,0.04)", border:"1px solid rgba(0,255,136,0.12)", padding:"0.85rem 1rem", marginBottom:"1.25rem", fontSize:"0.85rem", color:"#8a9bb5", lineHeight:1.6 }}>
        💡 Paste your YouTube, Twitch, TikTok or any stream link. The streams page will show these to your community. Mark a stream as <strong style={{ color:"#ff2244" }}>LIVE</strong> to feature it at the top with the live badge.
      </div>

      {loading ? <div style={{ color:"#8a9bb5" }}>Loading...</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
          {streams.map(s=>(
            <div key={s.id} className="game-card" style={{ padding:"1rem", borderColor:s.is_live?"rgba(255,34,68,0.4)":"#1a2840" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.5rem" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.35rem" }}>
                    {s.is_live&&<span style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,34,68,0.15)", border:"1px solid rgba(255,34,68,0.4)", padding:"2px 8px", fontFamily:"Share Tech Mono,monospace", fontSize:"0.65rem", color:"#ff2244" }}><span className="live-dot" style={{ width:6,height:6 }}/>LIVE</span>}
                    <span style={{ color:PLAT_COLORS[s.platform]||"#8a9bb5", fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", border:`1px solid ${PLAT_COLORS[s.platform]||"#8a9bb5"}40`, padding:"1px 6px" }}>{s.platform}</span>
                    <span className="badge-cyan" style={{ fontSize:"0.65rem" }}>{s.game}</span>
                    <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.68rem", color:"#8a9bb5", textTransform:"uppercase" }}>{s.type}</span>
                  </div>
                  <div style={{ fontFamily:"Rajdhani,sans-serif", fontWeight:700, color:"#e8f4ff", fontSize:"0.95rem" }}>{s.title}</div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", color:"#00d4ff", textDecoration:"none", display:"flex", alignItems:"center", gap:3, marginTop:3 }}>
                    <LinkIcon size={11}/> {s.url?.length>60?s.url.slice(0,60)+"...":s.url}
                  </a>
                </div>
                <div style={{ display:"flex", gap:"0.35rem", flexShrink:0 }}>
                  <Btn onClick={()=>toggleLive(s.id,s.is_live)} color={s.is_live?"#ff2244":"#00ff88"} style={{ fontSize:"0.7rem" }}>{s.is_live?"Set Offline":"Set LIVE"}</Btn>
                  <Btn onClick={()=>setForm({...s})} color="#00d4ff"><Edit size={13}/></Btn>
                  <Btn onClick={()=>del(s.id,s.title)} color="#ff2244"><Trash2 size={13}/></Btn>
                </div>
              </div>
            </div>
          ))}
          {streams.length===0&&<div style={{ textAlign:"center", padding:"3rem", color:"#8a9bb5" }}>No streams yet. Add your first link!</div>}
        </div>
      )}

      {form && (
        <Modal title={form.id?"Edit Stream":"Add Stream / VOD"} onClose={()=>setForm(null)}>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
            <Field label="Title *"><input className="game-input" value={form.title} onChange={e=>setForm((p:any)=>({...p,title:e.target.value}))} placeholder="KG254 Weekly Clash #12 — Live"/></Field>
            <Field label="Stream / Video URL *"><input className="game-input" value={form.url} onChange={e=>setForm((p:any)=>({...p,url:e.target.value}))} placeholder="https://youtu.be/... or https://twitch.tv/..."/></Field>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
              <Field label="Platform *">
                <select className="game-input" value={form.platform} onChange={e=>setForm((p:any)=>({...p,platform:e.target.value}))}>
                  {PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Type">
                <select className="game-input" value={form.type} onChange={e=>setForm((p:any)=>({...p,type:e.target.value}))}>
                  {STREAM_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Game">
                <select className="game-input" value={form.game} onChange={e=>setForm((p:any)=>({...p,game:e.target.value}))}>
                  {GAMES.map(g=><option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className="game-input" value={form.is_live?"live":"offline"} onChange={e=>setForm((p:any)=>({...p,is_live:e.target.value==="live"}))}>
                  <option value="offline">Offline / VOD</option>
                  <option value="live">🔴 LIVE NOW</option>
                </select>
              </Field>
            </div>
            <div style={{ display:"flex", gap:"0.75rem", marginTop:"0.5rem" }}>
              <button className="btn-primary" style={{ flex:1, opacity:saving?0.7:1 }} onClick={save} disabled={saving}>{saving?"Saving...":form.id?"Update":"Add Stream"}</button>
              <button onClick={()=>setForm(null)} style={{ background:"none", border:"1px solid #1a2840", color:"#8a9bb5", padding:"0.6rem 1rem", cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMMUNITY (POSTS) TAB
═══════════════════════════════════════════ */
function PostsTab() {
  const [posts, setPosts]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [newPost, setNewPost]   = useState({ content:"", game:"General" });
  const [posting, setPosting]   = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/posts");
    const d = await r.json();
    setPosts(Array.isArray(d)?d:[]);
    setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const update = async (id:string, patch:any) => {
    const r = await fetch(`/api/admin/posts/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(patch)});
    if(r.ok){toast.success("Updated");load();}else toast.error("Failed");
  };
  const del = async (id:string) => {
    if(!confirm("Delete this post permanently?"))return;
    const r = await fetch(`/api/admin/posts/${id}`,{method:"DELETE"});
    if(r.ok){toast.success("Deleted");load();}else toast.error("Failed");
  };
  const createPost = async () => {
    if(!newPost.content.trim()){toast.error("Write something first");return;}
    setPosting(true);
    const r = await fetch("/api/admin/posts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(newPost)});
    const d = await r.json();
    setPosting(false);
    if(d.error){toast.error(d.error);return;}
    toast.success("Post published as KG254 ✅");
    setNewPost({content:"",game:"General"});
    load();
  };

  const filtered = filter==="all"?posts:posts.filter(p=>p.post_status===filter);
  const flaggedCount = posts.filter(p=>p.post_status==="flagged").length;

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem", flexWrap:"wrap", gap:"0.75rem" }}>
        <h2 style={{ fontFamily:"Orbitron,monospace", fontSize:"1rem", color:"#00ff88" }}>Community Posts ({posts.length})</h2>
        <Btn onClick={load} color="#8a9bb5"><RefreshCw size={14}/></Btn>
      </div>

      {/* Admin post composer */}
      <div className="game-card" style={{ padding:"1.25rem", marginBottom:"1.25rem", borderColor:"rgba(0,255,136,0.2)" }}>
        <div style={{ fontFamily:"Orbitron,monospace", fontSize:"0.75rem", color:"#00ff88", marginBottom:"0.75rem" }}>POST AS PTK AFRICA</div>
        <textarea className="game-input" rows={3} placeholder="Post an announcement, news, tournament update..." value={newPost.content} onChange={e=>setNewPost(p=>({...p,content:e.target.value}))} style={{ resize:"vertical", marginBottom:"0.6rem" }}/>
        <div style={{ display:"flex", gap:"0.6rem", alignItems:"center", flexWrap:"wrap" }}>
          <select className="game-input" style={{ width:"auto", flex:1 }} value={newPost.game} onChange={e=>setNewPost(p=>({...p,game:e.target.value}))}>
            {["General","eFootball Mobile","eFootball Console","PUBG Mobile","PUBG PC"].map(g=><option key={g} value={g}>{g}</option>)}
          </select>
          <button className="btn-primary" style={{ padding:"0.55rem 1.2rem", opacity:posting?0.7:1 }} onClick={createPost} disabled={posting}>
            <Send size={13} style={{ display:"inline", marginRight:5 }}/>{posting?"Posting...":"Post"}
          </button>
        </div>
      </div>

      {flaggedCount>0&&(
        <div style={{ background:"rgba(255,107,0,0.08)", border:"1px solid rgba(255,107,0,0.3)", padding:"0.75rem 1rem", marginBottom:"1rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <AlertTriangle size={16} color="#ff6b00"/>
          <span style={{ color:"#ff6b00", fontFamily:"Rajdhani,sans-serif", fontWeight:600 }}>{flaggedCount} flagged post{flaggedCount!==1?"s":""} need review</span>
          <button onClick={()=>setFilter("flagged")} style={{ background:"none", border:"1px solid #ff6b00", color:"#ff6b00", padding:"0.2rem 0.6rem", cursor:"pointer", fontFamily:"Orbitron,monospace", fontSize:"0.68rem", marginLeft:"auto" }}>Review</button>
        </div>
      )}

      <div style={{ display:"flex", gap:"0.4rem", marginBottom:"1rem", flexWrap:"wrap" }}>
        {["all","published","flagged","deleted"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{ background:filter===f?"#00ff88":"transparent", color:filter===f?"#040810":"#8a9bb5",
              border:"1px solid", borderColor:filter===f?"#00ff88":"#1a2840",
              fontFamily:"Rajdhani,sans-serif", fontWeight:600, padding:"0.3rem 0.75rem",
              cursor:"pointer", fontSize:"0.85rem", transition:"all 0.2s" }}>{f}</button>
        ))}
      </div>

      {loading ? <div style={{ color:"#8a9bb5" }}>Loading...</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
          {filtered.map(p=>(
            <div key={p.id} className="game-card" style={{ padding:"1rem", borderColor:p.post_status==="flagged"?"rgba(255,107,0,0.4)":"#1a2840" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.5rem", marginBottom:"0.5rem" }}>
                <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", alignItems:"center" }}>
                  <span style={{ fontFamily:"Rajdhani,sans-serif", fontWeight:700, color:"#00d4ff", fontSize:"0.9rem" }}>{p.username||"Unknown"}</span>
                  <Badge v={p.post_status}/>
                  <span className="badge-cyan" style={{ fontSize:"0.62rem" }}>{p.game}</span>
                  <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.68rem", color:"#8a9bb5" }}>❤️ {p.likes} · 💬 {p.comments}</span>
                </div>
                <div style={{ display:"flex", gap:"0.35rem" }}>
                  {p.post_status==="flagged"&&<Btn onClick={()=>update(p.id,{post_status:"published"})} color="#00ff88" style={{ fontSize:"0.7rem" }}>Approve</Btn>}
                  {p.post_status==="published"&&<Btn onClick={()=>update(p.id,{post_status:"flagged"})} color="#ff6b00" style={{ fontSize:"0.7rem" }}>Flag</Btn>}
                  {p.post_status!=="deleted"&&<Btn onClick={()=>update(p.id,{post_status:"deleted"})} color="#8a9bb5" style={{ fontSize:"0.7rem" }}>Hide</Btn>}
                  {p.post_status==="deleted"&&<Btn onClick={()=>update(p.id,{post_status:"published"})} color="#00ff88" style={{ fontSize:"0.7rem" }}>Restore</Btn>}
                  <Btn onClick={()=>del(p.id)} color="#ff2244"><Trash2 size={13}/></Btn>
                  <Btn onClick={()=>setExpanded(expanded===p.id?null:p.id)} color="#8a9bb5">{expanded===p.id?<ChevronUp size={13}/>:<ChevronDown size={13}/>}</Btn>
                </div>
              </div>
              <p style={{ color:"#c8d8e8", fontSize:"0.88rem", lineHeight:1.55 }}>
                {expanded===p.id ? p.content : (p.content?.length>140 ? p.content.slice(0,140)+"..." : p.content)}
              </p>
              <div style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.68rem", color:"#8a9bb5", marginTop:"0.4rem" }}>
                {new Date(p.created_at).toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
              </div>
            </div>
          ))}
          {filtered.length===0&&<div style={{ textAlign:"center", padding:"2rem", color:"#8a9bb5" }}>No posts in this filter</div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIVE CHAT TAB
═══════════════════════════════════════════ */
function ChatTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [channel, setChannel]   = useState("general");
  const [broadcast, setBroadcast] = useState("");
  const [sending, setSending]   = useState(false);

  const CHANNELS = ["general","tournaments","efootball","pubg","mods-only"];

  const load = async () => {
    setLoading(true);
    const r = await fetch(`/api/chat/history?channel=${channel}`);
    const d = await r.json();
    setMessages(Array.isArray(d)?d:[]);
    setLoading(false);
  };
  useEffect(()=>{load();},[channel]);

  const deleteMsg = async (id:string) => {
    const r = await fetch(`/api/admin/chat/${id}`,{method:"DELETE"});
    if(r.ok){toast.success("Message deleted");setMessages(p=>p.filter(m=>m.id!==id));}else toast.error("Failed");
  };
  const sendBroadcast = async () => {
    if(!broadcast.trim())return;
    setSending(true);
    const r = await fetch("/api/chat/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({channel,message:broadcast.trim()})});
    const d = await r.json();
    setSending(false);
    if(d.error){toast.error(d.error);return;}
    toast.success("Message sent to #"+channel);
    setBroadcast("");
    load();
  };

  const ROLE_COLORS: Record<string,string> = { admin:"#00ff88",subscriber:"#9147ff",member:"#00d4ff",guest:"#8a9bb5" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem", flexWrap:"wrap", gap:"0.75rem" }}>
        <h2 style={{ fontFamily:"Orbitron,monospace", fontSize:"1rem", color:"#00ff88" }}>Live Chat Management</h2>
        <Btn onClick={load} color="#8a9bb5"><RefreshCw size={14}/></Btn>
      </div>

      {/* Channel selector */}
      <div style={{ display:"flex", gap:"0.4rem", marginBottom:"1rem", flexWrap:"wrap" }}>
        {CHANNELS.map(ch=>(
          <button key={ch} onClick={()=>setChannel(ch)}
            style={{ background:channel===ch?"#00ff88":"transparent", color:channel===ch?"#040810":"#8a9bb5",
              border:"1px solid", borderColor:channel===ch?"#00ff88":"#1a2840",
              fontFamily:"Rajdhani,sans-serif", fontWeight:600, padding:"0.3rem 0.75rem",
              cursor:"pointer", fontSize:"0.85rem" }}>#{ch}</button>
        ))}
      </div>

      {/* Admin broadcast */}
      <div className="game-card" style={{ padding:"1rem", marginBottom:"1rem", borderColor:"rgba(0,255,136,0.2)" }}>
        <div style={{ fontFamily:"Orbitron,monospace", fontSize:"0.72rem", color:"#00ff88", marginBottom:"0.6rem" }}>SEND MESSAGE AS PTK AFRICA → #{channel}</div>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <input className="game-input" style={{ flex:1 }} placeholder={`Message #${channel}...`} value={broadcast} onChange={e=>setBroadcast(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendBroadcast()}/>
          <button className="btn-primary" style={{ padding:"0.6rem 1rem", opacity:sending?0.7:1 }} onClick={sendBroadcast} disabled={sending}>
            <Send size={15}/>
          </button>
        </div>
      </div>

      {loading ? <div style={{ color:"#8a9bb5" }}>Loading messages...</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem" }}>
          <div style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.68rem", color:"#8a9bb5", marginBottom:"0.4rem" }}>
            Showing last {messages.length} messages in #{channel} — you can delete any message
          </div>
          {messages.slice().reverse().map(m=>(
            <div key={m.id} style={{ display:"flex", alignItems:"flex-start", gap:"0.6rem", padding:"0.55rem 0.6rem", borderBottom:"1px solid #0d1826" }}
              onMouseEnter={e=>(e.currentTarget.style.background="#080f1a")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:`${ROLE_COLORS[m.role]||"#8a9bb5"}15`, border:`1px solid ${ROLE_COLORS[m.role]||"#8a9bb5"}40`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"Orbitron,monospace", fontWeight:900, fontSize:"0.65rem", color:ROLE_COLORS[m.role]||"#8a9bb5" }}>
                {(m.avatar||m.username?.[0]||"?").slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:2, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"Rajdhani,sans-serif", fontWeight:700, fontSize:"0.85rem", color:ROLE_COLORS[m.role]||"#8a9bb5" }}>{m.username}</span>
                  <span style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.62rem", color:"#8a9bb5" }}>{new Date(m.created_at).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</span>
                </div>
                <div style={{ color:"#c8d8e8", fontSize:"0.88rem", lineHeight:1.45, wordBreak:"break-word" }}>{m.message}</div>
              </div>
              <Btn onClick={()=>deleteMsg(m.id)} color="#ff2244" title="Delete message"><Trash2 size={13}/></Btn>
            </div>
          ))}
          {messages.length===0&&<div style={{ textAlign:"center", padding:"2rem", color:"#8a9bb5" }}>No messages in #{channel}</div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN ADMIN PAGE
═══════════════════════════════════════════ */
export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab]             = useState<Tab>("overview");
  const [adminAuthed, setAuthed]  = useState(false);
  const [stats, setStats]         = useState<any>(null);
  const [sidebarOpen, setSidebar] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) { router.push("/"); return; }
    if (user?.role === "admin") {
      fetch("/api/admin/stats").then(r=>r.json()).then(setStats).catch(()=>{});
    }
  }, [user, authLoading]);

  if (authLoading) return <div style={{ paddingTop:120, textAlign:"center", color:"#8a9bb5", fontFamily:"Share Tech Mono,monospace" }}>Loading...</div>;
  if (!user || user.role !== "admin") return null;
  if (!adminAuthed) return <AdminLogin onLogin={()=>setAuthed(true)}/>;

  const pendingCount = stats?.pendingSubs || 0;
  const flaggedCount = stats?.flaggedPosts || 0;

  return (
    <div style={{ paddingTop:64, minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ background:"#080f1a", padding:"1.25rem 1.5rem", borderBottom:"1px solid #1a2840", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"0.75rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <Shield size={20} color="#00ff88"/>
          <div>
            <div style={{ fontFamily:"Orbitron,monospace", fontWeight:900, fontSize:"1.2rem", color:"#00ff88" }}>Admin Panel</div>
            <div style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"0.68rem", color:"#8a9bb5" }}>PTK Africa · Full Control Dashboard</div>
          </div>
        </div>
        {(pendingCount>0||flaggedCount>0)&&(
          <div style={{ display:"flex", gap:"0.5rem" }}>
            {pendingCount>0&&<div style={{ background:"rgba(255,107,0,0.1)", border:"1px solid rgba(255,107,0,0.3)", padding:"0.3rem 0.75rem", display:"flex", alignItems:"center", gap:5, fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", color:"#ff6b00" }}><AlertTriangle size={13}/>{pendingCount} pending sub{pendingCount!==1?"s":""}</div>}
            {flaggedCount>0&&<div style={{ background:"rgba(255,34,68,0.1)", border:"1px solid rgba(255,34,68,0.3)", padding:"0.3rem 0.75rem", display:"flex", alignItems:"center", gap:5, fontFamily:"Share Tech Mono,monospace", fontSize:"0.72rem", color:"#ff2244" }}><AlertTriangle size={13}/>{flaggedCount} flagged post{flaggedCount!==1?"s":""}</div>}
          </div>
        )}
      </div>

      <div style={{ display:"flex", maxWidth:1400, margin:"0 auto" }}>
        {/* Sidebar */}
        <div style={{ width:210, background:"#080f1a", borderRight:"1px solid #1a2840", minHeight:"calc(100vh - 120px)", padding:"0.75rem 0", flexShrink:0 }} className="admin-sidebar">
          {TABS.map(({ id, label, Icon })=>{
            const badge = (id==="subscriptions"&&pendingCount>0) ? pendingCount : (id==="posts"&&flaggedCount>0) ? flaggedCount : 0;
            return (
              <button key={id} onClick={()=>setTab(id)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"0.7rem 1rem", background:tab===id?"rgba(0,255,136,0.08)":"none", border:"none", color:tab===id?"#00ff88":"#8a9bb5", cursor:"pointer", fontFamily:"Rajdhani,sans-serif", fontWeight:600, fontSize:"0.95rem", borderLeft:tab===id?"2px solid #00ff88":"2px solid transparent", transition:"all 0.15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
                  <Icon size={15}/> {label}
                </div>
                {badge>0&&<span style={{ background:"#ff2244", color:"#fff", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontFamily:"Orbitron,monospace", fontWeight:900 }}>{badge>9?"9+":badge}</span>}
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex:1, padding:"1.75rem 1.5rem", minWidth:0, overflowX:"hidden" }}>

          {/* OVERVIEW */}
          {tab==="overview"&&(
            <div>
              <h2 style={{ fontFamily:"Orbitron,monospace", fontSize:"1rem", color:"#00ff88", marginBottom:"1.25rem" }}>Overview</h2>
              {stats ? (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:"0.75rem", marginBottom:"1.5rem" }}>
                    <StatCard label="Total Users"    value={stats.totalUsers||0}        color="#00ff88"/>
                    <StatCard label="Active Subs"    value={stats.activeSubscribers||0} color="#9147ff"/>
                    <StatCard label="Pending Subs"   value={stats.pendingSubs||0}        color="#ff6b00"/>
                    <StatCard label="Total Posts"    value={stats.totalPosts||0}         color="#00d4ff"/>
                    <StatCard label="Flagged Posts"  value={stats.flaggedPosts||0}       color="#ff2244"/>
                    <StatCard label="Tournaments"    value={stats.totalTournaments||0}   color="#ff6b00"/>
                    <StatCard label="Live Now"       value={stats.liveTournaments||0}    color="#ff2244"/>
                    <StatCard label="Events"         value={stats.totalEvents||0}        color="#00d4ff"/>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"0.75rem" }}>
                    {[
                      { label:"Manage Users",         tab:"users"         as Tab, color:"#00ff88" },
                      { label:"Subscriptions",        tab:"subscriptions" as Tab, color:"#9147ff", badge:pendingCount },
                      { label:"Tournaments",          tab:"tournaments"   as Tab, color:"#ff6b00" },
                      { label:"Events",               tab:"events"        as Tab, color:"#00d4ff" },
                      { label:"Streams & VODs",       tab:"streams"       as Tab, color:"#ff2244" },
                      { label:"Community Posts",      tab:"posts"         as Tab, color:"#00d4ff", badge:flaggedCount },
                      { label:"Live Chat",            tab:"chat"          as Tab, color:"#00ff88" },
                    ].map(({ label, tab: t, color, badge })=>(
                      <button key={t} onClick={()=>setTab(t)}
                        style={{ background:`${color}08`, border:`1px solid ${color}30`, color, padding:"0.9rem 1rem", cursor:"pointer", fontFamily:"Orbitron,monospace", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.05em", transition:"all 0.2s", textAlign:"left", display:"flex", alignItems:"center", justifyContent:"space-between" }}
                        onMouseEnter={e=>((e.currentTarget as HTMLElement).style.background=`${color}15`)}
                        onMouseLeave={e=>((e.currentTarget as HTMLElement).style.background=`${color}08`)}>
                        {label}
                        {badge&&badge>0?<span style={{ background:"#ff2244", color:"#fff", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.68rem" }}>{badge}</span>:<span>→</span>}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ color:"#8a9bb5", fontFamily:"Share Tech Mono,monospace" }}>Loading stats...</div>
              )}
            </div>
          )}

          {tab==="users"         && <UsersTab/>}
          {tab==="subscriptions" && <SubsTab/>}
          {tab==="tournaments"   && <TournamentsTab/>}
          {tab==="events"        && <EventsTab/>}
          {tab==="streams"       && <StreamsTab/>}
          {tab==="posts"         && <PostsTab/>}
          {tab==="chat"          && <ChatTab/>}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { width: 60px !important; }
          .admin-sidebar button span:not(:first-child) { display: none; }
        }
      `}</style>
    </div>
  );
}
