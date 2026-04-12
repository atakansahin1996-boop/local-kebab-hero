CREATE TABLE public.product_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL UNIQUE,
  available BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product availability"
  ON public.product_availability
  FOR SELECT
  USING (true);

INSERT INTO public.product_availability (product_name) VALUES
  ('Kebab Normal'), ('Kebab Con queso'), ('Kebab Doble'), ('Kebab Doble con queso'), ('Kebab Falafel'), ('Kebab Vegetal'),
  ('Durum Normal'), ('Durum Con queso'), ('Durum Doble'), ('Durum Doble con queso'), ('Durum Falafel'), ('Durum Vegetal'),
  ('Plato con ensalada'), ('Plato con patatas o arroz'), ('Plato con patatas y arroz'), ('Plato Falafel'), ('Plato Antep'),
  ('Menú Kebab'), ('Menú Durum'), ('Menú Plato'), ('Menú Infantil'), ('Menú Alitas'),
  ('4 alitas'), ('7 alitas'), ('12 alitas'), ('5 alitas y patatas'), ('15 alitas y patatas'),
  ('Patatas'), ('Arroz'), ('Nuggets'), ('Palitos de queso'), ('Falafel (ración)'), ('Box Kebab'),
  ('Refrescos'), ('Agua');