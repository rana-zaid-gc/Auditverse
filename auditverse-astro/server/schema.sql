CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT DEFAULT '',
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
