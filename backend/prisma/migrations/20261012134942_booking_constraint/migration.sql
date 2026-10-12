CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE appointments
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  provider_id WITH =,
  time_range WITH &&
)
WHERE (status IN ('HELD', 'CONFIRMED'));