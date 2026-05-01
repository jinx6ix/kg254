"use client";
import { useState } from "react";
import { Trophy, Users, Calendar, DollarSign, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

const TOURNAMENTS = [
  { id: 1, title: "eFootball Spring Cup 2025", game: "eFootball Mobile", date: "Jun 15, 2025", prize: "KSh 50,000", spots: 16, filled: 9, format: "1v1 Knockout", status: "open", desc: "Open to all eFootball mobile players. Best-of-3 knockout rounds. Finals streamed live on YouTube." },
  { id: 2, title: "PUBG Nairobi Classic", game: "PUBG Mobile", date: "Jun 22, 2025", prize: "KSh 30,000", spots: 20, filled: 14, format: "Squad (4v4)", status: "open", desc: "Squad tournament. 5 matches on Erangel and Miramar. Top 3 squads win prizes. Must be Gold+ rank." },
  { id: 3, title: "KG254 Weekly Clash #12", game: "eFootball Console", date: "Jun 8, 2025", prize: "KSh 5,000", spots: 8, filled: 8, format: "1v1 Knockout", status: "live", desc: "Weekly console tournament, currently underway. Watch live on Twitch." },
  { id: 4, title: "PUBG Legends Invitational", game: "PUBG PC", date: "Jul 5, 2025", prize: "KSh 100,000", spots: 24, filled: 0, format: "Trio (3v3)", status: "upcoming", desc: "K.G 254's biggest PUBG tournament. Invite-only for top 24 ranked Kenyan players. Full production stream." },
  { id: 5, title: "eFootball Champions League", game: "eFootball Mobile", date: "Jul 20, 2025", prize: "KSh 75,000", spots: 32, filled: 0, format: "League + Knockout", status: "upcoming", desc: "32-player league phase followed by a knockout stage. Season passes available for subscribers." },
];

function TournamentCard({ t }: { t: typeof TOURNAMENTS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const [registered, setRegistered] = useState(false);
  const pct = (t.filled / t.spots) * 100;

  return (
    <div className="game-card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        <div>
          <span className={t.status === "live" ? "badge-red" : t.status === "open" ? "badge-green" : "badge-cyan"} style={{ marginRight: 8 }}>
            {t.status === "live" ? "🔴 LIVE" : t.status === "open" ? "OPEN" : "SOON"}
          </span>
          <span className="badge-orange">{t.game}</span>
        </div>
        <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.1rem", color: "#ff6b00" }}>
          {t.prize}
        </div>
      </div>

      <h3 style={{ fontFamily: "Orbitron, monospace", fontSize: "1.1rem", color: "#e8f4ff", marginBottom: "1rem", lineHeight: 1.3 }}>{t.title}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
        {[
          { Icon: Calendar, text: t.date },
          { Icon: Trophy, text: t.format },
          { Icon: Users, text: `${t.filled}/${t.spots} players` },
          { Icon: DollarSign, text: t.prize },
        ].map(({ Icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#8a9bb5", fontSize: "0.85rem" }}>
            <Icon size={13} color="#00ff88" /> {text}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#8a9bb5", marginBottom: 4 }}>
          <span>Spots filled</span><span style={{ color: pct >= 100 ? "#ff2244" : "#00ff88" }}>{t.filled}/{t.spots}</span>
        </div>
        <div style={{ height: 4, background: "#1a2840", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? "#ff2244" : "linear-gradient(90deg, #00ff88, #00d4ff)", borderRadius: 2, transition: "width 0.5s" }} />
        </div>
      </div>

      {expanded && (
        <p style={{ color: "#8a9bb5", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1rem", borderTop: "1px solid #1a2840", paddingTop: "1rem" }}>{t.desc}</p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        {t.status !== "live" && t.filled < t.spots && !registered && (
          <button onClick={() => setRegistered(true)} className="btn-primary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.72rem" }}>
            Register Now
          </button>
        )}
        {registered && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#00ff88", fontFamily: "Share Tech Mono, monospace", fontSize: "0.8rem" }}>
            <CheckCircle size={16} /> Registered!
          </div>
        )}
        {t.status === "live" && (
          <a href="https://twitch.tv/KenyanGamer254" target="_blank" rel="noopener noreferrer" className="btn-danger" style={{ padding: "0.5rem 1.2rem", fontSize: "0.72rem" }}>
            Watch Live
          </a>
        )}
        {t.filled >= t.spots && t.status !== "live" && (
          <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#ff2244" }}>FULL — Join Waitlist</span>
        )}
        <button onClick={() => setExpanded(!expanded)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#8a9bb5", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "0.85rem" }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />} Details
        </button>
      </div>
    </div>
  );
}

export default function TournamentsPage() {
  const [tab, setTab] = useState("All");
  const tabs = ["All", "Open", "Live", "Upcoming"];
  const filtered = tab === "All" ? TOURNAMENTS : TOURNAMENTS.filter(t => t.status === tab.toLowerCase());

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// K.G 254</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Tournaments</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1.1rem", maxWidth: 600, marginBottom: "2rem" }}>
            Compete in official KenyanGamer254 tournaments. Win cash prizes, get featured on stream, and earn community glory.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", maxWidth: 600 }}>
            {[["5", "Active Tournaments"], ["KSh 260K", "Total Prize Pool"], ["48", "Past Events"]].map(([v, l]) => (
              <div key={l} className="game-card" style={{ padding: "1rem", textAlign: "center" }}>
                <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.5rem", color: "#00ff88" }}>{v}</div>
                <div style={{ fontSize: "0.8rem", color: "#8a9bb5" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#040810", borderBottom: "1px solid #1a2840", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: "0.5rem" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background: tab === t ? "#00ff88" : "transparent", color: tab === t ? "#040810" : "#8a9bb5", border: "1px solid", borderColor: tab === t ? "#00ff88" : "#1a2840", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, padding: "0.4rem 1rem", cursor: "pointer", transition: "all 0.2s", fontSize: "0.95rem" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {filtered.map(t => <TournamentCard key={t.id} t={t} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8a9bb5" }}>
            <Trophy size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
            <div style={{ fontFamily: "Orbitron, monospace" }}>No tournaments in this category</div>
          </div>
        )}
      </div>
    </div>
  );
}
