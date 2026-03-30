-- ShaadiSetup Tables - Supabase SQL Editor mein run karo

CREATE TYPE "Role" AS ENUM ('user', 'vendor', 'admin');
CREATE TYPE "AdminLevel" AS ENUM ('super_admin', 'moderator');

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL DEFAULT '',
  email TEXT UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  role "Role" NOT NULL DEFAULT 'user',
  village TEXT,
  block TEXT NOT NULL DEFAULT '',
  district TEXT NOT NULL DEFAULT '',
  pincode TEXT NOT NULL DEFAULT '',
  profile_photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  service_types TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER,
  village TEXT,
  block TEXT NOT NULL,
  district TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_level "AdminLevel" NOT NULL DEFAULT 'moderator',
  permissions TEXT[] DEFAULT '{}',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
