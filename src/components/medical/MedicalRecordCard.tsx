import { MedicalCheck, Pet, Employee } from '@/types/zoo';
import { cn } from '@/lib/utils';
import { Stethoscope, Calendar, Pill, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface MedicalRecordCardProps {
  record: MedicalCheck;
  pet: Pet;
  vet: Employee;
}

export function MedicalRecordCard({ record, pet, vet }: MedicalRecordCardProps) {
  return (
    <div className="zoo-card border-l-4 border-l-zoo-sky-dark">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zoo-sky/30 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-zoo-sky-dark" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">{pet.species}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {format(new Date(record.checkDate), 'MMM d, yyyy')}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-muted/50">
          <p className="text-xs font-medium text-muted-foreground mb-1">Diagnosis</p>
          <p className="text-sm font-medium">{record.diagnosis}</p>
        </div>

        {record.treatment && (
          <div className="p-3 rounded-xl bg-zoo-mint/30">
            <p className="text-xs font-medium text-primary mb-1">Treatment</p>
            <p className="text-sm">{record.treatment}</p>
          </div>
        )}

        {record.medications && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-zoo-yellow/30">
            <Pill className="w-4 h-4 text-zoo-yellow-dark mt-0.5" />
            <div>
              <p className="text-xs font-medium text-zoo-yellow-dark mb-1">Medications</p>
              <p className="text-sm">{record.medications}</p>
            </div>
          </div>
        )}

        {record.notes && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/30">
            <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-muted-foreground">{record.notes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Examined by <span className="font-medium text-foreground">Dr. {vet.lastName}</span>
        </span>
        {record.nextCheckDate && (
          <span className="zoo-badge-sky text-xs">
            Next: {format(new Date(record.nextCheckDate), 'MMM d')}
          </span>
        )}
      </div>
    </div>
  );
}
