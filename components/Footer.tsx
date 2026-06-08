"use client";
import Link from "next/link";
import { Video, Radio, AtSign, Camera, Gamepad2 } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#040810", borderTop: "1px solid #1a2840", padding: "3rem 1.5rem 1.5rem", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.3rem", color: "#00ff88", marginBottom: "0.5rem" }}>PTK 254</div>
            <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.7rem", color: "#8a9bb5", marginBottom: "1rem" }}>PTK AFRICA</div>
            <p style={{ color: "#8a9bb5", fontSize: "0.9rem", lineHeight: 1.6 }}>Kenya's top gaming hub — tournaments, streams, community and more.</p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              {[
                { Icon: Video, href: "https://youtube.com/@PTK Africa", color: "#ff2244" },
                { Icon: Radio, href: "https://twitch.tv/PTK Africa", color: "#9147ff" },
                { Icon: AtSign, href: "https://twitter.com/PTK Africa", color: "#00d4ff" },
                { Icon: Camera, href: "https://instagram.com/PTK Africa", color: "#ff6b00" },
              ].map(({ Icon, href, color }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, border: "1px solid #1a2840", display: "flex", alignItems: "center", justifyContent: "center", color, transition: "all 0.2s", textDecoration: "none" }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: "0.85rem", color: "#00ff88", marginBottom: "1rem", letterSpacing: "0.1em" }}>NAVIGATE</div>
            {[
              { href: "/", label: "Home" }, { href: "/streams", label: "Streams" },
              { href: "/tournaments", label: "Tournaments" }, { href: "/events", label: "Events" },
              { href: "/games", label: "Games" }, { href: "/chat", label: "Live Chat" },
            ].map(l => (
              <Link key={l.href} href={l.href}
                style={{ display: "block", color: "#8a9bb5", textDecoration: "none", fontSize: "0.95rem", padding: "0.25rem 0" }}>
                &rsaquo; {l.label}
              </Link>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: "0.85rem", color: "#00ff88", marginBottom: "1rem", letterSpacing: "0.1em" }}>GAMES</div>
            {["eFootball Mobile", "eFootball Console", "PUBG Mobile", "PUBG PC", "Other Games"].map(g => (
              <div key={g} style={{ color: "#8a9bb5", fontSize: "0.95rem", padding: "0.25rem 0" }}>▸ {g}</div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: "0.85rem", color: "#00ff88", marginBottom: "1rem", letterSpacing: "0.1em" }}>JOIN THE SQUAD</div>
            <p style={{ color: "#8a9bb5", fontSize: "0.9rem", marginBottom: "1rem" }}>Subscribe for exclusive content, early tournament access and member perks.</p>
            <Link href="/subscribe" className="btn-primary" style={{ fontSize: "0.72rem", padding: "0.6rem 1.2rem" }}>
              Subscribe Now
            </Link>
          </div>
        </div>

        <hr className="game-divider" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginTop: "1.5rem" }}>
          <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#8a9bb5" }}>
            © 2025 PTK Africa · PTK 254 · All rights reserved
          </div>
          <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#8a9bb5" }}>
            <span style={{ color: "#00ff88" }}>■</span> Nairobi, Kenya · Gaming Community
          </div>
        </div>
      </div>
    </footer>
  );
}
