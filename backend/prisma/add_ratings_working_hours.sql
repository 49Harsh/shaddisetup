-- Supabase SQL Editor mein run karo

-- Vendor ke liye working hours aur experience
ALTER TABLE vendors
  ADD COLUMN IF NOT EXISTS working_hours TEXT DEFAULT '9 AM - 8 PM',
  ADD COLUMN IF NOT EXISTS experience_desc TEXT DEFAULT '';

-- Service ratings table
CREATE TABLE IF NOT EXISTS service_ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID NOT NULL REFERENCES vendor_services(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review      TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(service_id, user_id)
);
