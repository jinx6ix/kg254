-- =====================================================
-- Safe Column-by-Column Migration
-- Adds only missing columns - safe to run multiple times
-- =====================================================

-- ── USERS: Add missing columns ────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username') THEN
    ALTER TABLE public.users ADD COLUMN username TEXT UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email') THEN
    ALTER TABLE public.users ADD COLUMN email TEXT UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password') THEN
    ALTER TABLE public.users ADD COLUMN password TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE public.users ADD COLUMN role TEXT NOT NULL DEFAULT 'member';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'plan') THEN
    ALTER TABLE public.users ADD COLUMN plan TEXT NOT NULL DEFAULT 'none';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
    ALTER TABLE public.users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar') THEN
    ALTER TABLE public.users ADD COLUMN avatar TEXT NOT NULL DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
    ALTER TABLE public.users ADD COLUMN bio TEXT NOT NULL DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'joined_at') THEN
    ALTER TABLE public.users ADD COLUMN joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_seen') THEN
    ALTER TABLE public.users ADD COLUMN last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- ── EVENTS: Add carousel & new admin fields ───────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'image_url') THEN
    ALTER TABLE public.events ADD COLUMN image_url TEXT NOT NULL DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'game') THEN
    ALTER TABLE public.events ADD COLUMN game TEXT NOT NULL DEFAULT 'Other';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'prize') THEN
    ALTER TABLE public.events ADD COLUMN prize TEXT NOT NULL DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'spots') THEN
    ALTER TABLE public.events ADD COLUMN spots INTEGER NOT NULL DEFAULT 16;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'event_type') THEN
    ALTER TABLE public.events ADD COLUMN event_type TEXT NOT NULL DEFAULT 'upcoming';
  END IF;
  
  -- Add CHECK constraint if not exists (ignore errors)
  ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_event_type_check;
  ALTER TABLE public.events ADD CONSTRAINT events_event_type_check CHECK (event_type IN ('upcoming', 'live'));
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Constraint already exists or other error: %', SQLERRM;
END $$;

-- ── Add CHECK constraints if not exist ────────────────
DO $$
BEGIN
  ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
  ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('admin','subscriber','member'));
EXCEPTION WHEN OTHERS THEN END $$;

DO $$
BEGIN
  ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_plan_check;
  ALTER TABLE public.users ADD CONSTRAINT users_plan_check CHECK (plan IN ('admin','elite','pro','basic','none'));
EXCEPTION WHEN OTHERS THEN END $$;

DO $$
BEGIN
  ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_status_check;
  ALTER TABLE public.users ADD CONSTRAINT users_status_check CHECK (status IN ('active','banned','suspended'));
EXCEPTION WHEN OTHERS THEN END $$;

-- ── EVENTS: Ensure RLS and seed data ─────────────────
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read events" ON public.events;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (event_status = 'published');

DROP POLICY IF EXISTS "Service role events" ON public.events;
CREATE POLICY "Service role events" ON public.events USING (auth.role() = 'service_role');

-- ── SEED DATA: Insert events with images ──────────────
INSERT INTO public.events (title, date, time, location, category, description, event_status, rsvps, image_url, game, prize, spots, event_type) VALUES
  ('eFootball Spring Cup 2025', '2025-06-15', '2:00 PM EAT', 'Online — Discord Bracket', 'Tournament', 'Kenya biggest eFootball mobile tournament. Open to all skill levels.', 'published', 156, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&h=900&fit=crop', 'eFootball Mobile', 'KSh 50,000', 16, 'upcoming'),
  ('PUBG Nairobi Classic', '2025-06-22', '3:00 PM EAT', 'Online — Custom Lobby', 'Tournament', 'Squad tournament. 5 matches on Erangel and Miramar. Top 3 squads win prizes.', 'published', 89, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1600&h=900&fit=crop', 'PUBG Mobile', 'KSh 30,000', 20, 'upcoming'),
  ('PTK AFRICA Weekly Clash #13', '2025-06-29', '4:00 PM EAT', 'Online — PS5', 'Tournament', 'Weekly console tournament. Open to all skill levels.', 'published', 45, 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1600&h=900&fit=crop', 'eFootball Console', 'KSh 10,000', 12, 'upcoming'),
  ('PUBG Legends Invitational', '2025-07-05', '3:00 PM EAT', 'Online — Custom Lobby', 'Tournament', 'The biggest PUBG tournament on PTK AFRICA. 24-player Trio event.', 'published', 95, 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=1600&h=900&fit=crop', 'PUBG PC', 'KSh 100,000', 24, 'upcoming'),
  ('PTK AFRICA Community Stream Night', '2025-07-10', '8:00 PM EAT', 'Online — Twitch & YouTube', 'Stream', 'Join us for a special community stream night with viewer games, challenges and giveaways.', 'published', 312, 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1600&h=900&fit=crop', 'Other', '', 100, 'upcoming')
ON CONFLICT DO NOTHING;

-- ── Add admin user if not exists ──────────────────────
INSERT INTO public.users (username, email, password, role, plan, status)
VALUES ('PTK Africa', 'admin@example.com', 'admin_password_hash', 'admin', 'admin', 'active')
ON CONFLICT (username) DO NOTHING;