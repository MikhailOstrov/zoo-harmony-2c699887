import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Employee = Database['public']['Tables']['employees']['Row'];
type EmployeeRole = Database['public']['Enums']['employee_role'];

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: EmployeeRole;
  hireDate: string;
  specialization?: string;
  spouseId?: string;
}

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Employee[];
    },
  });
}

export function useAddEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      const { data: result, error } = await supabase.rpc('add_employee', {
        p_first_name: data.firstName,
        p_last_name: data.lastName,
        p_email: data.email,
        p_phone: data.phone || null,
        p_role: data.role,
        p_hire_date: data.hireDate,
        p_specialization: data.specialization || null,
        p_spouse_id: data.spouseId || null,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmployeeFormData> & { isActive?: boolean } }) => {
      const { data: result, error } = await supabase.rpc('update_employee', {
        p_id: id,
        p_first_name: data.firstName || null,
        p_last_name: data.lastName || null,
        p_email: data.email || null,
        p_phone: data.phone || null,
        p_role: data.role || null,
        p_hire_date: data.hireDate || null,
        p_specialization: data.specialization || null,
        p_spouse_id: data.spouseId || null,
        p_is_active: data.isActive ?? null,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: result, error } = await supabase.rpc('delete_employee', {
        p_id: id,
      });
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useMarriedCouples() {
  return useQuery({
    queryKey: ['married-couples'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_married_couples');
      if (error) throw error;
      return data;
    },
  });
}
