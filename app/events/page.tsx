"use client";
import { useState } from "react";
import { Calendar, MapPin, Share2, AtSign, Globe, Copy, Check, ExternalLink, Clock, Users } from "lucide-react";

const EVENTS = [
  { id: 1, title: "KG254 Community Stream Night", date: "Jun 10, 2025", time: "8:00 PM EAT", location: "Online — Radio & YouTube", category: "Stream", desc: "Join KenyanGamer254 for a special community stream night featuring viewer games, challenges, and giveaways. Subscribers get priority participation!", image: "stream", attendees: 312 },
  { id: 2, title: "eFootball Spring Cup 2025 — Tournament Day", date: "Jun 15, 2025", time: "2:00 PM EAT", location: "Online — Bracket on Discord", category: "Tournament", desc: "16-player eFootball Mobile tournament. Prize pool KSh 50,000. Livestreamed on YouTube. Register via the Tournaments page.", image: "efootball", attendees: 156 },
  { id: 3, title: "PUBG Nairobi Classic", date: "Jun 22, 2025", time: "3:00 PM EAT", location: "Online — Custom Lobby", category: "Tournament", desc: "Squad-based PUBG Mobile tournament. 5 matches. Prizes for top 3 squads. Must register team before event.", image: "pubg", attendees: 80 },
  { id: 4, title: "Gaming Meetup — Nairobi", date: "Jun 28, 2025", time: "12:00 PM EAT", location: "Westgate Mall, Nairobi", category: "IRL", desc: "Meet K.G 254 in person! Console gaming stations, community networking, giveaways and food. Free entry for subscribers.", image: "irl", attendees: 200 },
  { id: 5, title: "PUBG Legends Invitational — Qualifiers", date: "Jul 1, 2025", time: "5:00 PM EAT", location: "Online — Qualifier Lobby", category: "Tournament", desc: "Qualification round for the Legends Invitational. Top 24 players earn an invite to the main event on Jul 5.", image: "pubg", attendees: 95 },
  { id: 6, title: "eFootball Tips & Tricks Workshop", date: "Jul 12, 2025", time: "7:00 PM EAT", location: "Online — YouTube Live", category: "Workshop", desc: "K.G 254 breaks down advanced skill moves, positioning and meta strategies for eFootball Mobile & Console.", image: "efootball", attendees: 540 },
];

const CATEGORY_COLORS: Record<string, string> = { Stream: "#00ff88", Tournament: "#ff6b00", IRL: "#00d4ff", Workshop: "#9147ff" };
const BG_GRADIENTS: Record<string, string> = {
  stream: "linear-gradient(135deg, #0a1a14, #081208)",
  efootball: "linear-gradient(135deg, #0a1a0d, #0d2010)",
  pubg: "linear-gradient(135deg, #0a0d1a, #10122a)",
  irl: "linear-gradient(135deg, #1a100a, #2a1208)",
};

function ShareMenu({ event }: { event: typeof EVENTS[0] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = `https://kenyangamer254.com/events/${event.id}`;
  const text = `Check out ${event.title} by KenyanGamer254! ${url}`;

  const copy = () => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} className="btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.7rem" }}>
        <Share2 size={12} style={{ display: "inline", marginRight: 4 }} /> Share
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "110%", right: 0, background: "#0d1826", border: "1px solid #1a2840", padding: "0.5rem", zIndex: 100, minWidth: 180, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          {[
            { label: "Twitter/X", Icon: AtSign, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, color: "#1da1f2" },
            { label: "Facebook", Icon: Globe, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: "#1877f2" },
            { label: "WhatsApp", Icon: Share2, href: `https://wa.me/?text=${encodeURIComponent(text)}`, color: "#25d366" },
          ].map(({ label, Icon, href, color }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", color, textDecoration: "none", fontSize: "0.85rem", transition: "background 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1a2840")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <Icon size={14} /> {label}
            </a>
          ))}
          <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", color: "#8a9bb5", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", width: "100%" }}>
            {copied ? <Check size={14} color="#00ff88" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  const [category, setCategory] = useState("All");
  const categories = ["All", "Stream", "Tournament", "IRL", "Workshop"];
  const filtered = category === "All" ? EVENTS : EVENTS.filter(e => e.category === category);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// UPCOMING</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Events</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1.1rem", maxWidth: 600 }}>Streams, tournaments, IRL meetups and workshops. Never miss a KenyanGamer254 event.</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ background: "#040810", borderBottom: "1px solid #1a2840", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ background: category === c ? (CATEGORY_COLORS[c] || "#00ff88") : "transparent", color: category === c ? "#040810" : "#8a9bb5", border: "1px solid", borderColor: category === c ? (CATEGORY_COLORS[c] || "#00ff88") : "#1a2840", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, padding: "0.4rem 1rem", cursor: "pointer", transition: "all 0.2s", fontSize: "0.95rem" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Events grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {filtered.map(event => (
            <div key={event.id} className="game-card" style={{ padding: 0, overflow: "hidden" }}>
              {/* Event image/banner */}
              <div style={{ background: BG_GRADIENTS[event.image], height: 120, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "2rem", color: CATEGORY_COLORS[event.category], opacity: 0.15, textTransform: "uppercase" }}>{event.category}</div>
                <div style={{ position: "absolute", top: 10, left: 10 }}>
                  <span style={{ background: `${CATEGORY_COLORS[event.category]}20`, border: `1px solid ${CATEGORY_COLORS[event.category]}60`, color: CATEGORY_COLORS[event.category], fontFamily: "Share Tech Mono, monospace", fontSize: "0.7rem", padding: "3px 8px" }}>{event.category}</span>
                </div>
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 4, color: "#8a9bb5", fontSize: "0.75rem", fontFamily: "Share Tech Mono, monospace" }}>
                  <Users size={12} /> {event.attendees} going
                </div>
              </div>

              <div style={{ padding: "1.25rem" }}>
                <h3 style={{ fontFamily: "Orbitron, monospace", fontSize: "0.95rem", color: "#e8f4ff", marginBottom: "0.75rem", lineHeight: 1.3 }}>{event.title}</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#8a9bb5", fontSize: "0.85rem" }}>
                    <Calendar size={13} color="#00ff88" /> {event.date}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#8a9bb5", fontSize: "0.85rem" }}>
                    <Clock size={13} color="#00d4ff" /> {event.time}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#8a9bb5", fontSize: "0.85rem" }}>
                    <MapPin size={13} color="#ff6b00" /> {event.location}
                  </div>
                </div>

                <p style={{ color: "#8a9bb5", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1rem" }}>{event.desc}</p>

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.7rem" }}>RSVP</button>
                  <ShareMenu event={event} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
