-- Run this in your Supabase SQL Editor

CREATE TABLE public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  "originalPrice" numeric,
  description text,
  "sizeCategory" text,
  dimensions text,
  images text[],
  "isPinned" boolean DEFAULT false,
  "preorderInfo" jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.products FOR SELECT
  USING ( true );

-- Allow public insert (For testing purposes. Secure this in production!)
CREATE POLICY "Public can insert"
  ON public.products FOR INSERT
  WITH CHECK ( true );

CREATE POLICY "Public can update"
  ON public.products FOR UPDATE
  USING ( true );

CREATE POLICY "Public can delete"
  ON public.products FOR DELETE
  USING ( true );
