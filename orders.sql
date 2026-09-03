-- Tabel Orders untuk menyimpan data pesanan dan keranjang belanja pembeli
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending_payment',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Izinkan akses publik (anon) untuk menambah dan membaca data (karena tidak ada sistem Auth Supabase yang wajib)
CREATE POLICY "Allow public access to orders" 
ON public.orders 
FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);
