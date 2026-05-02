-- Run this in Supabase SQL Editor if you already ran schema.sql
-- Adds the streams table used by the admin Streams tab

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

ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read streams"  ON public.streams FOR SELECT USING (true);
CREATE POLICY "Service role streams" ON public.streams USING (auth.role() = 'service_role');
