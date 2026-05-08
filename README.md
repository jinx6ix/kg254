# PTK Africa — PTK 254 Gaming Hub
**Next.js 15 · Supabase PostgreSQL + Realtime · Vercel Ready**

---

## ⚡ Setup in 5 Steps

### 1 — Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → New project
2. Open **SQL Editor** → paste the entire contents of `supabase/schema.sql` → **Run**
3. Go to **Settings → API** and copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (under "Secret" — keep private)

### 2 — Set Environment Variables
```bash
cp .env.example .env.local
# Fill in your Supabase keys + set a strong JWT_SECRET
```

### 3 — Create Your Admin Account
After deploying, register at `/register` with username **PTK Africa**.
Then run this in Supabase SQL Editor to make yourself admin:
```sql
UPDATE public.users
SET role = 'admin', plan = 'admin'
WHERE username = 'PTK Africa';
```

### 4 — Deploy to Vercel
```bash
# Push to GitHub, then:
vercel
# Add all .env.local variables in Vercel → Settings → Environment Variables
```

### 5 — Run Locally
```bash
npm install
npm run dev   # http://localhost:3000
```

---

## 🗂 Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/register` | Create free account |
| `/login` | Login |
| `/profile` | Your profile + bio + posts |
| `/streams` | Live embed + VOD grid |
| `/tournaments` | Register for tournaments |
| `/events` | RSVP + share to social |
| `/community` | Posts, likes, comments (live) |
| `/chat` | **Real-time chat — Supabase Realtime** |
| `/subscribe` | M-Pesa subscription tiers |
| `/admin` | Full admin panel |

---

## 🔑 Admin Panel (`/admin`)

Login with your admin account, then enter the admin password (set in `ADMIN_PASSWORD` env var, default: `KG254Admin!`).

**What you can control:**
- 👥 Users — view all, edit role/plan/status, ban, delete
- 📝 Posts — approve flagged, delete any post
- 💳 Subscriptions — approve pending M-Pesa payments, cancel
- 🏆 Tournaments — create, edit, delete, change status
- 📅 Events — create, edit, publish/draft/cancel
- 📊 Live stats dashboard

---

## 💬 Real-Time Chat (Supabase Realtime)

- Messages saved to `chat_messages` table in Supabase PostgreSQL
- **Supabase Realtime** broadcasts new messages instantly to all connected clients via WebSocket
- Optimistic UI — your message appears instantly, confirmed when DB write completes
- Presence tracking for online count
- Channels: `#general`, `#tournaments`, `#efootball`, `#pubg`, `#mods-only` (admin only)
- Role + plan badges on every message
- Guests can view but must register to send

---

## 🌐 Vercel Environment Variables

Add these in **Vercel → Project → Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Settings → API (secret) |
| `JWT_SECRET` | Any long random string |
| `ADMIN_PASSWORD` | Your chosen admin panel password |
| `NEXT_PUBLIC_APP_URL` | `https://your-vercel-domain.vercel.app` |

---

## 💳 M-Pesa Subscription Flow

1. User picks plan on `/subscribe` and submits M-Pesa number
2. Subscription saved as `pending` in Supabase
3. User sends payment manually to KG254's M-Pesa
4. **Admin** goes to `/admin → Subscriptions` and clicks **Approve**
5. Subscription activates → user role becomes `subscriber` automatically

To automate: integrate [Safaricom Daraja STK Push API](https://developer.safaricom.co.ke/) and add a webhook at `/api/mpesa/callback`.

---

Built with 🎮 for **PTK Africa — PTK 254** · Nairobi, Kenya 🇰🇪
