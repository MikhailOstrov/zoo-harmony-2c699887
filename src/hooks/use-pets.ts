import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Pet = Database['public']['Tables']['pets']['Row'];
type SpeciesType = Database['public']['Enums']['species_type'];
type HealthStatus = Database['public']['Enums']['health_status'];

export interface PetFormData {
  name: string;
  species: string;
  speciesType: SpeciesType;
  dateOfBirth?: string;
  gender?: string;
  weight?: number;
  healthStatus?: HealthStatus;
  enclosure?: string;
  winteringLocation?: string;
  hibernationStart?: string;
  hibernationEnd?: string;
  notes?: string;
}

export function usePets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Pet[];
    },
  });
}

export function useAddPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PetFormData) => {
      const { data: result, error } = await supabase.rpc('add_pet', {
        p_name: data.name,
        p_species: data.species,
        p_species_type: data.speciesType,
        p_date_of_birth: data.dateOfBirth || null,
        p_gender: data.gender || 'Unknown',
        p_weight: data.weight || null,
        p_health_status: data.healthStatus || 'Healthy',
        p_enclosure: data.enclosure || null,
        p_wintering_location: data.winteringLocation || null,
        p_hibernation_start: data.hibernationStart || null,
        p_hibernation_end: data.hibernationEnd || null,
        p_notes: data.notes || null,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PetFormData }) => {
      const { data: result, error } = await supabase.rpc('update_pet', {
        p_id: id,
        p_name: data.name,
        p_species: data.species,
        p_species_type: data.speciesType,
        p_date_of_birth: data.dateOfBirth || null,
        p_gender: data.gender || null,
        p_weight: data.weight || null,
        p_health_status: data.healthStatus || null,
        p_enclosure: data.enclosure || null,
        p_wintering_location: data.winteringLocation || null,
        p_hibernation_start: data.hibernationStart || null,
        p_hibernation_end: data.hibernationEnd || null,
        p_notes: data.notes || null,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: result, error } = await supabase.rpc('delete_pet', {
        p_id: id,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}
