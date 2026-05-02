"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User { id: string; username: string; role: string; plan: string; avatar: string; }

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  token: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user || null);
      // Get token from cookie for socket use (stored in localStorage for client access)
      if (data.user) {
        const stored = localStorage.getItem("kg254_token");
        setToken(stored);
      }
    } catch { setUser(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { refreshUser(); }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    const data = await res.json();
    if (data.error) return { error: data.error };
    setUser(data.user);
    // Store raw JWT in localStorage for socket.io client access
    // We re-issue a non-httpOnly token just for socket auth
    const tokenRes = await fetch("/api/auth/token");
    if (tokenRes.ok) { const td = await tokenRes.json(); setToken(td.token); localStorage.setItem("kg254_token", td.token); }
    return {};
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, email, password }) });
    const data = await res.json();
    if (data.error) return { error: data.error };
    setUser(data.user);
    const tokenRes = await fetch("/api/auth/token");
    if (tokenRes.ok) { const td = await tokenRes.json(); setToken(td.token); localStorage.setItem("kg254_token", td.token); }
    return {};
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null); setToken(null);
    localStorage.removeItem("kg254_token");
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, token, refreshUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
