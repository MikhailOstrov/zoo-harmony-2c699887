import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type MedicalCheck = Database['public']['Tables']['medical_checks']['Row'];

export interface MedicalCheckFormData {
  petId: string;
  vetId: string;
  checkDate: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  nextCheckDate?: string;
}

export function useMedicalChecks() {
  return useQuery({
    queryKey: ['medical-checks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_checks')
        .select('*')
        .order('check_date', { ascending: false });
      if (error) throw error;
      return data as MedicalCheck[];
    },
  });
}

export function useAddMedicalCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MedicalCheckFormData) => {
      const { data: result, error } = await supabase.rpc('add_medical_check', {
        p_pet_id: data.petId,
        p_vet_id: data.vetId,
        p_check_date: data.checkDate,
        p_diagnosis: data.diagnosis || null,
        p_treatment: data.treatment || null,
        p_notes: data.notes || null,
        p_next_check_date: data.nextCheckDate || null,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-checks'] });
      queryClient.invalidateQueries({ queryKey: ['pet-full-info'] });
    },
  });
}

export function usePetFullInfo(searchTerm?: string) {
  return useQuery({
    queryKey: ['pet-full-info', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_pet_full_info', {
        search_term: searchTerm || null,
      });
      if (error) throw error;
      return data;
    },
  });
}
