import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Database } from '@/integrations/supabase/types';
import { EmployeeFormData } from '@/hooks/use-employees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

type Employee = Database['public']['Tables']['employees']['Row'];

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['Keeper', 'Veterinarian']),
  hireDate: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Hire date cannot be in the future',
  }),
  specialization: z.string().optional(),
  spouseId: z.string().optional(),
});

interface StaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  employees: Employee[];
  onSubmit: (data: EmployeeFormData) => void;
}

export function StaffForm({ open, onOpenChange, employee, employees, onSubmit }: StaffFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee
      ? {
          firstName: employee.first_name,
          lastName: employee.last_name,
          email: employee.email,
          phone: employee.phone || undefined,
          role: employee.role,
          hireDate: employee.hire_date,
          specialization: employee.specialization || undefined,
          spouseId: employee.spouse_id || undefined,
        }
      : {
          role: 'Keeper',
          hireDate: format(new Date(), 'yyyy-MM-dd'),
        },
  });

  const availableSpouses = employees.filter(
    (e) => e.id !== employee?.id && !e.spouse_id
  );

  const handleFormSubmit = (data: EmployeeFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register('firstName')} className="zoo-input" />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register('lastName')} className="zoo-input" />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register('email')} className="zoo-input" />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} className="zoo-input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select
                defaultValue={employee?.role || 'Keeper'}
                onValueChange={(value) => setValue('role', value as 'Keeper' | 'Veterinarian')}
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Keeper">Keeper</SelectItem>
                  <SelectItem value="Veterinarian">Veterinarian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                max={format(new Date(), 'yyyy-MM-dd')}
                {...register('hireDate')}
                className="zoo-input"
              />
              {errors.hireDate && (
                <p className="text-xs text-destructive">{errors.hireDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input id="specialization" {...register('specialization')} className="zoo-input" />
          </div>

          {availableSpouses.length > 0 && (
            <div className="space-y-2">
              <Label>Spouse (Optional)</Label>
              <Select
                defaultValue={employee?.spouse_id || ''}
                onValueChange={(value) => setValue('spouseId', value || undefined)}
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue placeholder="Select spouse..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {availableSpouses.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.first_name} {e.last_name} ({e.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="mint">
              {employee ? 'Save Changes' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
