import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type DietType = Database['public']['Tables']['diet_types']['Row'];
type Diet = Database['public']['Tables']['diets']['Row'];

export interface DietFormData {
  petId: string;
  dietTypeId: string;
  foodName: string;
  quantity?: string;
  feedingTime?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface DietTypeFormData {
  name: string;
  description?: string;
}

export function useDietTypes() {
  return useQuery({
    queryKey: ['diet-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diet_types')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as DietType[];
    },
  });
}

export function useDiets() {
  return useQuery({
    queryKey: ['diets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Diet[];
    },
  });
}

export function useAddDietType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DietTypeFormData) => {
      const { data: result, error } = await supabase.rpc('add_diet_type', {
        p_name: data.name,
        p_description: data.description || null,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-types'] });
    },
  });
}

export function useAddDiet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DietFormData) => {
      const { data: result, error } = await supabase.rpc('add_diet', {
        p_pet_id: data.petId,
        p_diet_type_id: data.dietTypeId,
        p_food_name: data.foodName,
        p_quantity: data.quantity || null,
        p_feeding_time: data.feedingTime || null,
        p_start_date: data.startDate || null,
        p_end_date: data.endDate || null,
        p_notes: data.notes || null,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diets'] });
      queryClient.invalidateQueries({ queryKey: ['pets-with-diets'] });
    },
  });
}

export function useUpdateDiet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DietFormData> }) => {
      const { data: result, error } = await supabase.rpc('update_diet', {
        p_id: id,
        p_diet_type_id: data.dietTypeId || null,
        p_food_name: data.foodName || null,
        p_quantity: data.quantity || null,
        p_feeding_time: data.feedingTime || null,
        p_start_date: data.startDate || null,
        p_end_date: data.endDate || null,
        p_notes: data.notes || null,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diets'] });
      queryClient.invalidateQueries({ queryKey: ['pets-with-diets'] });
    },
  });
}

export function useDeleteDiet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: result, error } = await supabase.rpc('delete_diet', {
        p_id: id,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diets'] });
      queryClient.invalidateQueries({ queryKey: ['pets-with-diets'] });
    },
  });
}

export function useDeleteDietType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('diet_types')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diet-types'] });
    },
  });
}

export function usePetsWithDiets() {
  return useQuery({
    queryKey: ['pets-with-diets'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_pets_with_diets');
      if (error) throw error;
      return data;
    },
  });
}
