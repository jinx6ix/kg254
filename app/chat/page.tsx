"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Hash, Users, Shield, Gamepad2, Trophy, MessageSquare, Smile } from "lucide-react";

type Message = { id: number; user: string; text: string; time: string; role: "admin" | "member" | "sub" | "guest"; color: string };

const INITIAL_MESSAGES: Message[] = [
  { id: 1, user: "KenyanGamer254", text: "Welcome to the K.G 254 Live Chat! Let's go 🔥", time: "20:01", role: "admin", color: "#00ff88" },
  { id: 2, user: "EagleFC254", text: "Yooo KG! Ready for tonight's eFootball match!", time: "20:02", role: "sub", color: "#00d4ff" },
  { id: 3, user: "PUBGKingKE", text: "When's the next PUBG tournament? I'm in!", time: "20:03", role: "member", color: "#ff6b00" },
  { id: 4, user: "NairobiGamer", text: "Been watching since day 1, bro! Keep it up 🙌", time: "20:04", role: "sub", color: "#9147ff" },
  { id: 5, user: "KenyanGamer254", text: "PUBG Classic is June 22nd — register on the Tournaments page!", time: "20:05", role: "admin", color: "#00ff88" },
  { id: 6, user: "FootballFreak", text: "eFootball Mobile tips were 🔥 last stream", time: "20:06", role: "member", color: "#e8f4ff" },
];

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
  admin: { label: "ADMIN", color: "#00ff88" },
  sub: { label: "SUB", color: "#9147ff" },
  member: { label: "MEMBER", color: "#00d4ff" },
  guest: { label: "GUEST", color: "#8a9bb5" },
};

const CHANNELS = [
  { name: "general", Icon: Hash, active: true },
  { name: "tournaments", Icon: Trophy, active: false },
  { name: "efootball", Icon: Gamepad2, active: false },
  { name: "pubg", Icon: Gamepad2, active: false },
  { name: "mods-only", Icon: Shield, active: false },
];

const ONLINE_USERS = [
  { name: "KenyanGamer254", role: "admin" }, { name: "EagleFC254", role: "sub" },
  { name: "PUBGKingKE", role: "member" }, { name: "NairobiGamer", role: "sub" },
  { name: "FootballFreak", role: "member" }, { name: "Gamer_Ke01", role: "guest" },
  { name: "TopShot254", role: "member" }, { name: "EliteSquad", role: "sub" },
];

