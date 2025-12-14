import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Employee, EmployeeFormData } from '@/types/zoo';
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

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['Keeper', 'Veterinarian']),
  department: z.string().min(1, 'Department is required').max(100),
  hireDate: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Hire date cannot be in the future',
  }),
  salary: z.number().min(0, 'Salary must be positive'),
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
          ...employee,
          hireDate: format(new Date(employee.hireDate), 'yyyy-MM-dd'),
        }
      : {
          role: 'Keeper',
        },
  });

  const availableSpouses = employees.filter(
    (e) => e.id !== employee?.id && !e.spouseId
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
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" {...register('phone')} className="zoo-input" />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
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
              <Label htmlFor="department">Department *</Label>
              <Input id="department" {...register('department')} className="zoo-input" />
              {errors.department && (
                <p className="text-xs text-destructive">{errors.department.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="salary">Salary *</Label>
              <Input
                id="salary"
                type="number"
                {...register('salary', { valueAsNumber: true })}
                className="zoo-input"
              />
              {errors.salary && (
                <p className="text-xs text-destructive">{errors.salary.message}</p>
              )}
            </div>
          </div>

          {availableSpouses.length > 0 && (
            <div className="space-y-2">
              <Label>Spouse (Optional)</Label>
              <Select
                defaultValue={employee?.spouseId || ''}
                onValueChange={(value) => setValue('spouseId', value || undefined)}
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue placeholder="Select spouse..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {availableSpouses.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.firstName} {e.lastName} ({e.role})
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
