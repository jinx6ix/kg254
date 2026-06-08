"use client";
import HeroCarousel from "@/components/HeroCarousel";
import YouTubeGrid from "@/components/YouTubeGrid";
import Link from "next/link";
import { Video, Zap, Trophy, Users, ChevronRight, MessageSquare } from "lucide-react";

const STATS = [
  { label: "Subscribers", value: "12K+", icon: Users },
  { label: "Tournaments", value: "48", icon: Trophy },
  { label: "Videos", value: "200+", icon: Video },
  { label: "Community Members", value: "8K+", icon: Users },
];

export default function HomePage() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* HERO CAROUSEL */}
      <HeroCarousel />

      {/* STATS */}
      <section style={{ background: "#080f1a", borderTop: "1px solid #1a2840", borderBottom: "1px solid #1a2840", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <Icon size={24} color="#00ff88" style={{ margin: "0 auto 0.5rem" }} />
                <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "2rem", color: "#00ff88" }}>{value}</div>
                <div style={{ fontSize: "0.9rem", color: "#8a9bb5" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUTUBE VIDEOS */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#ff2244", marginBottom: 6, letterSpacing: "0.15em" }}>// LATEST CONTENT</div>
              <h2 className="section-title">YouTube Videos</h2>
            </div>
            <a href="https://youtube.com/@PTKAfrica" target="_blank" rel="noopener noreferrer"
              className="btn-secondary" style={{ padding: "0.5rem 1.2rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              View Channel <ChevronRight size={14} />
            </a>
          </div>
          <YouTubeGrid />
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