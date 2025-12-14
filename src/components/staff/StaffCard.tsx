import { Employee } from '@/types/zoo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Stethoscope, User, Heart, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface StaffCardProps {
  employee: Employee;
  spouse?: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function StaffCard({ employee, spouse, onEdit, onDelete }: StaffCardProps) {
  const isVet = employee.role === 'Veterinarian';

  return (
    <div className={cn('zoo-card group', isVet ? 'border-l-4 border-l-zoo-sky-dark' : 'border-l-4 border-l-primary')}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center',
              isVet
                ? 'bg-gradient-to-br from-zoo-sky to-zoo-sky-dark/30'
                : 'bg-gradient-to-br from-zoo-mint to-primary/30'
            )}
          >
            {isVet ? (
              <Stethoscope className="w-6 h-6 text-zoo-sky-dark" />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className={cn('text-sm font-medium', isVet ? 'text-zoo-sky-dark' : 'text-primary')}>
              {employee.role}
            </p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(employee)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{employee.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Department</span>
          <span className="font-medium">{employee.department}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Hire Date</span>
          <span className="font-medium">{format(new Date(employee.hireDate), 'MMM d, yyyy')}</span>
        </div>
      </div>

      {spouse && (
        <div className="p-3 rounded-xl bg-zoo-peach/50 flex items-center gap-2">
          <Heart className="w-4 h-4 text-destructive" />
          <span className="text-sm">
            Married to <span className="font-medium">{spouse.firstName} {spouse.lastName}</span>
          </span>
        </div>
      )}
    </div>
  );
}
