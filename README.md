# KenyanGamer254 — K.G 254 Gaming Hub

Full Next.js website for KenyanGamer254, built with TypeScript and Tailwind CSS.

## Pages
- `/` — Homepage with hero, stats, upcoming events, streaming platforms
- `/streams` — Streams page with live embed area and VOD grid
- `/tournaments` — Tournaments with registration, filters, progress bars
- `/events` — Events with RSVP and social share (Twitter, Facebook, WhatsApp)
- `/community` — Community posts, likes, comments, social sharing
- `/chat` — Live chat with channels, online users, emoji picker
- `/subscribe` — Subscription plans (Supporter/Pro/Elite) with M-Pesa flow

## Setup & Run

```bash
npm install
npm run dev     # development — http://localhost:3000
npm run build   # production build
npm start       # serve production build
```

## Deployment
Deploy on **Vercel** (recommended — free for Next.js):
1. Push to GitHub
2. Connect repo on vercel.com
3. Deploy automatically

Or deploy on **Railway**, **Render**, or any Node.js host.

## Customisation
- Update social links in `components/Navbar.tsx` and `components/Footer.tsx`
- Add real Twitch/YouTube embed URLs in `app/streams/page.tsx`
- Update M-Pesa number in `app/subscribe/page.tsx`
- Add real tournament data in `app/tournaments/page.tsx`

For a real live chat, integrate **Supabase Realtime**, **Firebase**, or **Pusher**.
For real auth, use **NextAuth.js** or **Clerk**.
