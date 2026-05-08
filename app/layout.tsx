import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/Toaster";

export const metadata: Metadata = {
  title: "PTK Africa | K.G 254 - Gaming Hub",
  description: "Official hub for PTK Africa — tournaments, streams, events, eFootball, PUBG and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
