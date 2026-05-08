"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Radio, AtSign, Camera, Trophy, Zap, Users, Calendar, MessageSquare, Play, ChevronRight, Star } from "lucide-react";

const GAMES = ["eFootball Mobile", "eFootball Console", "PUBG Mobile", "PUBG PC"];
const STATS = [
  { label: "Subscribers", value: "12K+", icon: Users },
  { label: "Tournaments", value: "48", icon: Trophy },
  { label: "Hours Streamed", value: "2,400+", icon: Play },
  { label: "Community Members", value: "8K+", icon: Star },
];
const RECENT_EVENTS = [
  { title: "eFootball Spring Cup 2025", game: "eFootball Mobile", date: "Jun 15, 2025", prize: "KSh 50,000", status: "upcoming", spots: 16 },
  { title: "PUBG Nairobi Classic", game: "PUBG Mobile", date: "Jun 22, 2025", prize: "KSh 30,000", status: "upcoming", spots: 20 },
  { title: "PTK AFRICA Weekly Clash #12", game: "eFootball Console", date: "Jun 8, 2025", prize: "KSh 5,000", status: "live", spots: 8 },
];
const PLATFORMS = [
  { name: "YouTube", sub: "12K subscribers", href: "https://youtube.com/@PTK Africa", Icon: Video, color: "#ff2244" },
  { name: "Twitch", sub: "3.2K followers", href: "https://twitch.tv/PTK Africa", Icon: Radio, color: "#9147ff" },
  { name: "TikTok", sub: "18K followers", href: "https://tiktok.com/@PTK Africa", Icon: Play, color: "#00d4ff" },
  { name: "Twitter/X", sub: "5K followers", href: "https://twitter.com/PTK Africa", Icon: AtSign, color: "#1da1f2" },
];

