-- Supabase SQL Editor mein run karo
CREATE TABLE IF NOT EXISTS services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id     UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  service_type  TEXT NOT NULL,
  name          TEXT NOT NULL,
  actual_price  FLOAT NOT NULL,
  selling_price FLOAT NOT NULL,
  description   TEXT NOT NULL,
  main_image    TEXT NOT NULL DEFAULT '',
  images        TEXT[] DEFAULT '{}',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
