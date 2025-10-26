-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create potlis table
CREATE TABLE public.potlis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  balance DECIMAL(12, 2) DEFAULT 0 CHECK (balance >= 0),
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.potlis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own potlis"
  ON public.potlis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own potlis"
  ON public.potlis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own potlis"
  ON public.potlis FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own potlis"
  ON public.potlis FOR DELETE
  USING (auth.uid() = user_id);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  potli_id UUID REFERENCES public.potlis(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to update potli updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_potli_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_potli_timestamp
  BEFORE UPDATE ON public.potlis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_potli_timestamp();

-- Function to create default potlis for new users
CREATE OR REPLACE FUNCTION public.create_default_potlis()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.potlis (user_id, name, color, percentage, icon, display_order)
  VALUES
    (NEW.id, 'Needs', 'royal-blue', 40, 'Home', 1),
    (NEW.id, 'Invest', 'emerald', 20, 'TrendingUp', 2),
    (NEW.id, 'Wants', 'turmeric', 10, 'ShoppingBag', 3),
    (NEW.id, 'Emergency', 'maroon', 10, 'AlertCircle', 4),
    (NEW.id, 'Parents', 'coral', 10, 'Heart', 5),
    (NEW.id, 'Donations', 'saffron', 10, 'Gift', 6);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_created_create_potlis
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_potlis();