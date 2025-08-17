-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table stores platform users
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'seller',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Categories table defines product categories (e.g. ביטוח, דו-שליטה)
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Listings table holds products and vehicles. price_inc_vat is calculated using trigger.
CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  price_ex_vat numeric NOT NULL CHECK (price_ex_vat >= 0),
  price_inc_vat numeric,
  vat_rate numeric NOT NULL DEFAULT 0.17,
  vehicle_year integer,
  mileage_km integer,
  transmission text,
  dual_control boolean,
  cameras text,
  status text NOT NULL DEFAULT 'active',
  contact_name text,
  contact_phone text,
  contact_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create function to update price_inc_vat automatically
CREATE OR REPLACE FUNCTION public.set_price_inc_vat() RETURNS trigger AS $$
BEGIN
  NEW.price_inc_vat := NEW.price_ex_vat * (1 + NEW.vat_rate);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on listings for insert/update
CREATE TRIGGER trg_set_price_inc_vat
BEFORE INSERT OR UPDATE ON public.listings
FOR EACH ROW EXECUTE FUNCTION public.set_price_inc_vat();

-- Leads table stores contact inquiries
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id uuid REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_name text NOT NULL,
  buyer_phone text NOT NULL,
  buyer_email text,
  message text,
  lead_source text,
  created_at timestamptz NOT NULL DEFAULT now()
);