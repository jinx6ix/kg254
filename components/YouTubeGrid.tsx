"use client";
import { useState, useEffect } from "react";
import { Play, ExternalLink, Eye, Clock, Video, AlertCircle } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  videoUrl: string;
}

export default function YouTubeGrid() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/youtube");
        const data = await res.json();

        if (res.ok) {
          setVideos(data.videos);
        } else {
          setError(data.error || "Failed to load videos");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="game-card" style={{ overflow: "hidden" }}>
            <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #0d1826, #080f1a)", animation: "pulse-green 2s infinite" }} />
            <div style={{ padding: "1rem" }}>
              <div style={{ height: 16, background: "#1a2840", borderRadius: 2, marginBottom: 8, width: "80%" }} />
              <div style={{ height: 12, background: "#1a2840", borderRadius: 2, width: "50%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", background: "rgba(255,34,68,0.05)", border: "1px solid rgba(255,34,68,0.2)", borderRadius: 4 }}>
        <AlertCircle size={40} color="#ff2244" style={{ margin: "0 auto 1rem" }} />
        <div style={{ fontFamily: "Orbitron, monospace", color: "#ff2244", marginBottom: "0.5rem" }}>YouTube Not Connected</div>
        <div style={{ color: "#8a9bb5", fontSize: "0.9rem", marginBottom: "1.5rem", maxWidth: 400, margin: "0 auto 1.5rem" }}>{error}</div>
        <div style={{ background: "#0d1826", border: "1px solid #1a2840", padding: "1.5rem", textAlign: "left", maxWidth: 500, margin: "0 auto", fontFamily: "Share Tech Mono, monospace", fontSize: "0.75rem", color: "#8a9bb5" }}>
          <div style={{ color: "#00ff88", marginBottom: "0.5rem" }}>// SETUP YOUTUBE API</div>
          <div style={{ marginBottom: "0.3rem" }}>1. Go to console.cloud.google.com</div>
          <div style={{ marginBottom: "0.3rem" }}>2. Create a project and enable YouTube Data API v3</div>
          <div style={{ marginBottom: "0.3rem" }}>3. Create API credentials (API Key)</div>
          <div style={{ marginBottom: "0.3rem" }}>4. Get your Channel ID from YouTube</div>
          <div style={{ marginBottom: "0.5rem" }}>5. Add to .env.local:</div>
          <code style={{ color: "#00d4ff", display: "block", background: "rgba(0,0,0,0.3)", padding: "0.5rem" }}>
            YOUTUBE_API_KEY=your_api_key<br />
            YOUTUBE_CHANNEL_ID=your_channel_id
          </code>
        </div>
        <a href="https://www.youtube.com/@PTKAfrica" target="_blank" rel="noopener noreferrer"
          className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <Video size={14} /> Watch on YouTube
        </a>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <Video size={40} color="#8a9bb5" style={{ margin: "0 auto 1rem" }} />
        <div style={{ color: "#8a9bb5" }}>No videos found</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {videos.map((video) => (
          <div
            key={video.id}
            className="game-card"
            style={{ overflow: "hidden", cursor: "pointer" }}
            onClick={() => setSelectedVideo(video)}
          >
            <div style={{ aspectRatio: "16/9", position: "relative", overflow: "hidden" }}>
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
                <div style={{ width: 50, height: 50, background: "rgba(0,255,136,0.9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                  <Play size={22} color="#040810" style={{ marginLeft: 3 }} />
                </div>
              </div>
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                <span style={{ background: "rgba(255,34,68,0.9)", color: "#fff", fontFamily: "Share Tech Mono, monospace", fontSize: "0.6rem", padding: "2px 6px", borderRadius: 2 }}>
                  YouTube
                </span>
              </div>
            </div>
            <div style={{ padding: "1rem" }}>
              <h3 style={{ fontFamily: "Orbitron, monospace", fontSize: "0.82rem", color: "#e8f4ff", marginBottom: "0.5rem", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {video.title}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#8a9bb5", fontSize: "0.8rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={12} /> {formatDate(video.publishedAt)}
                </span>
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: "#00d4ff", display: "flex", alignItems: "center", gap: 4, textDecoration: "none", fontSize: "0.75rem" }}
                >
                  <ExternalLink size={11} /> Watch
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
          onClick={() => setSelectedVideo(null)}
        >
          <div style={{ width: "100%", maxWidth: 900 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ aspectRatio: "16/9", background: "#000" }}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ background: "#0d1826", padding: "1.5rem", border: "1px solid #1a2840" }}>
              <h3 style={{ fontFamily: "Orbitron, monospace", fontSize: "1rem", color: "#e8f4ff", marginBottom: "0.5rem" }}>{selectedVideo.title}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <span style={{ color: "#8a9bb5", fontSize: "0.85rem" }}>{selectedVideo.channelTitle}</span>
                <a href={selectedVideo.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.7rem" }}>
                  <ExternalLink size={12} style={{ display: "inline", marginRight: 4 }} /> Open on YouTube
                </a>
              </div>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.5)", border: "1px solid #1a2840", color: "#fff", width: 40, height: 40, cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}