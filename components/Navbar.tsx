"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Gamepad2, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/streams", label: "Streams" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/events", label: "Events" },
  { href: "/community", label: "Community" },
  { href: "/chat", label: "Live Chat" },
  { href: "/subscribe", label: "Subscribe" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(4, 8, 16, 0.95)" : "rgba(4, 8, 16, 0.7)",
      backdropFilter: "blur(12px)",
      borderBottom: scrolled ? "1px solid #1a2840" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #00ff88, #00d4ff)",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Gamepad2 size={18} color="#040810" />
          </div>
          <div>
            <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1rem", color: "#00ff88", lineHeight: 1 }}>
              K.G 254
            </div>
            <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.6rem", color: "#8a9bb5", letterSpacing: "0.15em" }}>
              KENYANGAMER254
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="hidden-mobile">
          {navLinks.slice(0, -1).map(link => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? "active" : ""}`}
              style={{ textDecoration: "none", color: pathname === link.href ? "#00ff88" : "#8a9bb5", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.05em", transition: "color 0.2s" }}>
              {link.label}
            </Link>
          ))}
          <Link href="/subscribe" className="btn-primary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.72rem" }}>
            <Zap size={12} style={{ display: "inline", marginRight: 4 }} />
            Subscribe
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#00ff88", cursor: "pointer", padding: "0.5rem" }} className="show-mobile">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "rgba(4, 8, 16, 0.98)", borderTop: "1px solid #1a2840", padding: "1rem 1.5rem 1.5rem" }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "0.75rem 0", color: pathname === link.href ? "#00ff88" : "#8a9bb5", textDecoration: "none", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "1.1rem", borderBottom: "1px solid #1a2840" }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}</style>
    </nav>
  );
}
