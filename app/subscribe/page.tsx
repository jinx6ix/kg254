"use client";
import { useState } from "react";
import { Check, Zap, Crown, Shield, Star, ChevronRight } from "lucide-react";

const PLANS = [
  {
    id: "basic", name: "Supporter", price: "KSh 299", period: "/month", Icon: Star, color: "#00d4ff",
    perks: ["Access to member-only chats", "Early event notifications", "Custom badge in chat", "Monthly giveaway entry", "Access to highlights archive"],
    popular: false,
  },
  {
    id: "pro", name: "Pro Member", price: "KSh 699", period: "/month", Icon: Zap, color: "#00ff88",
    perks: ["Everything in Supporter", "Priority tournament registration", "Exclusive tutorial content", "Vote on stream games", "Discord Pro Member role", "Behind-the-scenes clips"],
    popular: true,
  },
  {
    id: "elite", name: "Elite / VIP", price: "KSh 1,499", period: "/month", Icon: Crown, color: "#ff6b00",
    perks: ["Everything in Pro Member", "1-on-1 gaming sessions (1/month)", "Name in stream credits", "Free tournament entry (1/month)", "Special VIP badge", "Direct WhatsApp group access", "Lifetime member status"],
    popular: false,
  },
];

export default function SubscribePage() {
  const [selected, setSelected] = useState("pro");
  const [step, setStep] = useState<"plans" | "form" | "done">("plans");
  const [form, setForm] = useState({ name: "", email: "", phone: "", mpesa: "" });
  const plan = PLANS.find(p => p.id === selected)!;

  if (step === "done") {
    return (
      <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ width: 80, height: 80, background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }} className="pulse-green">
            <Check size={36} color="#00ff88" />
          </div>
          <h2 style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.8rem", color: "#e8f4ff", marginBottom: "1rem" }}>
            Welcome to <span style={{ color: "#00ff88" }}>K.G 254!</span>
          </h2>
          <p style={{ color: "#8a9bb5", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Your subscription request has been received. We'll confirm your <strong style={{ color: "#e8f4ff" }}>{plan.name}</strong> membership via email within 24 hours after payment verification.
          </p>
          <div className="game-card" style={{ padding: "1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.8rem", color: "#00ff88", marginBottom: "0.75rem" }}>PAYMENT DETAILS</div>
            <div style={{ color: "#8a9bb5", fontSize: "0.9rem", lineHeight: 2 }}>
              <div>Send <strong style={{ color: "#ff6b00" }}>{plan.price}</strong> to M-Pesa:</div>
              <div style={{ fontFamily: "Share Tech Mono, monospace", color: "#00ff88", fontSize: "1rem" }}>0712 345 678</div>
              <div>Name: <strong style={{ color: "#e8f4ff" }}>KenyanGamer254</strong></div>
              <div>Reference: <strong style={{ color: "#00d4ff" }}>{form.email}</strong></div>
            </div>
          </div>
          <a href="/" className="btn-primary">Back to Home</a>
        </div>
      </div>
    );
  }

  if (step === "form") {
    return (
      <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="game-card" style={{ padding: "2.5rem", maxWidth: 480, width: "100%" }}>
          <button onClick={() => setStep("plans")} style={{ background: "none", border: "none", color: "#8a9bb5", cursor: "pointer", fontSize: "0.85rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 4 }}>
            ← Back to plans
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <plan.Icon size={24} color={plan.color} />
            <div>
              <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.2rem", color: plan.color }}>{plan.name}</div>
              <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.8rem", color: "#8a9bb5" }}>{plan.price}/month</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {[
              { field: "name", label: "Full Name", placeholder: "Your name" },
              { field: "email", label: "Email Address", placeholder: "email@example.com" },
              { field: "phone", label: "Phone / M-Pesa Number", placeholder: "0712 345 678" },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label style={{ display: "block", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#8a9bb5", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                <input
                  className="game-input"
                  placeholder={placeholder}
                  value={form[field as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className="game-card" style={{ padding: "1rem", marginBottom: "1.5rem", borderColor: "rgba(0,255,136,0.2)" }}>
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: "0.5rem" }}>PAYMENT VIA M-PESA</div>
            <div style={{ color: "#8a9bb5", fontSize: "0.85rem", lineHeight: 1.8 }}>
              After submitting, send <strong style={{ color: "#ff6b00" }}>{plan.price}</strong> to M-Pesa <strong style={{ color: "#00ff88" }}>0712 345 678</strong> (KenyanGamer254). Use your email as the reference.
            </div>
          </div>

          <button className="btn-primary" style={{ width: "100%" }} onClick={() => { if (form.name && form.email && form.phone) setStep("done"); }}>
            <Zap size={14} style={{ display: "inline", marginRight: 6 }} />
            Complete Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ background: "#080f1a", padding: "4rem 1.5rem 3rem", borderBottom: "1px solid #1a2840", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#00ff88", marginBottom: 6, letterSpacing: "0.15em" }}>// JOIN THE SQUAD</div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Subscribe</h1>
          <p style={{ color: "#8a9bb5", fontSize: "1.1rem" }}>Pick a plan and unlock exclusive access to the K.G 254 community.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setSelected(p.id)}
              className="game-card"
              style={{ padding: "2rem", cursor: "pointer", borderColor: selected === p.id ? p.color : "#1a2840", transform: selected === p.id ? "scale(1.02)" : "scale(1)", transition: "all 0.3s", position: "relative" }}>
              {p.popular && (
                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: p.color, color: "#040810", fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: "0.65rem", padding: "3px 12px", letterSpacing: "0.1em" }}>MOST POPULAR</div>
              )}
              <p.Icon size={28} color={p.color} style={{ marginBottom: "0.75rem" }} />
              <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.2rem", color: p.color, marginBottom: "0.25rem" }}>{p.name}</div>
              <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "2rem", color: "#e8f4ff", marginBottom: "0.25rem" }}>{p.price}</div>
              <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#8a9bb5", marginBottom: "1.5rem" }}>per month • M-Pesa</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {p.perks.map(perk => (
                  <div key={perk} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9rem", color: "#c8d8e8" }}>
                    <Check size={14} color={p.color} style={{ marginTop: 3, flexShrink: 0 }} /> {perk}
                  </div>
                ))}
              </div>
              <button
                className={selected === p.id ? "btn-primary" : "btn-secondary"}
                style={{ width: "100%", background: selected === p.id ? `linear-gradient(135deg, ${p.color}, ${p.color}cc)` : "transparent", borderColor: p.color, color: selected === p.id ? "#040810" : p.color }}
                onClick={e => { e.stopPropagation(); setSelected(p.id); setStep("form"); }}>
                {selected === p.id ? "Subscribe Now" : "Choose Plan"} <ChevronRight size={14} style={{ display: "inline" }} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem", padding: "2rem", background: "#080f1a", border: "1px solid #1a2840" }}>
          <Shield size={24} color="#00ff88" style={{ margin: "0 auto 0.75rem" }} />
          <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: "0.9rem", color: "#e8f4ff", marginBottom: 4 }}>SECURE MEMBERSHIP</div>
          <div style={{ color: "#8a9bb5", fontSize: "0.9rem" }}>Payments via M-Pesa. Cancel anytime. Questions? DM <strong style={{ color: "#00ff88" }}>@KenyanGamer254</strong></div>
        </div>
      </div>
    </div>
  );
}
