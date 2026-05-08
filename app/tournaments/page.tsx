"use client";
import { useState, useEffect } from "react";
import { Trophy, Users, Calendar, ChevronDown, ChevronUp, CheckCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

type Tournament = { id: string; title: string; game: string; date: string; prize: string; spots: number; registered_count: number; format: string; status: string; description: string; };

const STATUS_STYLES: Record<string, { label: string; color: string; badgeClass: string }> = {
  live:     { label: "🔴 LIVE",    color: "#ff2244", badgeClass: "badge-red" },
  open:     { label: "OPEN",       color: "#00ff88", badgeClass: "badge-green" },
  upcoming: { label: "SOON",       color: "#00d4ff", badgeClass: "badge-cyan" },
  ended:    { label: "ENDED",      color: "#8a9bb5", badgeClass: "badge-cyan" },
};

function TournamentCard({ t, userId }: { t: Tournament; userId?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const pct = Math.min((t.registered_count / t.spots) * 100, 100);
  const st = STATUS_STYLES[t.status] || STATUS_STYLES.upcoming;
  const isFull = t.registered_count >= t.spots;

  const handleRegister = async () => {
    if (!userId) return toast.error("Login to register for tournaments");
    setRegistering(true);
    try {
      const res = await fetch(`/api/tournaments/${t.id}/register`, { method: "POST" });
      const data = await res.json();
      if (data.error) return toast.error(data.error);
      toast.success(data.message || "Registered!");
      setRegistered(true);
    } finally { setRegistering(false); }
  };

  return (
    <div className="game-card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className={st.badgeClass}>{st.label}</span>
          <span className="badge-orange">{t.game}</span>
        </div>
        <span style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.1rem", color: "#ff6b00" }}>{t.prize}</span>
      </div>

      <h3 style={{ fontFamily: "Orbitron,monospace", fontSize: "1.05rem", color: "#e8f4ff", marginBottom: "1rem", lineHeight: 1.3 }}>{t.title}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "1rem" }}>
        {[
          { icon: "📅", text: new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
          { icon: "🏆", text: t.format },
          { icon: "👥", text: `${t.registered_count}/${t.spots} players` },
          { icon: "💰", text: t.prize },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#8a9bb5", fontSize: "0.85rem" }}>
            <span>{icon}</span> {text}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#8a9bb5", marginBottom: 3 }}>
          <span>Spots filled</span>
          <span style={{ color: isFull ? "#ff2244" : "#00ff88" }}>{t.registered_count}/{t.spots}</span>
        </div>
        <div style={{ height: 4, background: "#1a2840", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: isFull ? "#ff2244" : "linear-gradient(90deg,#00ff88,#00d4ff)", borderRadius: 2, transition: "width 0.6s ease" }} />
        </div>
      </div>

      {expanded && t.description && (
        <p style={{ color: "#8a9bb5", fontSize: "0.88rem", lineHeight: 1.6, borderTop: "1px solid #1a2840", paddingTop: "1rem", marginBottom: "1rem" }}>{t.description}</p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        {t.status === "live" ? (
          <a href="https://twitch.tv/PTK Africa" target="_blank" rel="noopener noreferrer" className="btn-danger" style={{ padding: "0.45rem 1.1rem", fontSize: "0.7rem" }}>Watch Live</a>
        ) : t.status === "ended" ? (
          <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#8a9bb5" }}>Tournament ended</span>
        ) : isFull && !registered ? (
          <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#ff2244" }}>FULL — Waitlist coming soon</span>
        ) : registered ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#00ff88", fontFamily: "Share Tech Mono,monospace", fontSize: "0.8rem" }}>
            <CheckCircle size={15} /> You're registered!
          </div>
        ) : !userId ? (
          <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 6, color: "#00ff88", fontFamily: "Orbitron,monospace", fontSize: "0.72rem", textDecoration: "none", border: "1px solid #00ff88", padding: "0.45rem 1rem" }}>
            <LogIn size={12} /> Login to Register
          </Link>
        ) : (
          <button className="btn-primary" style={{ padding: "0.45rem 1.1rem", fontSize: "0.7rem", opacity: registering ? 0.7 : 1 }} onClick={handleRegister} disabled={registering}>
            {registering ? "Registering..." : "Register Now"}
          </button>
        )}
        <button onClick={() => setExpanded(p => !p)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#8a9bb5", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontSize: "0.85rem" }}>
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />} Details
        </button>
      </div>
    </div>
  );
}

export default function TournamentsPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const tabs = ["All", "Open", "Live", "Upcoming", "Ended"];

  useEffect(() => {
    fetch("/api/tournaments")
      .then(r => r.json())
      .then(d => { setTournaments(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = tab === "All" ? tournaments : tournaments.filter(t => t.status.toLowerCase() === tab.toLowerCase());
  const liveCount = tournaments.filter(t => t.status === "live").length;
  const openCount = tournaments.filter(t => t.status === "open").length;
  const totalPrize = tournaments.reduce((sum, t) => {
    const m = t.prize?.match(/[\d,]+/);
    return sum + (m ? parseInt(m[0].replace(/,/g, "")) : 0);
  }, 0);

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// PTK 254</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Tournaments</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1.05rem", maxWidth: 600, marginBottom: "2rem" }}>
            Compete in official PTK Africa tournaments. Win cash prizes, get featured on stream, and earn community glory.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", maxWidth: 560 }}>
            {[
              { v: tournaments.length, l: "Total Tournaments" },
              { v: liveCount, l: "Live Now", c: liveCount > 0 ? "#ff2244" : undefined },
              { v: openCount, l: "Open for Entry", c: "#00ff88" },
              { v: `KSh ${totalPrize.toLocaleString()}`, l: "Total Prize Pool", c: "#ff6b00" },
            ].map(({ v, l, c }) => (
              <div key={l} className="game-card" style={{ padding: "1rem", textAlign: "center" }}>
                <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.4rem", color: c || "#00ff88" }}>{v}</div>
                <div style={{ fontSize: "0.78rem", color: "#8a9bb5", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#040810", borderBottom: "1px solid #1a2840", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background: tab === t ? "#00ff88" : "transparent", color: tab === t ? "#040810" : "#8a9bb5", border: "1px solid", borderColor: tab === t ? "#00ff88" : "#1a2840", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, padding: "0.4rem 1rem", cursor: "pointer", transition: "all 0.2s", fontSize: "0.95rem" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8a9bb5", fontFamily: "Share Tech Mono,monospace" }}>Loading tournaments...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {filtered.map(t => <TournamentCard key={t.id} t={t} userId={user?.id} />)}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#8a9bb5" }}>
                <Trophy size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                <div style={{ fontFamily: "Orbitron,monospace", fontSize: "0.9rem" }}>No tournaments in this category</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