const EMOJIS = ["🔥", "🎮", "🏆", "👑", "💥", "🙌", "🇰🇪", "⚽", "🎯", "😂", "👏", "💪"];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [channel, setChannel] = useState("general");
  const [showEmoji, setShowEmoji] = useState(false);
  const [onlineCount] = useState(ONLINE_USERS.length);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    if (!joined) return;
    const BOTS = [
      { user: "Gamer_Ke01", text: "Let's gooo!! 🔥", role: "guest" as const, color: "#8a9bb5" },
      { user: "TopShot254", text: "KG's passes are unreal 😂", role: "member" as const, color: "#e8f4ff" },
      { user: "EliteSquad", text: "Next tourney registration open yet?", role: "sub" as const, color: "#9147ff" },
    ];
    const interval = setInterval(() => {
      const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
      setMessages(prev => [...prev, {
        id: Date.now(),
        ...bot,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      }]);
    }, 8000);
    return () => clearInterval(interval);
  }, [joined]);

  const sendMessage = () => {
    if (!input.trim() || !joined) return;
    const msg: Message = {
      id: Date.now(),
      user: username || "Guest",
      text: input,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      role: "guest",
      color: "#8a9bb5",
    };
    setMessages(prev => [...prev, msg]);
    setInput("");
    setShowEmoji(false);
  };

  if (!joined) {
    return (
      <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="game-card" style={{ padding: "2.5rem", maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }} className="pulse-green">
            <MessageSquare size={28} color="#00ff88" />
          </div>
          <h2 style={{ fontFamily: "Orbitron, monospace", fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.5rem", color: "#e8f4ff" }}>Join Live Chat</h2>
          <p style={{ color: "#8a9bb5", fontSize: "0.95rem", marginBottom: "2rem" }}>Enter a username to join the K.G 254 community chat.</p>
          <input
            className="game-input"
            placeholder="Your gamertag (e.g. EagleFC254)"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && username.trim() && setJoined(true)}
            style={{ marginBottom: "1rem" }}
          />
          <button className="btn-primary" style={{ width: "100%" }} onClick={() => username.trim() && setJoined(true)}>
            Enter Chat
          </button>
          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#8a9bb5", fontSize: "0.85rem" }}>
            <div className="live-dot" style={{ width: 6, height: 6 }} />
            {onlineCount} users online now
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 64, height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar — channels */}
        <div style={{ width: 200, background: "#080f1a", borderRight: "1px solid #1a2840", display: "flex", flexDirection: "column", flexShrink: 0 }} className="sidebar-desktop">
          <div style={{ padding: "1rem", borderBottom: "1px solid #1a2840" }}>
            <div style={{ fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: "0.8rem", color: "#00ff88" }}>K.G 254</div>
            <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.65rem", color: "#8a9bb5", marginTop: 2 }}>COMMUNITY</div>
          </div>
          <div style={{ padding: "0.75rem 0.5rem" }}>
            <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.65rem", color: "#8a9bb5", padding: "0 0.5rem", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>CHANNELS</div>
            {CHANNELS.map(ch => (
              <button key={ch.name} onClick={() => setChannel(ch.name)}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", width: "100%", padding: "0.4rem 0.5rem", background: channel === ch.name ? "rgba(0,255,136,0.1)" : "none", border: "none", color: channel === ch.name ? "#00ff88" : "#8a9bb5", cursor: "pointer", fontSize: "0.9rem", fontFamily: "Rajdhani, sans-serif", transition: "all 0.15s", borderLeft: channel === ch.name ? "2px solid #00ff88" : "2px solid transparent" }}>
                <ch.Icon size={14} /> #{ch.name}
              </button>
            ))}
          </div>
          <div style={{ padding: "0.75rem 0.5rem", borderTop: "1px solid #1a2840", marginTop: "auto" }}>
            <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.65rem", color: "#8a9bb5", padding: "0 0.5rem", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>ONLINE — {onlineCount}</div>
            {ONLINE_USERS.slice(0, 5).map(u => (
              <div key={u.name} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.5rem" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", flexShrink: 0 }} />
                <span style={{ fontSize: "0.8rem", color: "#8a9bb5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Channel header */}
          <div style={{ background: "#040810", borderBottom: "1px solid #1a2840", padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Hash size={16} color="#00ff88" />
            <span style={{ fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: "0.9rem", color: "#e8f4ff" }}>{channel}</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#8a9bb5" }}>
              <div className="live-dot" style={{ width: 6, height: 6 }} />
              {onlineCount} online
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.1rem" }} className="scrollbar-hide">
            {messages.map(msg => {
              const badge = ROLE_BADGES[msg.role];
              return (
                <div key={msg.id} style={{ display: "flex", gap: "0.75rem", padding: "0.4rem 0.5rem", borderRadius: 2, transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ width: 32, height: 32, background: `${msg.color}20`, border: `1px solid ${msg.color}40`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: "0.65rem", color: msg.color }}>
                    {msg.user[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: 2 }}>
                      <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: msg.color }}>{msg.user}</span>
                      <span style={{ background: `${badge.color}20`, color: badge.color, fontFamily: "Share Tech Mono, monospace", fontSize: "0.58rem", padding: "1px 5px", border: `1px solid ${badge.color}40` }}>{badge.label}</span>
                      <span style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.7rem", color: "#8a9bb5" }}>{msg.time}</span>
                    </div>
                    <div style={{ color: "#c8d8e8", fontSize: "0.95rem", lineHeight: 1.5 }}>{msg.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ background: "#040810", borderTop: "1px solid #1a2840", padding: "0.75rem 1.25rem" }}>
            {showEmoji && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem", background: "#080f1a", border: "1px solid #1a2840", padding: "0.5rem" }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setInput(p => p + e)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", padding: "0.2rem" }}>{e}</button>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button onClick={() => setShowEmoji(p => !p)} style={{ background: "none", border: "none", color: "#8a9bb5", cursor: "pointer", padding: "0.4rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#00ff88")}
                onMouseLeave={e => (e.currentTarget.style.color = "#8a9bb5")}>
                <Smile size={18} />
              </button>
              <input
                className="game-input"
                style={{ flex: 1 }}
                placeholder={`Message #${channel} as ${username}…`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage} className="btn-primary" style={{ padding: "0.75rem 1rem", flexShrink: 0 }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar — online users */}
        <div style={{ width: 180, background: "#080f1a", borderLeft: "1px solid #1a2840", padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem", flexShrink: 0 }} className="sidebar-desktop">
          <div style={{ fontFamily: "Share Tech Mono, monospace", fontSize: "0.65rem", color: "#8a9bb5", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>ONLINE — {onlineCount}</div>
          {ONLINE_USERS.map(u => {
            const badge = ROLE_BADGES[u.role];
            return (
              <div key={u.name} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#e8f4ff", fontFamily: "Rajdhani, sans-serif", fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: "0.6rem", color: badge.color, fontFamily: "Share Tech Mono, monospace" }}>{badge.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) { .sidebar-desktop { display: none !important; } }
      `}</style>
    </div>
  );
}
