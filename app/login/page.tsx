"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gamepad2, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!form.username || !form.password) return toast.error("Fill in all fields");
    setLoading(true);
    const { error } = await login(form.username, form.password);
    setLoading(false);
    if (error) return toast.error(error);
    toast.success(`Welcome back, ${form.username}!`);
    router.push("/");
  };

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }} className="grid-bg">
      <div className="game-card" style={{ padding: "2.5rem", maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 56, height: 56, background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <Gamepad2 size={24} color="#00ff88" />
          </div>
          <h1 style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.5rem", color: "#e8f4ff", marginBottom: 4 }}>Welcome Back</h1>
          <p style={{ color: "#8a9bb5", fontSize: "0.9rem" }}>Log in to your PTK 254 account</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#8a9bb5", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Username or Email</label>
            <input className="game-input" placeholder="Your username or email" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#8a9bb5", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input className="game-input" type={showPw ? "text" : "password"} placeholder="Your password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleSubmit()} style={{ paddingRight: "2.5rem" }} />
              <button onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8a9bb5", cursor: "pointer" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn-primary" style={{ width: "100%", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
            <LogIn size={14} style={{ display: "inline", marginRight: 6 }} />
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem", color: "#8a9bb5", fontSize: "0.9rem" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "#00ff88", textDecoration: "none", fontWeight: 600 }}>Create one free</Link>
        </div>
        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.7rem", color: "#8a9bb5", background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.1)", padding: "0.4rem 0.75rem", display: "inline-block" }}>
            Admin login: use your admin credentials
          </div>
        </div>
      </div>
    </div>
  );
}
