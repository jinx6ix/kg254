"use client";
import { useState } from "react";
import { Play, Video, Radio, ExternalLink, Eye, Clock, Calendar } from "lucide-react";

const STREAMS = [
  { id: 1, title: "eFootball World Class vs Legendary AI", game: "eFootball Mobile", platform: "YouTube", views: "4.2K", duration: "2h 14m", date: "May 30, 2025", thumb: "efootball", live: false },
  { id: 2, title: "PUBG Duo Ranked Grind — Diamond Push", game: "PUBG Mobile", platform: "Twitch", views: "1.8K", duration: "3h 02m", date: "May 28, 2025", thumb: "pubg", live: false },
  { id: 3, title: "KG254 Weekly Clash #12 — Tournament Stream", game: "eFootball Console", platform: "YouTube", views: "6.1K", duration: "4h 30m", date: "Jun 8, 2025", thumb: "efootball", live: true },
  { id: 4, title: "PUBG TDM & Classic — Road to Conqueror", game: "PUBG Mobile", platform: "TikTok", views: "22K", duration: "1h 45m", date: "May 25, 2025", thumb: "pubg", live: false },
  { id: 5, title: "eFootball Pro Tips & Skill Moves Tutorial", game: "eFootball Mobile", platform: "YouTube", views: "8.3K", duration: "45m", date: "May 20, 2025", thumb: "efootball", live: false },
  { id: 6, title: "PUBG Erangel Solo vs Squad Highlights", game: "PUBG PC", platform: "Twitch", views: "2.5K", duration: "2h 10m", date: "May 18, 2025", thumb: "pubg", live: false },
];

const PLATFORM_COLORS: Record<string, string> = { YouTube: "#ff2244", Twitch: "#9147ff", TikTok: "#00d4ff" };

export default function StreamsPage() {
  const [filter, setFilter] = useState("All");
  const games = ["All", "eFootball Mobile", "eFootball Console", "PUBG Mobile", "PUBG PC"];
  const filtered = filter === "All" ? STREAMS : STREAMS.filter(s => s.game === filter);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #080f1a 0%, #040810 100%)", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// K.G 254 STREAMS</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Watch & Replay</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1.1rem", maxWidth: 600 }}>Catch KenyanGamer254 live on Radio, YouTube and TikTok — or replay past sessions.</p>

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
            {[
              { label: "Twitch", href: "https://twitch.tv/KenyanGamer254", Icon: Radio, color: "#9147ff" },
              { label: "YouTube", href: "https://youtube.com/@KenyanGamer254", Icon: Video, color: "#ff2244" },
            ].map(({ label, href, Icon, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${color}15`, border: `1px solid ${color}40`, color, padding: "0.6rem 1.2rem", textDecoration: "none", fontFamily: "Orbitron, monospace", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${color}25`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${color}15`}>
                <Icon size={16} /> {label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ background: "#080f1a", borderBottom: "1px solid #1a2840", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {games.map(g => (
            <button key={g} onClick={() => setFilter(g)}
              style={{ background: filter === g ? "#00ff88" : "transparent", color: filter === g ? "#040810" : "#8a9bb5", border: "1px solid", borderColor: filter === g ? "#00ff88" : "#1a2840", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "0.9rem", padding: "0.4rem 1rem", cursor: "pointer", transition: "all 0.2s" }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Streams grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Live stream embed area */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "Share Tech Mono, monospace", color: "#00ff88", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "1rem" }}>// LIVE NOW</div>
          <div className="game-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #0d1826, #040810)", aspectRatio: "16/9", maxHeight: 480, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }} className="pulse-green float">
                  <Play size={36} color="#00ff88" style={{ marginLeft: 6 }} />
                </div>
                <div style={{ fontFamily: "Orbitron, monospace", fontSize: "1.1rem", color: "#00ff88", marginBottom: 8 }}>KG254 Weekly Clash #12</div>
                <div style={{ color: "#8a9bb5", marginBottom: "1.5rem" }}>Replace iframe src with your Radio or YouTube embed URL</div>
                <a href="https://twitch.tv/KenyanGamer254" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Watch on Twitch
                </a>
              </div>
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,34,68,0.15)", border: "1px solid rgba(255,34,68,0.4)", padding: "4px 10px" }}>
                <span className="live-dot" />
                <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.7rem", color: "#ff2244" }}>LIVE · 3,241 viewers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Past streams */}
        <div style={{ fontFamily: "Share Tech Mono, monospace", color: "#00ff88", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>// PAST STREAMS & VODs</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filtered.map(stream => (
            <div key={stream.id} className="game-card" style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}>
              {/* Thumbnail */}
              <div style={{
                aspectRatio: "16/9",
                background: stream.thumb === "efootball"
                  ? "linear-gradient(135deg, #0a1a0d, #0d2010)"
                  : "linear-gradient(135deg, #0a0d1a, #10122a)",
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
              }}>
                <Play size={32} color={stream.live ? "#ff2244" : "#00ff88"} style={{ opacity: 0.8 }} />
                {stream.live && (
                  <div style={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,34,68,0.2)", border: "1px solid #ff2244", padding: "3px 8px" }}>
                    <span className="live-dot" style={{ width: 6, height: 6 }} />
                    <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.65rem", color: "#ff2244" }}>LIVE</span>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", padding: "2px 6px", fontFamily: "Share Tech Mono, monospace", fontSize: "0.7rem", color: "#e8f4ff" }}>{stream.duration}</div>
                <div style={{ position: "absolute", top: 8, right: 8 }}>
                  <span style={{ background: `${PLATFORM_COLORS[stream.platform]}20`, border: `1px solid ${PLATFORM_COLORS[stream.platform]}60`, color: PLATFORM_COLORS[stream.platform], fontFamily: "Share Tech Mono, monospace", fontSize: "0.65rem", padding: "2px 6px" }}>{stream.platform}</span>
                </div>
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ marginBottom: 4 }}><span className="badge-cyan" style={{ fontSize: "0.65rem" }}>{stream.game}</span></div>
                <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.85rem", color: "#e8f4ff", marginBottom: "0.5rem", lineHeight: 1.3 }}>{stream.title}</div>
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
