"use client";
import { useState } from "react";
import { Check, Zap, Crown, Star, ChevronRight, Shield, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const PLANS = [
  { id: "basic",  name: "Supporter", price: 299,  priceStr: "KSh 299",  period: "/month", Icon: Star,  color: "#00d4ff",
    perks: ["Member badge in Live Chat","Early event notifications","Community post access","Monthly giveaway entry","VOD archive access"] },
  { id: "pro",    name: "Pro Member", price: 699, priceStr: "KSh 699",  period: "/month", Icon: Zap,   color: "#00ff88", popular: true,
    perks: ["Everything in Supporter","Priority tournament registration","Exclusive tutorial content","Vote on stream games","Pro badge + Discord role","Behind-the-scenes clips"] },
  { id: "elite",  name: "Elite VIP",  price: 1499, priceStr: "KSh 1,499", period: "/month", Icon: Crown, color: "#ff6b00",
    perks: ["Everything in Pro Member","1-on-1 gaming session (1×/month)","Name in stream credits","Free tournament entry (1×/month)","VIP badge — highest priority","Direct WhatsApp group access"] },
];

type Step = "plans" | "checkout" | "done";

export default function SubscribePage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState("pro");
  const [step, setStep] = useState<Step>("plans");
  const [form, setForm] = useState({ name: "", mpesa: "" });
  const [loading, setLoading] = useState(false);
  const plan = PLANS.find(p => p.id === selected)!;

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.mpesa.trim()) return toast.error("Please fill in all fields");
    if (!/^07\d{8}$/.test(form.mpesa.replace(/\s/g, ""))) return toast.error("Enter a valid Kenyan M-Pesa number (07XXXXXXXX)");
    if (!user) return toast.error("Please login first");
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected, mpesa: form.mpesa.replace(/\s/g, ""), name: form.name }),
      });
      const data = await res.json();
      if (data.error) return toast.error(data.error);
      setStep("done");
    } finally { setLoading(false); }
  };

  if (step === "done") return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <div style={{ width: 80, height: 80, background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }} className="pulse-green">
          <Check size={36} color="#00ff88" />
        </div>
        <h2 style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.8rem", color: "#e8f4ff", marginBottom: "1rem" }}>
          Request Submitted! <span style={{ color: "#00ff88" }}>🎮</span>
        </h2>
        <p style={{ color: "#8a9bb5", lineHeight: 1.7, marginBottom: "2rem" }}>
          Your <strong style={{ color: plan.color }}>{plan.name}</strong> subscription request is received. Complete payment to activate.
        </p>
        <div className="game-card" style={{ padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
          <div style={{ fontFamily: "Orbitron,monospace", fontSize: "0.78rem", color: "#00ff88", marginBottom: "1rem" }}>COMPLETE M-PESA PAYMENT</div>
          {[
            ["Send", plan.priceStr],
            ["To M-Pesa Number", "0712 345 678"],
            ["Account Name", "PTK Africa"],
            ["Reference", user?.username || "your username"],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #1a2840", fontSize: "0.9rem" }}>
              <span style={{ color: "#8a9bb5" }}>{label}</span>
              <span style={{ color: "#e8f4ff", fontFamily: "Share Tech Mono,monospace", fontWeight: 700 }}>{val}</span>
            </div>
          ))}
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.15)", fontSize: "0.85rem", color: "#8a9bb5", lineHeight: 1.6 }}>
            After payment, your subscription will be verified and activated within 24 hours. You'll see your plan badge in chat and your profile.
          </div>
        </div>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );

  if (step === "checkout") return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="game-card" style={{ padding: "2.5rem", maxWidth: 460, width: "100%" }}>
        <button onClick={() => setStep("plans")} style={{ background: "none", border: "none", color: "#8a9bb5", cursor: "pointer", fontSize: "0.85rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 4, fontFamily: "Rajdhani,sans-serif" }}>← Back to plans</button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", padding: "1rem", background: `${plan.color}08`, border: `1px solid ${plan.color}30` }}>
          <plan.Icon size={28} color={plan.color} />
          <div>
            <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.1rem", color: plan.color }}>{plan.name}</div>
            <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.4rem", color: "#e8f4ff" }}>{plan.priceStr}<span style={{ fontSize: "0.8rem", color: "#8a9bb5", fontWeight: 400 }}>/month</span></div>
          </div>
        </div>

        {!user ? (
          <div style={{ textAlign: "center", padding: "1.5rem", background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.15)", marginBottom: "1.5rem" }}>
            <p style={{ color: "#8a9bb5", marginBottom: "1rem" }}>You need to be logged in to subscribe.</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <Link href="/login" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.72rem", display: "flex", alignItems: "center", gap: 5 }}>
                <LogIn size={13} /> Login
              </Link>
              <Link href="/register" className="btn-secondary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.72rem" }}>Register Free</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#8a9bb5", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</label>
              <input className="game-input" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#8a9bb5", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>M-Pesa Number</label>
              <input className="game-input" placeholder="0712 345 678" value={form.mpesa} onChange={e => setForm(p => ({ ...p, mpesa: e.target.value }))} />
            </div>
          </div>
        )}

        <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)", padding: "1rem", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#8a9bb5", lineHeight: 1.7 }}>
          <strong style={{ color: "#00ff88" }}>How it works:</strong> Submit this form, then send <strong style={{ color: "#ff6b00" }}>{plan.priceStr}</strong> via M-Pesa to <strong style={{ color: "#e8f4ff" }}>0712 345 678</strong> using your username as reference. PTK AFRICA verifies and activates within 24 hours.
        </div>

        {user && (
          <button className="btn-primary" style={{ width: "100%", opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
            <Zap size={14} style={{ display: "inline", marginRight: 6 }} />
            {loading ? "Submitting..." : `Subscribe — ${plan.priceStr}/month`}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// JOIN THE SQUAD</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Subscribe</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1.05rem" }}>Pick your plan and unlock exclusive PTK 254 community access.</p>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setSelected(p.id)} className="game-card"
              style={{ padding: "2rem", cursor: "pointer", borderColor: selected === p.id ? p.color : "#1a2840", transform: selected === p.id ? "scale(1.02)" : "scale(1)", transition: "all 0.25s", position: "relative" }}>
              {p.popular && (
                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: p.color, color: "#040810", fontFamily: "Orbitron,monospace", fontWeight: 700, fontSize: "0.62rem", padding: "3px 14px", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <p.Icon size={30} color={p.color} style={{ marginBottom: "0.75rem" }} />
              <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "1.15rem", color: p.color, marginBottom: "0.2rem" }}>{p.name}</div>
              <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "2rem", color: "#e8f4ff", marginBottom: "0.2rem" }}>{p.priceStr}</div>
              <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.72rem", color: "#8a9bb5", marginBottom: "1.5rem" }}>per month · M-Pesa</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {p.perks.map(perk => (
                  <div key={perk} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.88rem", color: "#c8d8e8" }}>
                    <Check size={13} color={p.color} style={{ marginTop: 3, flexShrink: 0 }} /> {perk}
                  </div>
                ))}
              </div>
              <button
                className="btn-primary"
                style={{ width: "100%", background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`, color: "#040810", borderColor: p.color }}
                onClick={e => { e.stopPropagation(); setSelected(p.id); setStep("checkout"); }}>
                Choose {p.name} <ChevronRight size={13} style={{ display: "inline" }} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "3rem", padding: "1.5rem 2rem", background: "#080f1a", border: "1px solid #1a2840", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <Shield size={20} color="#00ff88" />
          <span style={{ color: "#8a9bb5", fontSize: "0.9rem" }}>Payments via M-Pesa · Cancel anytime · Questions? DM <strong style={{ color: "#00ff88" }}>@PTK Africa</strong> on any platform</span>
        </div>
      </div>
    </div>
  );
}
