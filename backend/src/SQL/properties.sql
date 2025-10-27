


CREATE TABLE properties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    main_image_url text,
    image_urls text[] DEFAULT '{}',
    description text NOT NULL,
    location text NOT NULL,
    price_per_night integer NOT NULL,
    availability boolean DEFAULT true,
    owner_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

--  Alla kan läsa properties
CREATE POLICY "Public can view properties"
ON properties
FOR SELECT
TO anon, authenticated
USING (true);

-- Ägare kan ta bort sina egna properties
CREATE POLICY "Users can delete their own properties"
ON properties
FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Endast ägare/inloggade användare kan skapa properties
CREATE POLICY "Owners can insert properties"
ON properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Endast ägare kan uppdatera sina properties
CREATE POLICY "Owners can update properties"
ON properties
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);


--  Admin kan göra vad som helst
CREATE POLICY "Admin can manage all properties"
ON properties
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin = true
));