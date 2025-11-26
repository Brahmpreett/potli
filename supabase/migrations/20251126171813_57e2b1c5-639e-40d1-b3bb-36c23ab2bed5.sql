-- Add full_name and username columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create unique index on username to ensure uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_key ON public.profiles(username);
