"use client";
import { useState } from "react";
import { Play, ExternalLink, Eye, Clock, Calendar } from "lucide-react";
import Link from "next/link";

const STREAMS = [
  { id: 1, title: "eFootball World Class vs Legendary AI", game: "eFootball Mobile", platform: "YouTube", views: "4.2K", duration: "2h 14m", date: "May 30, 2025", live: false },
  { id: 2, title: "PUBG Duo Ranked Grind — Diamond Push", game: "PUBG Mobile", platform: "Twitch", views: "1.8K", duration: "3h 02m", date: "May 28, 2025", live: false },
  { id: 3, title: "KG254 Weekly Clash #12 — Tournament Stream", game: "eFootball Console", platform: "YouTube", views: "6.1K", duration: "4h 30m", date: "Jun 8, 2025", live: true },
  { id: 4, title: "PUBG TDM & Classic — Road to Conqueror", game: "PUBG Mobile", platform: "TikTok", views: "22K", duration: "1h 45m", date: "May 25, 2025", live: false },
  { id: 5, title: "eFootball Pro Tips & Skill Moves Tutorial", game: "eFootball Mobile", platform: "YouTube", views: "8.3K", duration: "45m", date: "May 20, 2025", live: false },
  { id: 6, title: "PUBG Erangel Solo vs Squad Highlights", game: "PUBG PC", platform: "Twitch", views: "2.5K", duration: "2h 10m", date: "May 18, 2025", live: false },
];
const PLATFORM_COLORS: Record<string, string> = { YouTube: "#ff2244", Twitch: "#9147ff", TikTok: "#00d4ff" };
const GAME_BG: Record<string, string> = {
  "eFootball Mobile":  "linear-gradient(135deg,#0a1a0d,#0d2010)",
  "eFootball Console": "linear-gradient(135deg,#0a1a0d,#0d2010)",
  "PUBG Mobile":       "linear-gradient(135deg,#0a0d1a,#10122a)",
  "PUBG PC":           "linear-gradient(135deg,#0a0d1a,#10122a)",
};

export default function StreamsPage() {
  const [filter, setFilter] = useState("All");
  const games = ["All", "eFootball Mobile", "eFootball Console", "PUBG Mobile", "PUBG PC"];
  const filtered = filter === "All" ? STREAMS : STREAMS.filter(s => s.game === filter);

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// PTK 254 STREAMS</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Watch & Replay</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1.05rem", maxWidth: 600, marginBottom: "2rem" }}>Catch PTK Africa live or replay past sessions.</p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { label: "Twitch", href: "https://twitch.tv/PTK Africa", color: "#9147ff" },
              { label: "YouTube", href: "https://youtube.com/@PTK Africa", color: "#ff2244" },
              { label: "TikTok", href: "https://tiktok.com/@PTK Africa", color: "#00d4ff" },
            ].map(({ label, href, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${color}12`, border: `1px solid ${color}40`, color, padding: "0.55rem 1.2rem", textDecoration: "none", fontFamily: "Orbitron,monospace", fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.08em", transition: "background 0.2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `${color}22`)}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = `${color}12`)}>
                {label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ background: "#040810", borderBottom: "1px solid #1a2840", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {games.map(g => (
            <button key={g} onClick={() => setFilter(g)}
              style={{ background: filter === g ? "#00ff88" : "transparent", color: filter === g ? "#040810" : "#8a9bb5", border: "1px solid", borderColor: filter === g ? "#00ff88" : "#1a2840", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.9rem", padding: "0.4rem 1rem", cursor: "pointer", transition: "all 0.2s" }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Live embed area */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "Share Tech Mono,monospace", color: "#00ff88", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "1rem" }}>// LIVE NOW — WEEKLY CLASH #12</div>
          <div className="game-card" style={{ overflow: "hidden" }}>
            {/* To embed real stream: replace this div with <iframe src="https://player.twitch.tv/?channel=PTK Africa&parent=yourdomain.com" ... /> */}
            <div style={{ aspectRatio: "16/9", maxHeight: 500, background: "linear-gradient(135deg,#0d1826,#040810)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }} className="pulse-green float">
                  <Play size={36} color="#00ff88" style={{ marginLeft: 5 }} />
                </div>
                <div style={{ fontFamily: "Orbitron,monospace", fontSize: "1rem", color: "#00ff88", marginBottom: 8 }}>KG254 Weekly Clash #12</div>
                <div style={{ color: "#8a9bb5", fontSize: "0.85rem", marginBottom: "1.5rem", maxWidth: 400 }}>
                  Stream is live on Twitch. Click below to watch. (To embed, add your Twitch iframe after deployment.)
                </div>
                <a href="https://twitch.tv/PTK Africa" target="_blank" rel="noopener noreferrer" className="btn-primary">Watch on Twitch</a>
              </div>
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,34,68,0.15)", border: "1px solid rgba(255,34,68,0.4)", padding: "4px 10px" }}>
                <span className="live-dot" />
                <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.7rem", color: "#ff2244" }}>LIVE · 3,241 viewers</span>
              </div>
            </div>
          </div>
        </div>

        {/* VOD grid */}
        <div style={{ fontFamily: "Share Tech Mono,monospace", color: "#00ff88", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>// VODs & PAST STREAMS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {filtered.map(stream => (
            <div key={stream.id} className="game-card" style={{ overflow: "hidden", cursor: "pointer" }}>
              <div style={{ aspectRatio: "16/9", background: GAME_BG[stream.game] || "linear-gradient(135deg,#0d1826,#040810)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <Play size={32} color={stream.live ? "#ff2244" : "#00ff88"} style={{ opacity: 0.8 }} />
                {stream.live && (
                  <div style={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,34,68,0.2)", border: "1px solid #ff2244", padding: "3px 8px" }}>
                    <span className="live-dot" style={{ width: 6, height: 6 }} />
                    <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", color: "#ff2244" }}>LIVE</span>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.75)", padding: "2px 7px", fontFamily: "Share Tech Mono,monospace", fontSize: "0.7rem", color: "#e8f4ff" }}>{stream.duration}</div>
                <div style={{ position: "absolute", top: 8, right: 8 }}>
                  <span style={{ background: `${PLATFORM_COLORS[stream.platform] || "#8a9bb5"}18`, border: `1px solid ${PLATFORM_COLORS[stream.platform] || "#8a9bb5"}50`, color: PLATFORM_COLORS[stream.platform] || "#8a9bb5", fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", padding: "2px 6px" }}>{stream.platform}</span>
                </div>
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ marginBottom: 5 }}><span className="badge-cyan" style={{ fontSize: "0.62rem" }}>{stream.game}</span></div>
                <div style={{ fontFamily: "Orbitron,monospace", fontSize: "0.82rem", color: "#e8f4ff", marginBottom: "0.5rem", lineHeight: 1.35 }}>{stream.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#8a9bb5", fontSize: "0.82rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} /> {stream.views}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {stream.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
