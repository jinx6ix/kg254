"use client";
import { Toaster as HotToaster } from "react-hot-toast";
export function Toaster() {
  return <HotToaster position="bottom-right" toastOptions={{ style: { background: "#0d1826", color: "#e8f4ff", border: "1px solid #1a2840", fontFamily: "Rajdhani, sans-serif", fontSize: "0.95rem" }, success: { iconTheme: { primary: "#00ff88", secondary: "#040810" } }, error: { iconTheme: { primary: "#ff2244", secondary: "#040810" } } }} />;
}
