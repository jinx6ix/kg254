"use client";
import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Trophy, Users, Video, Calendar, ExternalLink, ChevronRight, Star } from "lucide-react";

const GAME_INFO: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgGradient: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  image: string;
}> = {
  "eFootball Mobile": {
    title: "eFootball Mobile",
    subtitle: "Mobile Football Gaming",
    description: "Compete in high-stakes mobile football tournaments. Master skill moves, build your squad, and climb the ranks on eFootball Mobile.",
    color: "#00ff88",
    bgGradient: "linear-gradient(135deg, #0a1a0d, #0d2010)",
    stats: [
      { label: "Active Players", value: "2,400+" },
      { label: "Tournaments", value: "32" },
      { label: "Prize Given", value: "KSh 800K+" },
    ],
    highlights: [
      "Weekly ranked matches and league play",
      "1v1 Knockout and squad tournaments",
      "Pro tips and tutorial sessions",
      "Scrims against top Kenyan teams",
    ],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
  },
  "eFootball Console": {
    title: "eFootball Console",
    subtitle: "Console Football Gaming",
    description: "Console-level eFootball action on PS5 and PS4. Join the elite tier of Kenyan console football players in competitive online tournaments.",
    color: "#00d4ff",
    bgGradient: "linear-gradient(135deg, #0a1520, #0d2030)",
    stats: [
      { label: "Active Players", value: "850+" },
      { label: "Tournaments", value: "18" },
      { label: "Prize Given", value: "KSh 350K+" },
    ],
    highlights: [
      "Weekly Clash tournaments every Sunday",
      "PlayStation exclusive competitive events",
      "Regional competition preparation",
      "Community friendly matches",
    ],
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop",
  },
  "PUBG Mobile": {
    title: "PUBG Mobile",
    subtitle: "Mobile Battle Royale",
    description: "Drop into Erangel, Miramar, and more. Lead your squad to victory in intense mobile Battle Royale competitions across classic and ranked modes.",
    color: "#ff6b00",
    bgGradient: "linear-gradient(135deg, #1a0d00, #201505)",
    stats: [
      { label: "Active Players", value: "3,100+" },
      { label: "Tournaments", value: "24" },
      { label: "Prize Given", value: "KSh 600K+" },
    ],
    highlights: [
      "Squad vs Squad competitive play",
      "Classic TPP and FPP modes",
      "Road to Conqueror ranked push",
      "Scrims against top African teams",
    ],
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop",
  },
  "PUBG PC": {
    title: "PUBG PC",
    subtitle: "PC Battle Royale",
    description: "Full PC Battle Royale experience. Custom lobbies, competitive tournaments, and the most prestigious PUBG events in Kenya on the PC platform.",
    color: "#9147ff",
    bgGradient: "linear-gradient(135deg, #0d0a1a, #10102a)",
    stats: [
      { label: "Active Players", value: "620+" },
      { label: "Tournaments", value: "12" },
      { label: "Prize Given", value: "KSh 500K+" },
    ],
    highlights: [
      "Invitational and open tournaments",
      "Trio and Squad competitive formats",
      "Custom lobby events with commentary",
      "Path to pro competitive circuit",
    ],
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=800&h=600&fit=crop",
  },
};

interface GamePageProps {
  params: { slug: string };
}

const SLUG_TO_GAME: Record<string, string> = {
  "efootball-mobile": "eFootball Mobile",
  "efootball-console": "eFootball Console",
  "pubg-mobile": "PUBG Mobile",
  "pubg-pc": "PUBG PC",
};

export default function GamePage({ params }: GamePageProps) {
  const gameKey = (SLUG_TO_GAME[params.slug] || "eFootball Mobile") as keyof typeof GAME_INFO;
  const game = GAME_INFO[gameKey];

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero Banner */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "50vh", display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: game.bgGradient }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(0,0,0,0.3) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "4rem 1.5rem", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}
          className="game-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `${game.color}15`, border: `1px solid ${game.color}40`, padding: "0.3rem 0.8rem", marginBottom: "1rem" }}>
              <Gamepad2 size={14} color={game.color} />
              <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: game.color }}>{game.subtitle}</span>
            </div>
            <h1 style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#e8f4ff", marginBottom: "1rem", lineHeight: 1.1 }}>
              {game.title}
            </h1>
            <p style={{ color: "#8a9bb5", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
              {game.description}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/tournaments" className="btn-primary" style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)` }}>
                <Trophy size={14} style={{ display: "inline", marginRight: 6 }} />
                View Tournaments
              </Link>
              <Link href="/streams" className="btn-secondary" style={{ borderColor: `${game.color}60`, color: game.color }}>
                <Video size={14} style={{ display: "inline", marginRight: 6 }} />
                Watch Streams
              </Link>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img src={game.image} alt={game.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", border: `1px solid ${game.color}30`, borderRadius: 4 }} />
            <div style={{ position: "absolute", top: -10, right: -10, width: 80, height: 80, border: `2px solid ${game.color}20`, borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: -8, left: -8, width: 50, height: 50, background: `${game.color}15`, border: `1px solid ${game.color}30` }} />
          </div>
        </div>
        <style>{`@media (max-width: 767px) { .game-hero-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Stats */}
      <section style={{ background: "#080f1a", borderTop: "1px solid #1a2840", borderBottom: "1px solid #1a2840", padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem" }}>
            {game.stats.map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "2rem", color: game.color }}>{value}</div>
                <div style={{ fontSize: "0.9rem", color: "#8a9bb5", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="game-content-grid">
            <div>
              <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: game.color, marginBottom: 6, letterSpacing: "0.15em" }}>// WHAT&apos;S AVAILABLE</div>
              <h2 style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.8rem", color: "#e8f4ff", marginBottom: "2rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Competitive {game.title}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {game.highlights.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ width: 24, height: 24, background: `${game.color}15`, border: `1px solid ${game.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Star size={12} color={game.color} />
                    </div>
                    <span style={{ color: "#c8d8e8", fontSize: "1rem", lineHeight: 1.5 }}>{h}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}>
                <Link href="/tournaments" className="btn-primary" style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}cc)` }}>
                  <Trophy size={14} style={{ display: "inline", marginRight: 6 }} />
                  Join Tournament
                </Link>
                <Link href="/subscribe" className="btn-secondary" style={{ borderColor: `${game.color}60`, color: game.color }}>
                  Subscribe for Perks
                </Link>
              </div>
            </div>
            <div style={{ background: "#080f1a", border: "1px solid #1a2840", padding: "2rem" }}>
              <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.85rem", color: game.color, marginBottom: "1.5rem" }}>QUICK LINKS</div>
              {[
                { label: "Latest Tournament", href: "/tournaments", Icon: Trophy, desc: "View and register for upcoming events" },
                { label: "Past Streams", href: "/streams", Icon: Video, desc: "Watch VODs and highlights" },
                { label: "Community Feed", href: "/community", Icon: Users, desc: "Join discussions and find teammates" },
                { label: "Events Calendar", href: "/events", Icon: Calendar, desc: "See all upcoming events" },
              ].map(({ label, href, Icon, desc }) => (
                <Link key={href} href={href} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid #0d1826", textDecoration: "none", color: "inherit" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  <Icon size={20} color={game.color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, color: "#e8f4ff", fontSize: "1rem" }}>{label}</div>
                    <div style={{ fontSize: "0.8rem", color: "#8a9bb5" }}>{desc}</div>
                  </div>
                  <ChevronRight size={16} color="#8a9bb5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 767px) { .game-content-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>
    </div>
  );
}