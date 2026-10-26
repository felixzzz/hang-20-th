-- ============================================================
-- KUANG HANG FO THANG (廣航佛堂 廿週年堂慶)
-- SUPABASE POSTGRESQL SCHEMA MIGRATION & STORAGE POLICIES
-- ============================================================

-- 1. Create table `rsvps` (Buku Doa & Konfirmasi Kehadiran Umat)
CREATE TABLE IF NOT EXISTS public.rsvps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'hadir' CHECK (status IN ('hadir', 'tidak_hadir', 'ragu')),
  guests INTEGER NOT NULL DEFAULT 1 CHECK (guests >= 1),
  message TEXT DEFAULT '',
  timestamp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for chronological ordering
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Allow public read access to rsvps (for displaying wishes on frontend)
CREATE POLICY "Public can view rsvps" ON public.rsvps
  FOR SELECT
  USING (true);

-- Allow public insert access to rsvps (for submitting wishes from invitation)
CREATE POLICY "Public can submit rsvp" ON public.rsvps
  FOR INSERT
  WITH CHECK (true);

-- Allow service role full management (Panitia backend / admin)
CREATE POLICY "Service role full access to rsvps" ON public.rsvps
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- 2. Create table `guests` (Daftar Tamu Undangan Personal)
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Umum',
  phone TEXT DEFAULT '',
  has_opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,
  rsvp_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup by guest name
CREATE INDEX IF NOT EXISTS idx_guests_name ON public.guests (name);

-- Enable Row Level Security (RLS)
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Allow public to update their own opened status by name
CREATE POLICY "Public can update has_opened on guests" ON public.guests
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public read access
CREATE POLICY "Public can read guests" ON public.guests
  FOR SELECT
  USING (true);

-- Allow service role full management (Panitia backend / admin)
CREATE POLICY "Service role full access to guests" ON public.guests
  FOR ALL
  USING (true)
  WITH CHECK (true);


-- 3. Storage Bucket `cms-media` (Foto Sampul, QRIS, Galeri, Sejarah, & Konfigurasi CMS)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: Allow public to view/download media & cms config
CREATE POLICY "Public can read cms-media" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cms-media');

-- Policy: Allow authenticated & service role to upload / modify media & cms config
CREATE POLICY "Service role full access to cms-media" ON storage.objects
  FOR ALL
  USING (bucket_id = 'cms-media')
  WITH CHECK (bucket_id = 'cms-media');
