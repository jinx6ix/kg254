"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gamepad2, Eye, EyeOff, Zap, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) return toast.error("All fields required");
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await register(form.username, form.email, form.password);
    setLoading(false);
    if (error) return toast.error(error);
    toast.success(`Welcome to PTK 254, ${form.username}! 🔥`);
    router.push("/");
  };

  const perks = ["Access to Live Chat", "Community posts & events", "Tournament registration", "Subscriber upgrades available"];

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }} className="grid-bg">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: 860, width: "100%", alignItems: "center" }}>
        {/* Perks panel */}
        <div style={{ display: "none" }} className="perks-panel">
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 8, letterSpacing: "0.15em" }}>// JOIN TODAY</div>
          <h2 style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.8rem", color: "#e8f4ff", marginBottom: "1.5rem", lineHeight: 1.2 }}>Become Part of the <span style={{ color: "#00ff88" }}>Squad</span></h2>
          {perks.map(p => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <CheckCircle size={18} color="#00ff88" />
              <span style={{ color: "#c8d8e8", fontSize: "1rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 500 }}>{p}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="game-card" style={{ padding: "2.5rem", gridColumn: "1 / -1" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: 56, height: 56, background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <Gamepad2 size={24} color="#00ff88" />
            </div>
            <h1 style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.5rem", color: "#e8f4ff", marginBottom: 4 }}>Create Account</h1>
            <p style={{ color: "#8a9bb5", fontSize: "0.9rem" }}>Join the PTK 254 community — it's free</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { field: "username", label: "Username", placeholder: "e.g. EagleFC254", type: "text", full: false },
              { field: "email", label: "Email Address", placeholder: "you@email.com", type: "email", full: false },
              { field: "password", label: "Password", placeholder: "Min 6 characters", type: showPw ? "text" : "password", full: false },
              { field: "confirm", label: "Confirm Password", placeholder: "Repeat password", type: showPw ? "text" : "password", full: false },
            ].map(({ field, label, placeholder, type }) => (
              <div key={field}>
                <label style={{ display: "block", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#8a9bb5", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                <input className="game-input" type={type} placeholder={placeholder} value={form[field as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} />
              </div>
            ))}
          </div>

          <button onClick={() => setShowPw(p => !p)} style={{ background: "none", border: "none", color: "#8a9bb5", cursor: "pointer", fontSize: "0.85rem", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: 4 }}>
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />} {showPw ? "Hide" : "Show"} passwords
          </button>

          <button className="btn-primary" style={{ width: "100%", marginTop: "1.5rem", opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
            <Zap size={14} style={{ display: "inline", marginRight: 6 }} />
            {loading ? "Creating account..." : "Create Free Account"}
          </button>

          <div style={{ textAlign: "center", marginTop: "1.5rem", color: "#8a9bb5", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#00ff88", textDecoration: "none", fontWeight: 600 }}>Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