export default function HomePage() {
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTicker(p => (p + 1) % GAMES.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* HERO */}
      <section style={{ minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }} className="grid-bg">
        {/* Decorative grid lines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "20%", right: "5%", width: 300, height: 300, border: "1px solid rgba(0,255,136,0.06)", borderRadius: "50%", transform: "rotate(45deg)" }} />
          <div style={{ position: "absolute", top: "25%", right: "8%", width: 200, height: 200, border: "1px solid rgba(0,212,255,0.06)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 150, height: 150, border: "1px solid rgba(255,107,0,0.06)" }} />
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 1.5rem", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            {/* Live badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,34,68,0.1)", border: "1px solid rgba(255,34,68,0.3)", padding: "0.3rem 0.8rem", marginBottom: "1.5rem" }}>
              <span className="live-dot" />
              <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#ff2244" }}>LIVE NOW ON TWITCH</span>
            </div>

            <h1 style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1, marginBottom: "0.5rem" }}>
              <span style={{ color: "#e8f4ff" }}>PTK</span><br />
              <span style={{ color: "#00ff88" }} className="glitch">AFRICA</span><br />
              <span style={{ color: "#00d4ff" }}>254</span>
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <span style={{ fontFamily: "Share Tech Mono, monospace", color: "#8a9bb5", fontSize: "0.85rem" }}>NOW PLAYING:</span>
              <span style={{ fontFamily: "Orbitron, monospace", color: "#00ff88", fontSize: "0.85rem", transition: "all 0.5s" }}>{GAMES[ticker]}</span>
            </div>

            <p style={{ color: "#8a9bb5", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 480 }}>
              Kenya's premier gaming community. Watch streams, join tournaments, connect with fellow gamers across eFootball, PUBG, and more.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/tournaments" className="btn-primary">
                <Trophy size={14} style={{ display: "inline", marginRight: 6 }} />
                Join Tournament
              </Link>
              <Link href="/subscribe" className="btn-secondary">
                <Zap size={14} style={{ display: "inline", marginRight: 6 }} />
                Subscribe
              </Link>
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem" }}>
              {[
                { Icon: Video, href: "https://youtube.com", color: "#ff2244" },
                { Icon: Radio, href: "https://twitch.tv", color: "#9147ff" },
                { Icon: AtSign, href: "https://twitter.com", color: "#00d4ff" },
                { Icon: Camera, href: "https://instagram.com", color: "#ff6b00" },
              ].map(({ Icon, href, color }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 40, height: 40, border: "1px solid #1a2840", display: "flex", alignItems: "center", justifyContent: "center", color, transition: "all 0.2s", textDecoration: "none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.background = `${color}20`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1a2840"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Stream preview card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Fake stream card */}
            <div className="game-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg, #0d1826, #040810)", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }} className="pulse-green float">
                    <Play size={28} color="#00ff88" style={{ marginLeft: 4 }} />
                  </div>
                  <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.9rem", color: "#00ff88" }}>STREAM PREVIEW</div>
                  <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#8a9bb5", marginTop: 4 }}>Connect Twitch/YouTube for live embed</div>
                </div>
                <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 6, background: "rgba(255,34,68,0.15)", border: "1px solid rgba(255,34,68,0.4)", padding: "3px 8px" }}>
                  <span className="live-dot" style={{ width: 6, height: 6 }} />
                  <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.65rem", color: "#ff2244" }}>LIVE</span>
                </div>
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <span className="badge-cyan">eFootball</span>
                </div>
              </div>
              <div style={{ padding: "1rem" }}>
                <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.9rem", color: "#e8f4ff", marginBottom: 4 }}>PTK AFRICA Live Session #47</div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#8a9bb5", fontSize: "0.85rem" }}>
                  <span>3,241 viewers</span>
                  <span style={{ color: "#00ff88" }}>🇰🇪 Nairobi, Kenya</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {STATS.map(({ label, value, icon: Icon }) => (
                <div key={label} className="game-card" style={{ padding: "1rem", textAlign: "center" }}>
                  <Icon size={20} color="#00ff88" style={{ margin: "0 auto 0.4rem" }} />
                  <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.3rem", color: "#00ff88" }}>{value}</div>
                  <div style={{ fontSize: "0.8rem", color: "#8a9bb5" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`@media (max-width: 767px) { section > div { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* UPCOMING EVENTS */}
      <section style={{ padding: "5rem 1.5rem", background: "#080f1a" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// UPCOMING</div>
              <h2 className="section-title">Tournaments & Events</h2>
            </div>
            <Link href="/tournaments" className="btn-secondary" style={{ padding: "0.5rem 1.2rem" }}>
              View All <ChevronRight size={14} style={{ display: "inline" }} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {RECENT_EVENTS.map((ev) => (
              <div key={ev.title} className="game-card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span className={ev.status === "live" ? "badge-red" : "badge-green"}>{ev.status === "live" ? "🔴 LIVE" : "UPCOMING"}</span>
                  <span className="badge-orange">{ev.prize}</span>
                </div>
                <h3 style={{ fontFamily: "Orbitron, monospace", fontSize: "1rem", color: "#e8f4ff", marginBottom: "0.5rem", lineHeight: 1.3 }}>{ev.title}</h3>
                <div style={{ color: "#8a9bb5", fontSize: "0.9rem", marginBottom: 4 }}>🎮 {ev.game}</div>
                <div style={{ color: "#8a9bb5", fontSize: "0.9rem", marginBottom: "1rem" }}>📅 {ev.date}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#8a9bb5" }}>{ev.spots} spots left</span>
                  <Link href="/tournaments" className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.7rem" }}>Register</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// FIND ME ON</div>
          <h2 className="section-title" style={{ marginBottom: "2.5rem" }}>Streaming Platforms</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {PLATFORMS.map(({ name, sub, href, Icon, color }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                className="game-card"
                style={{ padding: "2rem", textDecoration: "none", display: "block" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1a2840"; }}>
                <Icon size={36} color={color} style={{ margin: "0 auto 1rem" }} />
                <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: "1rem", color: "#e8f4ff", marginBottom: 4 }}>{name}</div>
                <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.8rem", color }}>{sub}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 1.5rem", background: "#080f1a" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }} className="pulse-green">
            <MessageSquare size={28} color="#00ff88" />
          </div>
          <h2 style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "2rem", color: "#e8f4ff", marginBottom: "1rem" }}>
            Join the <span style={{ color: "#00ff88" }}>Community</span>
          </h2>
          <p style={{ color: "#8a9bb5", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Chat live, compete in tournaments, and stay updated on all PTK 254 events. Over 8,000 gamers already in the squad.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/chat" className="btn-primary">
              <MessageSquare size={14} style={{ display: "inline", marginRight: 6 }} />
              Open Live Chat
            </Link>
            <Link href="/community" className="btn-secondary">
              <Users size={14} style={{ display: "inline", marginRight: 6 }} />
              Community Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
