-- Schema for the D1 database. Apply with:
--   npx wrangler d1 execute pau-nafeesah --remote --file=./schema.sql

-- Appointments, blocked hours, and gallery entries. The primary key is what stops two
-- guests from booking the same slot: the second insert simply does nothing.
CREATE TABLE IF NOT EXISTS records (
  pk   TEXT NOT NULL,
  sk   TEXT NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (pk, sk)
);

-- Rate limit counters, one row per action/caller/time window.
CREATE TABLE IF NOT EXISTS counters (
  key        TEXT PRIMARY KEY,
  count      INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS counters_expires_at ON counters (expires_at);
