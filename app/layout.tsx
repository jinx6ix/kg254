import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KenyanGamer254 | K.G 254 - Gaming Hub",
  description: "Official hub for KenyanGamer254 — tournaments, streams, events, eFootball, PUBG and more.",
  keywords: "KenyanGamer254, KG254, Kenya gaming, eFootball, PUBG, Kenyan gamer, gaming tournaments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
