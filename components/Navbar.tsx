"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Gamepad2, Zap, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/streams", label: "Streams" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/events", label: "Events" },
  { href: "/community", label: "Community" },
  { href: "/chat", label: "Live Chat" },
];
const ROLE_COLORS: Record<string, string> = { admin: "#00ff88", subscriber: "#9147ff", member: "#00d4ff", guest: "#8a9bb5" };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setProfileOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    toast.success("Logged out");
    router.push("/");
  };

  const roleColor = user ? (ROLE_COLORS[user.role] || "#8a9bb5") : "#8a9bb5";

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(4,8,16,0.97)" : "rgba(4,8,16,0.75)", backdropFilter: "blur(12px)", borderBottom: scrolled ? "1px solid #1a2840" : "1px solid transparent", transition: "all 0.3s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#00ff88,#00d4ff)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Gamepad2 size={18} color="#040810" />
          </div>
          <div>
            <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1rem", color: "#00ff88", lineHeight: 1 }}>K.G 254</div>
            <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.6rem", color: "#8a9bb5", letterSpacing: "0.15em" }}>KENYANGAMER254</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }} className="hidden-mobile">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className={`nav-link ${pathname === l.href ? "active" : ""}`}
              style={{ textDecoration: "none", color: pathname === l.href ? "#00ff88" : "#8a9bb5", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.95rem", transition: "color 0.2s" }}>
              {l.label}
            </Link>
          ))}

          {!loading && (
            <>
              {user ? (
                <div ref={dropRef} style={{ position: "relative" }}>
                  <button onClick={() => setProfileOpen(p => !p)}
                    style={{ background: "none", border: `1px solid ${roleColor}40`, color: roleColor, fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "0.9rem", padding: "0.4rem 0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", transition: "all 0.2s" }}>
                    <div style={{ width: 24, height: 24, background: `${roleColor}20`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontFamily: "Orbitron,monospace", fontWeight: 900, color: roleColor }}>
                      {user.avatar || user.username[0].toUpperCase()}
                    </div>
                    {user.username}
                    <ChevronDown size={14} />
                  </button>
                  {profileOpen && (
                    <div style={{ position: "absolute", top: "110%", right: 0, background: "#0d1826", border: "1px solid #1a2840", minWidth: 180, zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
                      <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #1a2840" }}>
                        <div style={{ fontFamily: "Orbitron,monospace", fontSize: "0.8rem", color: roleColor }}>{user.username}</div>
                        <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", color: "#8a9bb5", textTransform: "uppercase" }}>{user.role} · {user.plan === "none" ? "Free" : user.plan}</div>
                      </div>
                      <Link href="/profile" onClick={() => setProfileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.6rem 1rem", color: "#c8d8e8", textDecoration: "none", fontSize: "0.9rem", fontFamily: "Rajdhani,sans-serif" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#1a2840")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <User size={14} /> My Profile
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={() => setProfileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.6rem 1rem", color: "#00ff88", textDecoration: "none", fontSize: "0.9rem", fontFamily: "Rajdhani,sans-serif" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#1a2840")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <Shield size={14} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0.6rem 1rem", color: "#ff2244", background: "none", border: "none", cursor: "pointer", width: "100%", fontSize: "0.9rem", fontFamily: "Rajdhani,sans-serif", borderTop: "1px solid #1a2840" }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#1a2840")} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href="/login" className="btn-secondary" style={{ padding: "0.45rem 1rem", fontSize: "0.72rem" }}>Login</Link>
                  <Link href="/register" className="btn-primary" style={{ padding: "0.45rem 1rem", fontSize: "0.72rem" }}>
                    <Zap size={11} style={{ display: "inline", marginRight: 4 }} />Join Free
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#00ff88", cursor: "pointer", padding: "0.5rem" }} className="show-mobile">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div style={{ background: "rgba(4,8,16,0.98)", borderTop: "1px solid #1a2840", padding: "1rem 1.5rem 1.5rem" }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "0.75rem 0", color: pathname === l.href ? "#00ff88" : "#8a9bb5", textDecoration: "none", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "1.1rem", borderBottom: "1px solid #1a2840" }}>
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
            {user ? (
              <button onClick={handleLogout} className="btn-danger" style={{ padding: "0.5rem 1rem" }}>Log Out</button>
            ) : (
              <>
                <Link href="/login" className="btn-secondary" style={{ padding: "0.5rem 1rem" }} onClick={() => setOpen(false)}>Login</Link>
                <Link href="/register" className="btn-primary" style={{ padding: "0.5rem 1rem" }} onClick={() => setOpen(false)}>Join Free</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 1023px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}</style>
    </nav>
  );
}
