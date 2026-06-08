import { NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

export async function GET() {
  try {
    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
      return NextResponse.json(
        { error: "YouTube API not configured. Set YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID in environment variables." },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=12&type=video`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error?.message || "YouTube API error" }, { status: response.status });
    }

    const data = await response.json();

    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    return NextResponse.json({ videos }, { status: 200 });
  } catch (err) {
    console.error("YouTube API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}