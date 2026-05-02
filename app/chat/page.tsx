"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Hash, Users, Shield, Gamepad2, Trophy, MessageSquare, Smile, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createBrowserClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

type ChatMessage = {
  id: string; message: string; channel: string; created_at: string;
  username: string; role: string; plan: string; avatar: string;
};

const CHANNELS = [
  { name: "general",     Icon: Hash,      label: "General" },
  { name: "tournaments", Icon: Trophy,    label: "Tournaments" },
  { name: "efootball",   Icon: Gamepad2,  label: "eFootball" },
  { name: "pubg",        Icon: Gamepad2,  label: "PUBG" },
];
const ROLE_COLORS: Record<string, string>  = { admin: "#00ff88", subscriber: "#9147ff", member: "#00d4ff", guest: "#8a9bb5" };
const ROLE_LABELS: Record<string, string>  = { admin: "ADMIN", subscriber: "SUB", member: "MEMBER", guest: "GUEST" };
const PLAN_COLORS: Record<string, string>  = { admin: "#00ff88", elite: "#ff6b00", pro: "#9147ff", basic: "#00d4ff" };
const EMOJIS = ["🔥","🎮","🏆","👑","💥","🙌","🇰🇪","⚽","🎯","😂","👏","💪","🤣","😎","🥇","⚡"];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages]         = useState<ChatMessage[]>([]);
  const [input, setInput]               = useState("");
  const [channel, setChannel]           = useState("general");
  const [showEmoji, setShowEmoji]       = useState(false);
  const [onlineCount, setOnlineCount]   = useState(0);
  const [channelCount, setChannelCount] = useState(0);
  const [typingUsers, setTypingUsers]   = useState<string[]>([]);
  const [loadingHistory, setLoading]    = useState(true);
  const [sending, setSending]           = useState(false);
  const bottomRef    = useRef<HTMLDivElement>(null);
  const typingTimer  = useRef<NodeJS.Timeout | null>(null);
  const supabase     = createBrowserClient();

  // Scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Load chat history
  const loadHistory = useCallback(async (ch: string) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/chat/history?channel=${ch}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch { setMessages([]); }
    finally { setLoading(false); }
  }, []);

  // Subscribe to Supabase Realtime for new messages
  useEffect(() => {
    loadHistory(channel);

    const subscription = supabase
      .channel(`chat:${channel}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `channel=eq.${channel}` },
        async (payload) => {
          // Fetch the full message with user join
          const { data } = await supabase
            .from("chat_messages")
            .select("id, message, channel, created_at, users!user_id(username, role, plan, avatar)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            const msg: ChatMessage = {
              id:         (data as any).id,
              message:    (data as any).message,
              channel:    (data as any).channel,
              created_at: (data as any).created_at,
              username:   (data as any).users?.username || "Unknown",
              role:       (data as any).users?.role     || "member",
              plan:       (data as any).users?.plan     || "none",
              avatar:     (data as any).users?.avatar   || "?",
            };
            setMessages(prev => {
              // Deduplicate — if we already have this id (from optimistic update) skip
              if (prev.some(m => m.id === msg.id)) return prev;
              return [...prev.slice(-199), msg];
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setOnlineCount(p => p || 1);
      });

    // Presence for online count
    const presenceChannel = supabase.channel("online");
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({ user_id: user?.id || "guest", channel, at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(subscription);
      supabase.removeChannel(presenceChannel);
    };
  }, [channel, user?.id]);

  const switchChannel = (ch: string) => {
    setChannel(ch);
    setMessages([]);
    setTypingUsers([]);
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    if (!user) { toast.error("Login to send messages"); return; }

    const optimisticId = `opt-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: optimisticId, message: input.trim(), channel,
      created_at: new Date().toISOString(),
      username: user.username, role: user.role, plan: user.plan, avatar: user.avatar,
    };

    setMessages(prev => [...prev, optimistic]);
    setInput("");
    setShowEmoji(false);
    setSending(true);

    try {
      const res  = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, message: optimistic.message }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(m => m.id !== optimisticId));
        setInput(optimistic.message);
      } else {
        // Replace optimistic with real message
        setMessages(prev => prev.map(m => m.id === optimisticId ? { ...data } : m));
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimisticId));
      setInput(optimistic.message);
      toast.error("Failed to send message");
    } finally { setSending(false); }
  };

  const currentCh = CHANNELS.find(c => c.name === channel);
  const getTime = (d: string) => { try { return formatDistanceToNow(new Date(d), { addSuffix: true }); } catch { return ""; } };

  return (
    <div style={{ paddingTop: 64, height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left sidebar */}
        <div style={{ width: 220, background: "#080f1a", borderRight: "1px solid #1a2840", display: "flex", flexDirection: "column", flexShrink: 0 }} className="sidebar-lg">
          <div style={{ padding: "1rem", borderBottom: "1px solid #1a2840" }}>
            <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "0.88rem", color: "#00ff88" }}>K.G 254 Chat</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff88" }} className="pulse-green" />
              <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", color: "#00ff88" }}>
                LIVE · {onlineCount} online
              </span>
            </div>
          </div>

          <div style={{ padding: "0.75rem 0.5rem" }}>
            <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.62rem", color: "#8a9bb5", padding: "0 0.5rem", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>CHANNELS</div>
            {CHANNELS.map(ch => (
              <button key={ch.name} onClick={() => switchChannel(ch.name)}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.5rem 0.6rem", background: channel === ch.name ? "rgba(0,255,136,0.08)" : "none", border: "none", color: channel === ch.name ? "#00ff88" : "#8a9bb5", cursor: "pointer", fontSize: "0.9rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, transition: "all 0.15s", borderLeft: channel === ch.name ? "2px solid #00ff88" : "2px solid transparent" }}>
                <ch.Icon size={14} /> #{ch.name}
              </button>
            ))}
            {user?.role === "admin" && (
              <button onClick={() => switchChannel("mods-only")}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.5rem 0.6rem", background: channel === "mods-only" ? "rgba(0,255,136,0.08)" : "none", border: "none", color: channel === "mods-only" ? "#00ff88" : "#8a9bb5", cursor: "pointer", fontSize: "0.9rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, borderLeft: channel === "mods-only" ? "2px solid #00ff88" : "2px solid transparent" }}>
                <Shield size={14} /> #mods-only
              </button>
            )}
          </div>

          {user && (
            <div style={{ marginTop: "auto", borderTop: "1px solid #1a2840", padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${ROLE_COLORS[user.role] || "#8a9bb5"}20`, border: `1px solid ${ROLE_COLORS[user.role] || "#8a9bb5"}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontFamily: "Orbitron,monospace", fontWeight: 900, color: ROLE_COLORS[user.role] || "#8a9bb5", flexShrink: 0 }}>
                {(user.avatar || user.username[0]).slice(0, 2)}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "0.82rem", fontFamily: "Rajdhani,sans-serif", fontWeight: 700, color: ROLE_COLORS[user.role] || "#8a9bb5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.username}</div>
                <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.6rem", color: "#8a9bb5" }}>{ROLE_LABELS[user.role] || "MEMBER"}</div>
              </div>
            </div>
          )}
        </div>

        {/* Main chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: "#040810", borderBottom: "1px solid #1a2840", padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {currentCh && <currentCh.Icon size={16} color="#00ff88" />}
            <span style={{ fontFamily: "Orbitron,monospace", fontWeight: 700, fontSize: "0.88rem", color: "#e8f4ff" }}>#{channel}</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.72rem", color: "#8a9bb5", display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={12} /> {onlineCount} online
              </span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.05rem" }} className="scrollbar-hide">
            {loadingHistory && (
              <div style={{ textAlign: "center", padding: "2rem", color: "#8a9bb5", fontFamily: "Share Tech Mono,monospace", fontSize: "0.8rem" }}>
                Loading messages...
              </div>
            )}
            {!loadingHistory && messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "#8a9bb5" }}>
                <MessageSquare size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                <div style={{ fontFamily: "Orbitron,monospace", fontSize: "0.85rem" }}>No messages yet in #{channel}</div>
                <div style={{ fontSize: "0.85rem", marginTop: 4 }}>Be the first to say something!</div>
              </div>
            )}

            {messages.map((msg, i) => {
              const roleColor  = ROLE_COLORS[msg.role] || "#8a9bb5";
              const planColor  = PLAN_COLORS[msg.plan] || "";
              const prevMsg    = messages[i - 1];
              const grouped    = prevMsg && prevMsg.username === msg.username &&
                (new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime()) < 120000;
              const isOptimistic = msg.id.startsWith("opt-");

              return (
                <div key={msg.id}
                  style={{ display: "flex", gap: "0.75rem", padding: grouped ? "0.1rem 0.5rem" : "0.5rem 0.5rem 0.1rem", borderRadius: 2, opacity: isOptimistic ? 0.6 : 1, transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>

                  {!grouped ? (
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${roleColor}15`, border: `1px solid ${roleColor}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "0.7rem", color: roleColor }}>
                      {(msg.avatar || msg.username?.[0] || "?").slice(0, 2).toUpperCase()}
                    </div>
                  ) : (
                    <div style={{ width: 36, flexShrink: 0 }} />
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {!grouped && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: 2, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: "0.9rem", color: roleColor }}>{msg.username}</span>
                        <span style={{ background: `${roleColor}15`, color: roleColor, fontFamily: "Share Tech Mono,monospace", fontSize: "0.57rem", padding: "1px 5px", border: `1px solid ${roleColor}30` }}>{ROLE_LABELS[msg.role] || "MEMBER"}</span>
                        {msg.plan && msg.plan !== "none" && planColor && (
                          <span style={{ background: `${planColor}15`, color: planColor, fontFamily: "Share Tech Mono,monospace", fontSize: "0.57rem", padding: "1px 5px", border: `1px solid ${planColor}30`, textTransform: "uppercase" }}>{msg.plan}</span>
                        )}
                        <span style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.67rem", color: "#8a9bb5" }}>{getTime(msg.created_at)}</span>
                      </div>
                    )}
                    <div style={{ color: "#c8d8e8", fontSize: "0.95rem", lineHeight: 1.5, wordBreak: "break-word" }}>{msg.message}</div>
                  </div>
                </div>
              );
            })}

            {typingUsers.length > 0 && (
              <div style={{ padding: "0.25rem 0.5rem 0.25rem 52px", color: "#8a9bb5", fontSize: "0.82rem", fontStyle: "italic" }}>
                {typingUsers.slice(0, 3).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ background: "#040810", borderTop: "1px solid #1a2840", padding: "0.75rem 1.25rem" }}>
            {showEmoji && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.75rem", background: "#0d1826", border: "1px solid #1a2840", padding: "0.6rem" }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setInput(p => p + e)}
                    style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", padding: "0.2rem", transition: "transform 0.1s" }}
                    onMouseEnter={ev => ((ev.currentTarget as HTMLElement).style.transform = "scale(1.3)")}
                    onMouseLeave={ev => ((ev.currentTarget as HTMLElement).style.transform = "scale(1)")}>
                    {e}
                  </button>
                ))}
              </div>
            )}

            {!user ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "0.6rem", background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.1)" }}>
                <span style={{ color: "#8a9bb5", fontSize: "0.9rem" }}>You're browsing as a guest —</span>
                <Link href="/login" style={{ color: "#00ff88", fontFamily: "Orbitron,monospace", fontSize: "0.76rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  <LogIn size={13} /> Login to chat
                </Link>
                <Link href="/register" style={{ color: "#00d4ff", fontFamily: "Orbitron,monospace", fontSize: "0.76rem", textDecoration: "none" }}>Register free</Link>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button onClick={() => setShowEmoji(p => !p)}
                  style={{ background: "none", border: "none", color: showEmoji ? "#00ff88" : "#8a9bb5", cursor: "pointer", padding: "0.4rem", transition: "color 0.2s", flexShrink: 0 }}>
                  <Smile size={20} />
                </button>
                <input
                  className="game-input"
                  style={{ flex: 1 }}
                  placeholder={`Message #${channel}…`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  maxLength={500}
                  disabled={sending}
                />
                <button onClick={sendMessage} className="btn-primary"
                  style={{ padding: "0.75rem 1rem", flexShrink: 0, opacity: (!input.trim() || sending) ? 0.5 : 1 }}
                  disabled={!input.trim() || sending}>
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ width: 180, background: "#080f1a", borderLeft: "1px solid #1a2840", padding: "1rem 0.75rem", overflowY: "auto", flexShrink: 0 }} className="sidebar-lg scrollbar-hide">
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.62rem", color: "#8a9bb5", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>ONLINE</div>
          <div style={{ fontFamily: "Orbitron,monospace", fontWeight: 900, fontSize: "2rem", color: "#00ff88", marginBottom: "1.5rem" }}>{onlineCount}</div>
          <div style={{ fontFamily: "Share Tech Mono,monospace", fontSize: "0.62rem", color: "#8a9bb5", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>RECENT CHATTERS</div>
          {[...new Map(messages.slice().reverse().map(m => [m.username, m])).values()].slice(0, 10).map(m => (
            <div key={m.username} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: ROLE_COLORS[m.role] || "#8a9bb5", flexShrink: 0 }} />
              <div style={{ fontSize: "0.82rem", color: "#e8f4ff", fontFamily: "Rajdhani,sans-serif", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.username}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .sidebar-lg { display: none !important; } }
      `}</style>
    </div>
  );
}
