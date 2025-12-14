-- Create enum types for species and roles
CREATE TYPE public.species_type AS ENUM ('Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish', 'Invertebrate');
CREATE TYPE public.employee_role AS ENUM ('Keeper', 'Veterinarian');
CREATE TYPE public.health_status AS ENUM ('Healthy', 'Sick', 'Under Treatment', 'Recovering', 'Critical');

-- Create diet_types table
CREATE TABLE public.diet_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  species_type species_type NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Unknown')),
  weight DECIMAL(10,2),
  health_status health_status DEFAULT 'Healthy',
  enclosure TEXT,
  wintering_location TEXT, -- For migratory birds
  hibernation_start DATE,  -- For reptiles
  hibernation_end DATE,    -- For reptiles
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role employee_role NOT NULL,
  hire_date DATE NOT NULL,
  specialization TEXT,
  spouse_id UUID REFERENCES public.employees(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create diets table
CREATE TABLE public.diets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  diet_type_id UUID REFERENCES public.diet_types(id) ON DELETE RESTRICT NOT NULL,
  food_name TEXT NOT NULL,
  quantity TEXT,
  feeding_time TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create medical_checks table
CREATE TABLE public.medical_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  vet_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  check_date DATE NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  next_check_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security (public access for zoo management system)
ALTER TABLE public.diet_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_checks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (zoo staff system - no auth required initially)
CREATE POLICY "Allow public read diet_types" ON public.diet_types FOR SELECT USING (true);
CREATE POLICY "Allow public insert diet_types" ON public.diet_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update diet_types" ON public.diet_types FOR UPDATE USING (true);
CREATE POLICY "Allow public delete diet_types" ON public.diet_types FOR DELETE USING (true);

CREATE POLICY "Allow public read pets" ON public.pets FOR SELECT USING (true);
CREATE POLICY "Allow public insert pets" ON public.pets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update pets" ON public.pets FOR UPDATE USING (true);
CREATE POLICY "Allow public delete pets" ON public.pets FOR DELETE USING (true);

CREATE POLICY "Allow public read employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Allow public insert employees" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update employees" ON public.employees FOR UPDATE USING (true);
CREATE POLICY "Allow public delete employees" ON public.employees FOR DELETE USING (true);

CREATE POLICY "Allow public read diets" ON public.diets FOR SELECT USING (true);
CREATE POLICY "Allow public insert diets" ON public.diets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update diets" ON public.diets FOR UPDATE USING (true);
CREATE POLICY "Allow public delete diets" ON public.diets FOR DELETE USING (true);

CREATE POLICY "Allow public read medical_checks" ON public.medical_checks FOR SELECT USING (true);
CREATE POLICY "Allow public insert medical_checks" ON public.medical_checks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update medical_checks" ON public.medical_checks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete medical_checks" ON public.medical_checks FOR DELETE USING (true);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON public.pets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_diets_updated_at BEFORE UPDATE ON public.diets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Stored Procedure: add_pet
CREATE OR REPLACE FUNCTION public.add_pet(
  p_name TEXT,
  p_species TEXT,
  p_species_type species_type,
  p_date_of_birth DATE DEFAULT NULL,
  p_gender TEXT DEFAULT 'Unknown',
  p_weight DECIMAL DEFAULT NULL,
  p_health_status health_status DEFAULT 'Healthy',
  p_enclosure TEXT DEFAULT NULL,
  p_wintering_location TEXT DEFAULT NULL,
  p_hibernation_start DATE DEFAULT NULL,
  p_hibernation_end DATE DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.pets (name, species, species_type, date_of_birth, gender, weight, health_status, enclosure, wintering_location, hibernation_start, hibernation_end, notes)
  VALUES (p_name, p_species, p_species_type, p_date_of_birth, p_gender, p_weight, p_health_status, p_enclosure, p_wintering_location, p_hibernation_start, p_hibernation_end, p_notes)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: update_pet
CREATE OR REPLACE FUNCTION public.update_pet(
  p_id UUID,
  p_name TEXT DEFAULT NULL,
  p_species TEXT DEFAULT NULL,
  p_species_type species_type DEFAULT NULL,
  p_date_of_birth DATE DEFAULT NULL,
  p_gender TEXT DEFAULT NULL,
  p_weight DECIMAL DEFAULT NULL,
  p_health_status health_status DEFAULT NULL,
  p_enclosure TEXT DEFAULT NULL,
  p_wintering_location TEXT DEFAULT NULL,
  p_hibernation_start DATE DEFAULT NULL,
  p_hibernation_end DATE DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.pets SET
    name = COALESCE(p_name, name),
    species = COALESCE(p_species, species),
    species_type = COALESCE(p_species_type, species_type),
    date_of_birth = COALESCE(p_date_of_birth, date_of_birth),
    gender = COALESCE(p_gender, gender),
    weight = COALESCE(p_weight, weight),
    health_status = COALESCE(p_health_status, health_status),
    enclosure = COALESCE(p_enclosure, enclosure),
    wintering_location = COALESCE(p_wintering_location, wintering_location),
    hibernation_start = COALESCE(p_hibernation_start, hibernation_start),
    hibernation_end = COALESCE(p_hibernation_end, hibernation_end),
    notes = COALESCE(p_notes, notes)
  WHERE id = p_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: delete_pet
CREATE OR REPLACE FUNCTION public.delete_pet(p_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM public.pets WHERE id = p_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: add_employee
CREATE OR REPLACE FUNCTION public.add_employee(
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_role employee_role DEFAULT 'Keeper',
  p_hire_date DATE DEFAULT CURRENT_DATE,
  p_specialization TEXT DEFAULT NULL,
  p_spouse_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.employees (first_name, last_name, email, phone, role, hire_date, specialization, spouse_id)
  VALUES (p_first_name, p_last_name, p_email, p_phone, p_role, p_hire_date, p_specialization, p_spouse_id)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: update_employee
CREATE OR REPLACE FUNCTION public.update_employee(
  p_id UUID,
  p_first_name TEXT DEFAULT NULL,
  p_last_name TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_role employee_role DEFAULT NULL,
  p_hire_date DATE DEFAULT NULL,
  p_specialization TEXT DEFAULT NULL,
  p_spouse_id UUID DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.employees SET
    first_name = COALESCE(p_first_name, first_name),
    last_name = COALESCE(p_last_name, last_name),
    email = COALESCE(p_email, email),
    phone = COALESCE(p_phone, phone),
    role = COALESCE(p_role, role),
    hire_date = COALESCE(p_hire_date, hire_date),
    specialization = COALESCE(p_specialization, specialization),
    spouse_id = COALESCE(p_spouse_id, spouse_id),
    is_active = COALESCE(p_is_active, is_active)
  WHERE id = p_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: delete_employee
CREATE OR REPLACE FUNCTION public.delete_employee(p_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM public.employees WHERE id = p_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: add_diet_type
CREATE OR REPLACE FUNCTION public.add_diet_type(
  p_name TEXT,
  p_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.diet_types (name, description)
  VALUES (p_name, p_description)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: add_diet
CREATE OR REPLACE FUNCTION public.add_diet(
  p_pet_id UUID,
  p_diet_type_id UUID,
  p_food_name TEXT,
  p_quantity TEXT DEFAULT NULL,
  p_feeding_time TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT CURRENT_DATE,
  p_end_date DATE DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.diets (pet_id, diet_type_id, food_name, quantity, feeding_time, start_date, end_date, notes)
  VALUES (p_pet_id, p_diet_type_id, p_food_name, p_quantity, p_feeding_time, p_start_date, p_end_date, p_notes)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: update_diet
CREATE OR REPLACE FUNCTION public.update_diet(
  p_id UUID,
  p_diet_type_id UUID DEFAULT NULL,
  p_food_name TEXT DEFAULT NULL,
  p_quantity TEXT DEFAULT NULL,
  p_feeding_time TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.diets SET
    diet_type_id = COALESCE(p_diet_type_id, diet_type_id),
    food_name = COALESCE(p_food_name, food_name),
    quantity = COALESCE(p_quantity, quantity),
    feeding_time = COALESCE(p_feeding_time, feeding_time),
    start_date = COALESCE(p_start_date, start_date),
    end_date = COALESCE(p_end_date, end_date),
    notes = COALESCE(p_notes, notes)
  WHERE id = p_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: delete_diet
CREATE OR REPLACE FUNCTION public.delete_diet(p_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM public.diets WHERE id = p_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Stored Procedure: add_medical_check
CREATE OR REPLACE FUNCTION public.add_medical_check(
  p_pet_id UUID,
  p_vet_id UUID,
  p_check_date DATE,
  p_diagnosis TEXT DEFAULT NULL,
  p_treatment TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_next_check_date DATE DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.medical_checks (pet_id, vet_id, check_date, diagnosis, treatment, notes, next_check_date)
  VALUES (p_pet_id, p_vet_id, p_check_date, p_diagnosis, p_treatment, p_notes, p_next_check_date)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View: get_pet_full_info
CREATE OR REPLACE FUNCTION public.get_pet_full_info(search_term TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  species TEXT,
  species_type species_type,
  date_of_birth DATE,
  gender TEXT,
  weight DECIMAL,
  health_status health_status,
  enclosure TEXT,
  wintering_location TEXT,
  hibernation_start DATE,
  hibernation_end DATE,
  notes TEXT,
  current_diet TEXT,
  last_medical_check DATE,
  last_vet TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.species,
    p.species_type,
    p.date_of_birth,
    p.gender,
    p.weight,
    p.health_status,
    p.enclosure,
    p.wintering_location,
    p.hibernation_start,
    p.hibernation_end,
    p.notes,
    d.food_name as current_diet,
    mc.check_date as last_medical_check,
    (e.first_name || ' ' || e.last_name) as last_vet
  FROM public.pets p
  LEFT JOIN LATERAL (
    SELECT food_name FROM public.diets 
    WHERE pet_id = p.id AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    ORDER BY start_date DESC LIMIT 1
  ) d ON true
  LEFT JOIN LATERAL (
    SELECT check_date, vet_id FROM public.medical_checks 
    WHERE pet_id = p.id 
    ORDER BY check_date DESC LIMIT 1
  ) mc ON true
  LEFT JOIN public.employees e ON mc.vet_id = e.id
  WHERE search_term IS NULL 
    OR p.name ILIKE '%' || search_term || '%'
    OR p.species ILIKE '%' || search_term || '%'
    OR p.enclosure ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View: get_married_couples
CREATE OR REPLACE FUNCTION public.get_married_couples()
RETURNS TABLE (
  employee1_id UUID,
  employee1_name TEXT,
  employee1_role employee_role,
  employee2_id UUID,
  employee2_name TEXT,
  employee2_role employee_role
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e1.id as employee1_id,
    (e1.first_name || ' ' || e1.last_name) as employee1_name,
    e1.role as employee1_role,
    e2.id as employee2_id,
    (e2.first_name || ' ' || e2.last_name) as employee2_name,
    e2.role as employee2_role
  FROM public.employees e1
  JOIN public.employees e2 ON e1.spouse_id = e2.id
  WHERE e1.id < e2.id; -- Avoid duplicates
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View: get_pets_with_diets
CREATE OR REPLACE FUNCTION public.get_pets_with_diets()
RETURNS TABLE (
  pet_id UUID,
  pet_name TEXT,
  species TEXT,
  diet_type TEXT,
  food_name TEXT,
  quantity TEXT,
  feeding_time TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as pet_id,
    p.name as pet_name,
    p.species,
    dt.name as diet_type,
    d.food_name,
    d.quantity,
    d.feeding_time
  FROM public.pets p
  JOIN public.diets d ON p.id = d.pet_id
  JOIN public.diet_types dt ON d.diet_type_id = dt.id
  WHERE d.end_date IS NULL OR d.end_date >= CURRENT_DATE
  ORDER BY p.name, d.feeding_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial diet types
INSERT INTO public.diet_types (name, description) VALUES
  ('Carnivore', 'Meat-based diet for predators'),
  ('Herbivore', 'Plant-based diet for herbivores'),
  ('Omnivore', 'Mixed diet of plants and meat'),
  ('Insectivore', 'Diet consisting primarily of insects'),
  ('Frugivore', 'Fruit-based diet');