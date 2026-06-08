-- Add image_url column to events table for hero carousel images
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';

-- Add game field to events so carousel knows which game the event is for
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS game TEXT NOT NULL DEFAULT 'Other';

-- Add prize field to events
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS prize TEXT NOT NULL DEFAULT '';

-- Add spots field to events
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS spots INTEGER NOT NULL DEFAULT 16;

-- Add event_type field to distinguish between upcoming/live
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'upcoming' CHECK (event_type IN ('upcoming', 'live'));

-- Update RLS policy to allow public read of events with image_url
DROP POLICY IF EXISTS "Public read events" ON public.events;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (event_status = 'published');

-- Create index for faster queries on upcoming events
CREATE INDEX IF NOT EXISTS idx_events_status_date ON public.events(event_status, date);
CREATE INDEX IF NOT EXISTS idx_events_game ON public.events(game);

-- Update seed data to include images and game info
UPDATE public.events SET
  image_url = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&h=900&fit=crop',
  game = 'eFootball Mobile',
  prize = 'KSh 50,000',
  spots = 16,
  event_type = 'upcoming'
WHERE title ILIKE '%efootball%';

UPDATE public.events SET
  image_url = 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1600&h=900&fit=crop',
  game = 'PUBG Mobile',
  prize = 'KSh 30,000',
  spots = 20,
  event_type = 'upcoming'
WHERE title ILIKE '%pubg%' AND title NOT ILIKE '%pc%';

UPDATE public.events SET
  image_url = 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1600&h=900&fit=crop',
  game = 'eFootball Console',
  prize = 'KSh 5,000',
  spots = 8,
  event_type = 'live'
WHERE title ILIKE '%weekly%';

UPDATE public.events SET
  image_url = 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0e?w=1600&h=900&fit=crop',
  game = 'PUBG PC',
  prize = 'KSh 100,000',
  spots = 24,
  event_type = 'upcoming'
WHERE title ILIKE '%legends%' OR title ILIKE '%invitational%';

UPDATE public.events SET
  image_url = 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1600&h=900&fit=crop',
  game = 'Other',
  prize = '',
  spots = 100,
  event_type = 'upcoming'
WHERE image_url = '';