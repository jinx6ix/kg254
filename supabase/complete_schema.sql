-- =====================================================
-- PTK AFRICA — Complete Database Setup
-- Run this in: supabase.com → SQL Editor → New Query
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username    TEXT UNIQUE NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin','subscriber','member')),
  plan        TEXT NOT NULL DEFAULT 'none'   CHECK (plan IN ('admin','elite','pro','basic','none')),
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','banned','suspended')),
  avatar      TEXT NOT NULL DEFAULT '',
  bio         TEXT NOT NULL DEFAULT '',
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── POSTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  game        TEXT NOT NULL DEFAULT 'General',
  likes       INTEGER NOT NULL DEFAULT 0,
  comments    INTEGER NOT NULL DEFAULT 0,
  post_status TEXT NOT NULL DEFAULT 'published' CHECK (post_status IN ('published','flagged','deleted','draft')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.post_likes (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, post_id)
);

-- ── COMMENTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── CHAT MESSAGES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  channel     TEXT NOT NULL DEFAULT 'general',
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── TOURNAMENTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tournaments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  game        TEXT NOT NULL,
  date        DATE NOT NULL,
  prize       TEXT NOT NULL,
  spots       INTEGER NOT NULL DEFAULT 16,
  format      TEXT NOT NULL DEFAULT '1v1 Knockout',
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','live','upcoming','ended')),
  description TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, tournament_id)
);

-- ── EVENTS (with hero carousel fields) ────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  date         DATE NOT NULL,
  time         TEXT NOT NULL DEFAULT 'TBD',
  location     TEXT NOT NULL DEFAULT 'Online',
  category     TEXT NOT NULL DEFAULT 'Stream',
  description  TEXT NOT NULL DEFAULT '',
  event_status TEXT NOT NULL DEFAULT 'published' CHECK (event_status IN ('published','draft','cancelled')),
  rsvps        INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_url    TEXT NOT NULL DEFAULT '',
  game         TEXT NOT NULL DEFAULT 'Other',
  prize        TEXT NOT NULL DEFAULT '',
  spots        INTEGER NOT NULL DEFAULT 16,
  event_type   TEXT NOT NULL DEFAULT 'upcoming' CHECK (event_type IN ('upcoming', 'live'))
);

CREATE TABLE IF NOT EXISTS public.event_rsvps (
  user_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, event_id)
);

-- ── SUBSCRIPTIONS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  plan         TEXT NOT NULL,
  amount       TEXT NOT NULL,
  sub_status   TEXT NOT NULL DEFAULT 'pending' CHECK (sub_status IN ('active','pending','cancelled','expired')),
  mpesa        TEXT NOT NULL DEFAULT '',
  start_date   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_billing DATE NOT NULL
);

-- ── STREAMS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.streams (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  platform   TEXT NOT NULL DEFAULT 'YouTube',
  game       TEXT NOT NULL DEFAULT 'General',
  type       TEXT NOT NULL DEFAULT 'vod',
  is_live    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY (RLS) ─────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read users"   ON public.users FOR SELECT USING (true);
CREATE POLICY "Service role all"    ON public.users USING (auth.role() = 'service_role');

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read posts"   ON public.posts FOR SELECT USING (post_status = 'published' OR post_status = 'flagged');
CREATE POLICY "Auth insert posts"   ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role posts"  ON public.posts USING (auth.role() = 'service_role');

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read likes"   ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Auth manage likes"   ON public.post_likes FOR ALL USING (true);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read comments"  ON public.comments FOR SELECT USING (true);
CREATE POLICY "Auth insert comments"  ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role comments" ON public.comments USING (auth.role() = 'service_role');

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read chat"    ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Auth insert chat"    ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role chat"   ON public.chat_messages USING (auth.role() = 'service_role');

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tourneys"  ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Service role tourneys" ON public.tournaments USING (auth.role() = 'service_role');

ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read regs"    ON public.tournament_registrations FOR SELECT USING (true);
CREATE POLICY "Auth insert regs"    ON public.tournament_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth delete regs"    ON public.tournament_registrations FOR DELETE USING (true);
CREATE POLICY "Service role regs"   ON public.tournament_registrations USING (auth.role() = 'service_role');

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events"  ON public.events FOR SELECT USING (event_status = 'published');
CREATE POLICY "Service role events" ON public.events USING (auth.role() = 'service_role');

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read rsvps"   ON public.event_rsvps FOR SELECT USING (true);
CREATE POLICY "Auth manage rsvps"   ON public.event_rsvps FOR ALL USING (true);
CREATE POLICY "Service role rsvps"  ON public.event_rsvps USING (auth.role() = 'service_role');

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role subs"   ON public.subscriptions USING (auth.role() = 'service_role');

ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read streams"   ON public.streams FOR SELECT USING (true);
CREATE POLICY "Service role streams"  ON public.streams USING (auth.role() = 'service_role');

-- ── REALTIME ──────────────────────────────────────────
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER TABLE public.posts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- ── SEED DATA ─────────────────────────────────────────
INSERT INTO public.users (username, email, password, role, plan, status, avatar, bio)
VALUES ('PTK Africa', 'admin@example.com', 'admin_password_hash', 'admin', 'admin', 'active', '', '')
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, date, time, location, category, description, event_status, rsvps, image_url, game, prize, spots, event_type) VALUES
  ('eFootball Spring Cup 2025', '2025-06-15', '2:00 PM EAT', 'Online — Discord Bracket', 'Tournament', 'Kenya biggest eFootball mobile tournament. Open to all skill levels.', 'published', 156, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&h=900&fit=crop', 'eFootball Mobile', 'KSh 50,000', 16, 'upcoming'),
  ('PUBG Nairobi Classic', '2025-06-22', '3:00 PM EAT', 'Online — Custom Lobby', 'Tournament', 'Squad tournament. 5 matches on Erangel and Miramar. Top 3 squads win prizes.', 'published', 89, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1600&h=900&fit=crop', 'PUBG Mobile', 'KSh 30,000', 20, 'upcoming'),
  ('PTK AFRICA Weekly Clash #13', '2025-06-29', '4:00 PM EAT', 'Online — PS5', 'Tournament', 'Weekly console tournament. Open to all skill levels. Watch live on Twitch.', 'published', 45, 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1600&h=900&fit=crop', 'eFootball Console', 'KSh 10,000', 12, 'upcoming'),
  ('PUBG Legends Invitational', '2025-07-05', '3:00 PM EAT', 'Online — Custom Lobby', 'Tournament', 'The biggest PUBG tournament on PTK AFRICA. 24-player Trio event. Full stream.', 'published', 95, 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=1600&h=900&fit=crop', 'PUBG PC', 'KSh 100,000', 24, 'upcoming'),
  ('PTK AFRICA Community Stream Night', '2025-07-10', '8:00 PM EAT', 'Online — Twitch & YouTube', 'Stream', 'Join us for a special community stream night with viewer games, challenges and giveaways.', 'published', 312, 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1600&h=900&fit=crop', 'Other', '', 100, 'upcoming')
ON CONFLICT DO NOTHING;