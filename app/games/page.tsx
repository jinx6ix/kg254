"use client";
import Link from "next/link";
import { Gamepad2, Trophy, Users, Video, ChevronRight } from "lucide-react";
import { useState } from "react";

const GAMES = [
  {
    slug: "efootball-mobile",
    name: "eFootball Mobile",
    color: "#00ff88",
    gradient: "linear-gradient(135deg, #0a1a0d, #0d2010)",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    description: "Mobile football at its finest. Join weekly tournaments and climb the ranks.",
    stats: "2,400+ players · 32 tournaments",
    href: "/games/efootball-mobile",
  },
  {
    slug: "efootball-console",
    name: "eFootball Console",
    color: "#00d4ff",
    gradient: "linear-gradient(135deg, #0a1520, #0d2030)",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop",
    description: "Console football gaming on PlayStation. Elite competitive play every week.",
    stats: "850+ players · 18 tournaments",
    href: "/games/efootball-console",
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    color: "#ff6b00",
    gradient: "linear-gradient(135deg, #1a0d00, #201505)",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop",
    description: "Mobile Battle Royale. Squad up and battle for victory across Erangel and more.",
    stats: "3,100+ players · 24 tournaments",
    href: "/games/pubg-mobile",
  },
  {
    slug: "pubg-pc",
    name: "PUBG PC",
    color: "#9147ff",
    gradient: "linear-gradient(135deg, #0d0a1a, #10102a)",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=600&h=400&fit=crop",
    description: "Full PC Battle Royale experience with custom lobbies and invitationals.",
    stats: "620+ players · 12 tournaments",
    href: "/games/pubg-pc",
  },
];

export default function GamesPage() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// PTK AFRICA</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Games Hub</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1.05rem", maxWidth: 600, marginBottom: "2rem" }}>
            Explore everything PTK Africa has for each game. Tournaments, streams, community and more — tailored per game.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/tournaments" className="btn-primary">
              <Trophy size={14} style={{ display: "inline", marginRight: 6 }} />
              All Tournaments
            </Link>
            <Link href="/streams" className="btn-secondary">
              <Video size={14} style={{ display: "inline", marginRight: 6 }} />
              Watch Streams
            </Link>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {GAMES.map((game) => (
            <Link key={game.slug} href={game.href} style={{ textDecoration: "none" }}>
              <div
                className="game-card"
                style={{ overflow: "hidden", cursor: "pointer", transition: "all 0.3s" }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget as HTMLElement;
                  card.style.borderColor = `${game.color}50`;
                  card.style.transform = "translateY(-4px)";
                  card.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${game.color}15`;
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget as HTMLElement;
                  card.style.borderColor = "#1a2840";
                  card.style.transform = "translateY(0)";
                  card.style.boxShadow = "none";
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
                  <img src={game.image} alt={game.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} />
                  <div style={{ position: "absolute", inset: 0, background: game.gradient, opacity: 0.4 }} />
                  <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <span style={{ background: game.color, color: "#040810", fontFamily: "Orbitron, monospace", fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px" }}>
                      {game.stats}
                    </span>
                  </div>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 50, height: 50, background: `${game.color}20`, border: `2px solid ${game.color}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Gamepad2 size={22} color={game.color} />
                    </div>
                  </div>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.1rem", color: game.color }}>{game.name}</h3>
                    <ChevronRight size={18} color="#8a9bb5" />
                  </div>
                  <p style={{ color: "#8a9bb5", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1rem" }}>{game.description}</p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#8a9bb5", fontSize: "0.8rem" }}>
                      <Trophy size={12} color={game.color} /> Tournaments
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#8a9bb5", fontSize: "0.8rem" }}>
                      <Video size={12} color={game.color} /> Streams
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#8a9bb5", fontSize: "0.8rem" }}>
                      <Users size={12} color={game.color} /> Community
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}