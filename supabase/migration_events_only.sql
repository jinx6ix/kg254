-- Minimal migration: just adds image/carousel fields to existing events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS game TEXT NOT NULL DEFAULT 'Other';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS prize TEXT NOT NULL DEFAULT '';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS spots INTEGER NOT NULL DEFAULT 16;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'upcoming';

-- RLS for events (in case table already exists without it)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read events" ON public.events;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (event_status = 'published');
DROP POLICY IF EXISTS "Service role events" ON public.events;
CREATE POLICY "Service role events" ON public.events USING (auth.role() = 'service_role');

-- Seed events for hero carousel
INSERT INTO public.events (title, date, time, location, category, description, event_status, rsvps, image_url, game, prize, spots, event_type) VALUES
  ('eFootball Spring Cup 2025', '2025-06-15', '2:00 PM EAT', 'Online — Discord Bracket', 'Tournament', 'Kenya biggest eFootball mobile tournament. Open to all skill levels.', 'published', 156, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&h=900&fit=crop', 'eFootball Mobile', 'KSh 50,000', 16, 'upcoming'),
  ('PUBG Nairobi Classic', '2025-06-22', '3:00 PM EAT', 'Online — Custom Lobby', 'Tournament', 'Squad tournament. 5 matches on Erangel and Miramar. Top 3 squads win prizes.', 'published', 89, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1600&h=900&fit=crop', 'PUBG Mobile', 'KSh 30,000', 20, 'upcoming'),
  ('PTK AFRICA Weekly Clash #13', '2025-06-29', '4:00 PM EAT', 'Online — PS5', 'Tournament', 'Weekly console tournament. Open to all skill levels.', 'published', 45, 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1600&h=900&fit=crop', 'eFootball Console', 'KSh 10,000', 12, 'upcoming'),
  ('PUBG Legends Invitational', '2025-07-05', '3:00 PM EAT', 'Online — Custom Lobby', 'Tournament', 'The biggest PUBG tournament on PTK AFRICA. 24-player Trio event.', 'published', 95, 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=1600&h=900&fit=crop', 'PUBG PC', 'KSh 100,000', 24, 'upcoming'),
  ('PTK AFRICA Community Stream Night', '2025-07-10', '8:00 PM EAT', 'Online — Twitch & YouTube', 'Stream', 'Join us for a special community stream night with viewer games, challenges and giveaways.', 'published', 312, 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1600&h=900&fit=crop', 'Other', '', 100, 'upcoming')
ON CONFLICT DO NOTHING;