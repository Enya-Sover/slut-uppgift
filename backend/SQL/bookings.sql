


CREATE TABLE bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id uuid NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    check_in_date date NOT NULL,
    check_out_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;


-- Endast inloggade användare kan skapa bokningar
CREATE POLICY "Users can insert their bookings"
ON bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Användare kan endast se sina egna bokningar
CREATE POLICY "Users can view their bookings"
ON bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admin kan göra allt
CREATE POLICY "Admin can manage all bookings"
ON bookings
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin = true
));