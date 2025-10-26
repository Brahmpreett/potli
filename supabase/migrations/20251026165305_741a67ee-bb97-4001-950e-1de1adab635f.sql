-- Fix search path for update_potli_timestamp function
CREATE OR REPLACE FUNCTION public.update_potli_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix search path for create_default_potlis function
CREATE OR REPLACE FUNCTION public.create_default_potlis()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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