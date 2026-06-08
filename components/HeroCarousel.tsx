"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, Trophy, Users, Play, AlertCircle, Image as ImageIcon } from "lucide-react";

interface EventSlide {
  id: string;
  title: string;
  game: string;
  date: string;
  prize: string;
  spots: number;
  event_type: "upcoming" | "live";
  image_url: string;
  description: string;
}

const FALLBACK_IMAGES: Record<string, string> = {
  "eFootball Mobile": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&h=900&fit=crop",
  "eFootball Console": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1600&h=900&fit=crop",
  "PUBG Mobile": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1600&h=900&fit=crop",
  "PUBG PC": "https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=1600&h=900&fit=crop",
  "Other": "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1600&h=900&fit=crop",
};

const FALLBACK_SLIDES: EventSlide[] = [
  { id: "fallback-1", title: "eFootball Spring Cup 2025", game: "eFootball Mobile", date: "June 15, 2025", prize: "KSh 50,000", spots: 16, event_type: "upcoming", image_url: FALLBACK_IMAGES["eFootball Mobile"], description: "Kenya's biggest eFootball mobile tournament." },
  { id: "fallback-2", title: "PUBG Nairobi Classic", game: "PUBG Mobile", date: "June 22, 2025", prize: "KSh 30,000", spots: 20, event_type: "upcoming", image_url: FALLBACK_IMAGES["PUBG Mobile"], description: "Erangel battlefield awaits." },
  { id: "fallback-3", title: "PTK AFRICA Weekly Clash #13", game: "eFootball Console", date: "June 29, 2025", prize: "KSh 10,000", spots: 12, event_type: "upcoming", image_url: FALLBACK_IMAGES["eFootball Console"], description: "Weekly console battles." },
  { id: "fallback-4", title: "PTK AFRICA Community Showdown", game: "PUBG PC", date: "July 5, 2025", prize: "KSh 25,000", spots: 24, event_type: "upcoming", image_url: FALLBACK_IMAGES["PUBG PC"], description: "PC gamers unite!" },
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState<EventSlide[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (res.ok && data.events && data.events.length > 0) {
          setSlides(data.events);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrent(c => (c + 1) % slides.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  const getImage = (s: EventSlide) => {
    if (s.image_url) return s.image_url;
    return FALLBACK_IMAGES[s.game] || FALLBACK_IMAGES["Other"];
  };

  return (
    <section style={{ position: "relative", minHeight: "92vh", overflow: "hidden" }}>
      {/* Background Image Slides */}
      <div style={{ position: "absolute", inset: 0 }}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${getImage(s)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === current ? 1 : 0,
              transition: "opacity 0.6s ease-in-out",
            }}
          />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(4,8,16,0.92) 0%, rgba(4,8,16,0.6) 50%, rgba(4,8,16,0.85) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(0,255,136,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} className="grid-bg" />

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", padding: "6rem 1.5rem 4rem", minHeight: "92vh", display: "flex", alignItems: "center" }}>
        {/* Left: Event Info */}
        <div style={{ flex: "1 1 55%", opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateY(10px)" : "translateY(0)", transition: "all 0.5s ease" }}>
          {/* Status badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: slide.event_type === "live" ? "rgba(255,34,68,0.15)" : "rgba(0,255,136,0.1)", border: `1px solid ${slide.event_type === "live" ? "rgba(255,34,68,0.4)" : "rgba(0,255,136,0.3)"}`, padding: "0.3rem 0.8rem", marginBottom: "1.5rem" }}>
            {slide.event_type === "live" && <span className="live-dot" />}
            <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: slide.event_type === "live" ? "#ff2244" : "#00ff88" }}>
              {slide.event_type === "live" ? "LIVE NOW" : "UPCOMING EVENT"}
            </span>
          </div>

          {/* Game tag */}
          <div style={{ marginBottom: "1rem" }}>
            <span className="badge-cyan">{slide.game || "General"}</span>
          </div>

          <h1 style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1, marginBottom: "1rem", color: "#e8f4ff" }}>
            {slide.title}
          </h1>

          <p style={{ color: "#8a9bb5", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 500 }}>
            {slide.description}
          </p>

          {/* Event details */}
          <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={18} color="#00d4ff" />
              <div>
                <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.7rem", color: "#8a9bb5", marginBottom: 2 }}>DATE</div>
                <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.85rem", color: "#e8f4ff" }}>{slide.date}</div>
              </div>
            </div>
            {slide.prize && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Trophy size={18} color="#ff6b00" />
                <div>
                  <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.7rem", color: "#8a9bb5", marginBottom: 2 }}>PRIZE POOL</div>
                  <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.85rem", color: "#ff6b00" }}>{slide.prize}</div>
                </div>
              </div>
            )}
            {slide.spots > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Users size={18} color="#00ff88" />
                <div>
                  <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.7rem", color: "#8a9bb5", marginBottom: 2 }}>SPOTS LEFT</div>
                  <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.85rem", color: "#00ff88" }}>{slide.spots}</div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/tournaments" className="btn-primary">
              <Trophy size={14} style={{ display: "inline", marginRight: 6 }} />
              Register Now
            </Link>
            <Link href="/events" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={14} />
              View Calendar
            </Link>
          </div>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "2.5rem" }}>
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? 32 : 8,
                  height: 8,
                  background: i === current ? "#00ff88" : "#1a2840",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Thumbnail preview */}
        <div style={{ flex: "1 1 40%", display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "3rem" }}
          className="hide-on-mobile">
          <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
            <div style={{
              aspectRatio: "16/9",
              backgroundImage: `url(${getImage(slide)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid rgba(0,255,136,0.2)",
              boxShadow: "0 0 40px rgba(0,255,136,0.1), 0 20px 60px rgba(0,0,0,0.5)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,255,136,0.05), transparent)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 60, height: 60, background: "rgba(0,255,136,0.15)", border: "2px solid #00ff88", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }} className="pulse-green">
                  <Play size={24} color="#00ff88" style={{ marginLeft: 4 }} />
                </div>
              </div>
              <div style={{ position: "absolute", top: 10, left: 10 }}>
                <span className={slide.event_type === "live" ? "badge-red" : "badge-green"} style={{ fontSize: "0.62rem" }}>
                  {slide.event_type === "live" ? "LIVE" : "SOON"}
                </span>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem", background: "linear-gradient(transparent, rgba(4,8,16,0.9))" }}>
                <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.8rem", color: "#e8f4ff" }}>{slide.title}</div>
              </div>
            </div>

            {/* Decorative elements */}
            <div style={{ position: "absolute", top: -15, right: -15, width: 60, height: 60, border: "1px solid rgba(0,255,136,0.15)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: -10, left: -10, width: 40, height: 40, border: "1px solid rgba(0,212,255,0.15)" }} />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "rgba(13,24,38,0.8)",
          border: "1px solid #1a2840",
          color: "#00ff88",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "#00ff88";
          el.style.background = "rgba(0,255,136,0.1)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "#1a2840";
          el.style.background = "rgba(13,24,38,0.8)";
        }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        style={{
          position: "absolute",
          right: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "rgba(13,24,38,0.8)",
          border: "1px solid #1a2840",
          color: "#00ff88",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "#00ff88";
          el.style.background = "rgba(0,255,136,0.1)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "#1a2840";
          el.style.background = "rgba(13,24,38,0.8)";
        }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide counter - bottom right */}
      <div style={{ position: "absolute", bottom: "2rem", right: "1.5rem", zIndex: 10, display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#8a9bb5" }}>
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </section>
  );
}