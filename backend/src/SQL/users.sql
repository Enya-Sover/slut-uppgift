CREATE TABLE users (
    id uuid PRIMARY KEY SET DEFAULT auth.uid();
    email text UNIQUE NOT NULL,
    name text,
    is_admin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Användare kan se sin egen profil
CREATE POLICY "Users can view their own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Användare kan uppdatera sin egen profil
CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Användare kan skapa sin egen profil
CREATE POLICY "Users can create their own profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Admin kan göra allt
CREATE POLICY "Admin can manage all profiles"
ON users
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin = true
));
