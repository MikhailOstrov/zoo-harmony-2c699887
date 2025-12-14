-- Fix function search paths for security

-- Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix add_pet
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
) RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO pets (name, species, species_type, date_of_birth, gender, weight, health_status, enclosure, wintering_location, hibernation_start, hibernation_end, notes)
  VALUES (p_name, p_species, p_species_type, p_date_of_birth, p_gender, p_weight, p_health_status, p_enclosure, p_wintering_location, p_hibernation_start, p_hibernation_end, p_notes)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Fix update_pet
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
) RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE pets SET
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
$$;

-- Fix delete_pet
CREATE OR REPLACE FUNCTION public.delete_pet(p_id UUID) RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM pets WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Fix add_employee
CREATE OR REPLACE FUNCTION public.add_employee(
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_role employee_role DEFAULT 'Keeper',
  p_hire_date DATE DEFAULT CURRENT_DATE,
  p_specialization TEXT DEFAULT NULL,
  p_spouse_id UUID DEFAULT NULL
) RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO employees (first_name, last_name, email, phone, role, hire_date, specialization, spouse_id)
  VALUES (p_first_name, p_last_name, p_email, p_phone, p_role, p_hire_date, p_specialization, p_spouse_id)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Fix update_employee
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
) RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE employees SET
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
$$;

-- Fix delete_employee
CREATE OR REPLACE FUNCTION public.delete_employee(p_id UUID) RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM employees WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Fix add_diet_type
CREATE OR REPLACE FUNCTION public.add_diet_type(
  p_name TEXT,
  p_description TEXT DEFAULT NULL
) RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO diet_types (name, description)
  VALUES (p_name, p_description)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Fix add_diet
CREATE OR REPLACE FUNCTION public.add_diet(
  p_pet_id UUID,
  p_diet_type_id UUID,
  p_food_name TEXT,
  p_quantity TEXT DEFAULT NULL,
  p_feeding_time TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT CURRENT_DATE,
  p_end_date DATE DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO diets (pet_id, diet_type_id, food_name, quantity, feeding_time, start_date, end_date, notes)
  VALUES (p_pet_id, p_diet_type_id, p_food_name, p_quantity, p_feeding_time, p_start_date, p_end_date, p_notes)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Fix update_diet
CREATE OR REPLACE FUNCTION public.update_diet(
  p_id UUID,
  p_diet_type_id UUID DEFAULT NULL,
  p_food_name TEXT DEFAULT NULL,
  p_quantity TEXT DEFAULT NULL,
  p_feeding_time TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE diets SET
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
$$;

-- Fix delete_diet
CREATE OR REPLACE FUNCTION public.delete_diet(p_id UUID) RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM diets WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Fix add_medical_check
CREATE OR REPLACE FUNCTION public.add_medical_check(
  p_pet_id UUID,
  p_vet_id UUID,
  p_check_date DATE,
  p_diagnosis TEXT DEFAULT NULL,
  p_treatment TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_next_check_date DATE DEFAULT NULL
) RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO medical_checks (pet_id, vet_id, check_date, diagnosis, treatment, notes, next_check_date)
  VALUES (p_pet_id, p_vet_id, p_check_date, p_diagnosis, p_treatment, p_notes, p_next_check_date)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

-- Fix get_pet_full_info
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
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  FROM pets p
  LEFT JOIN LATERAL (
    SELECT diets.food_name FROM diets 
    WHERE diets.pet_id = p.id AND (diets.end_date IS NULL OR diets.end_date >= CURRENT_DATE)
    ORDER BY diets.start_date DESC LIMIT 1
  ) d ON true
  LEFT JOIN LATERAL (
    SELECT medical_checks.check_date, medical_checks.vet_id FROM medical_checks 
    WHERE medical_checks.pet_id = p.id 
    ORDER BY medical_checks.check_date DESC LIMIT 1
  ) mc ON true
  LEFT JOIN employees e ON mc.vet_id = e.id
  WHERE search_term IS NULL 
    OR p.name ILIKE '%' || search_term || '%'
    OR p.species ILIKE '%' || search_term || '%'
    OR p.enclosure ILIKE '%' || search_term || '%';
END;
$$;

-- Fix get_married_couples
CREATE OR REPLACE FUNCTION public.get_married_couples()
RETURNS TABLE (
  employee1_id UUID,
  employee1_name TEXT,
  employee1_role employee_role,
  employee2_id UUID,
  employee2_name TEXT,
  employee2_role employee_role
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e1.id as employee1_id,
    (e1.first_name || ' ' || e1.last_name) as employee1_name,
    e1.role as employee1_role,
    e2.id as employee2_id,
    (e2.first_name || ' ' || e2.last_name) as employee2_name,
    e2.role as employee2_role
  FROM employees e1
  JOIN employees e2 ON e1.spouse_id = e2.id
  WHERE e1.id < e2.id;
END;
$$;

-- Fix get_pets_with_diets
CREATE OR REPLACE FUNCTION public.get_pets_with_diets()
RETURNS TABLE (
  pet_id UUID,
  pet_name TEXT,
  species TEXT,
  diet_type TEXT,
  food_name TEXT,
  quantity TEXT,
  feeding_time TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  FROM pets p
  JOIN diets d ON p.id = d.pet_id
  JOIN diet_types dt ON d.diet_type_id = dt.id
  WHERE d.end_date IS NULL OR d.end_date >= CURRENT_DATE
  ORDER BY p.name, d.feeding_time;
END;
$$;