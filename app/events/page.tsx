"use client";
import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, Share2, Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

type Event = { id: string; title: string; date: string; time: string; location: string; category: string; description: string; event_status: string; rsvps: number; };

const CATEGORY_COLORS: Record<string, string> = { Stream: "#00ff88", Tournament: "#ff6b00", IRL: "#00d4ff", Workshop: "#9147ff" };

function ShareMenu({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/events/${event.id}` : "";
  const text = `${event.title} — PTK Africa · ${event.date}`;
  const copy = () => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(p => !p)} className="btn-secondary" style={{ padding: "0.4rem 0.9rem", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 5 }}>
        <Share2 size={12} /> Share
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "110%", right: 0, background: "#0d1826", border: "1px solid #1a2840", padding: "0.4rem", zIndex: 100, minWidth: 170, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
          {[
            { label: "Twitter / X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, color: "#1da1f2" },
            { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, color: "#25d366" },
            { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: "#1877f2" },
            { label: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, color: "#0088cc" },
          ].map(({ label, href, color }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.45rem 0.75rem", color, textDecoration: "none", fontSize: "0.85rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 600 }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1a2840")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <ExternalLink size={12} /> {label}
            </a>
          ))}
          <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.45rem 0.75rem", color: "#8a9bb5", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", width: "100%", fontFamily: "Rajdhani,sans-serif" }}>
            {copied ? <Check size={12} color="#00ff88" /> : <Copy size={12} />} {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const { user } = useAuth();
  const [rsvped, setRsvped] = useState(false);
  const [count, setCount] = useState(event.rsvps);
  const [loading, setLoading] = useState(false);
  const color = CATEGORY_COLORS[event.category] || "#00ff88";

  const handleRsvp = async () => {
    if (!user) return toast.error("Login to RSVP for events");
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${event.id}/rsvp`, { method: "POST" });
      const data = await res.json();
      if (data.error) return toast.error(data.error);
      setRsvped(data.rsvped);
      setCount(p => data.rsvped ? p + 1 : Math.max(0, p - 1));
      toast.success(data.rsvped ? "You're going! 🎮" : "RSVP removed");
    } finally { setLoading(false); }
  };

  const dateStr = (() => { try { return new Date(event.date).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }); } catch { return event.date; } })();

  return (
    <div className="game-card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Banner */}
      <div style={{ background: `linear-gradient(135deg, ${color}10, #040810)`, height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", position: "relative", borderBottom: "1px solid #1a2840" }}>
        <span style={{ background: `${color}20`, color, border: `1px solid ${color}50`, fontFamily: "Share Tech Mono,monospace", fontSize: "0.7rem", padding: "3px 8px", textTransform: "uppercase" }}>{event.category}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#8a9bb5", fontFamily: "Share Tech Mono,monospace", fontSize: "0.72rem" }}>
          <Users size={12} /> {count.toLocaleString()} going
        </div>
      </div>
      <div style={{ padding: "1.25rem" }}>
        <h3 style={{ fontFamily: "Orbitron,monospace", fontSize: "0.95rem", color: "#e8f4ff", marginBottom: "0.75rem", lineHeight: 1.3 }}>{event.title}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8a9bb5", fontSize: "0.85rem" }}><Calendar size={13} color={color} /> {dateStr}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8a9bb5", fontSize: "0.85rem" }}><Clock size={13} color="#00d4ff" /> {event.time}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8a9bb5", fontSize: "0.85rem" }}><MapPin size={13} color="#ff6b00" /> {event.location}</div>
        </div>
        {event.description && <p style={{ color: "#8a9bb5", fontSize: "0.85rem", lineHeight: 1.55, marginBottom: "1rem" }}>{event.description}</p>}
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleRsvp}
            disabled={loading}
            style={{ background: rsvped ? "rgba(0,255,136,0.1)" : "linear-gradient(135deg,#00ff88,#00cc70)", color: rsvped ? "#00ff88" : "#040810", fontFamily: "Orbitron,monospace", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.08em", padding: "0.45rem 1.1rem", border: rsvped ? "1px solid #00ff88" : "none", cursor: "pointer", opacity: loading ? 0.7 : 1, clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)" }}>
            {rsvped ? "✓ Going" : "RSVP"}
          </button>
          <ShareMenu event={event} />
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const categories = ["All", "Stream", "Tournament", "IRL", "Workshop"];

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = category === "All" ? events : events.filter(e => e.category === category);

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// UPCOMING</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Events</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1.05rem", maxWidth: 580 }}>Streams, tournaments, IRL meetups and workshops. RSVP and share with your squad.</p>
        </div>
      </div>
      <div style={{ background: "#040810", borderBottom: "1px solid #1a2840", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ background: category === c ? (CATEGORY_COLORS[c] || "#00ff88") : "transparent", color: category === c ? "#040810" : "#8a9bb5", border: "1px solid", borderColor: category === c ? (CATEGORY_COLORS[c] || "#00ff88") : "#1a2840", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, padding: "0.4rem 1rem", cursor: "pointer", transition: "all 0.2s", fontSize: "0.95rem" }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#8a9bb5", fontFamily: "Share Tech Mono,monospace" }}>Loading events...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {filtered.map(ev => <EventCard key={ev.id} event={ev} />)}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "#8a9bb5" }}>
                <Calendar size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                <div style={{ fontFamily: "Orbitron,monospace" }}>No events in this category</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
