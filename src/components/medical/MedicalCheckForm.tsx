import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MedicalCheckFormData, Pet, Employee } from '@/types/zoo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const medicalCheckSchema = z.object({
  petId: z.string().min(1, 'Pet is required'),
  vetId: z.string().min(1, 'Veterinarian is required'),
  checkDate: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Check date cannot be in the future',
  }),
  diagnosis: z.string().min(1, 'Diagnosis is required').max(500),
  treatment: z.string().max(500).optional(),
  medications: z.string().max(300).optional(),
  nextCheckDate: z.string().optional(),
  notes: z.string().max(500).optional(),
});

interface MedicalCheckFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pets: Pet[];
  vets: Employee[];
  onSubmit: (data: MedicalCheckFormData) => void;
}

export function MedicalCheckForm({ open, onOpenChange, pets, vets, onSubmit }: MedicalCheckFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<MedicalCheckFormData>({
    resolver: zodResolver(medicalCheckSchema),
    defaultValues: {
      checkDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const handleFormSubmit = (data: MedicalCheckFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add Medical Check</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pet *</Label>
              <Select onValueChange={(value) => setValue('petId', value)}>
                <SelectTrigger className="zoo-input">
                  <SelectValue placeholder="Select pet..." />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.petId && (
                <p className="text-xs text-destructive">{errors.petId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Veterinarian *</Label>
              <Select onValueChange={(value) => setValue('vetId', value)}>
                <SelectTrigger className="zoo-input">
                  <SelectValue placeholder="Select vet..." />
                </SelectTrigger>
                <SelectContent>
                  {vets.map((vet) => (
                    <SelectItem key={vet.id} value={vet.id}>
                      Dr. {vet.firstName} {vet.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vetId && (
                <p className="text-xs text-destructive">{errors.vetId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkDate">Check Date *</Label>
              <Input
                id="checkDate"
                type="date"
                max={format(new Date(), 'yyyy-MM-dd')}
                {...register('checkDate')}
                className="zoo-input"
              />
              {errors.checkDate && (
                <p className="text-xs text-destructive">{errors.checkDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextCheckDate">Next Check Date</Label>
              <Input
                id="nextCheckDate"
                type="date"
                {...register('nextCheckDate')}
                className="zoo-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Textarea
              id="diagnosis"
              {...register('diagnosis')}
              className="zoo-input min-h-[80px]"
              placeholder="Enter diagnosis..."
            />
            {errors.diagnosis && (
              <p className="text-xs text-destructive">{errors.diagnosis.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment</Label>
            <Textarea
              id="treatment"
              {...register('treatment')}
              className="zoo-input min-h-[60px]"
              placeholder="Enter treatment details..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Medications</Label>
            <Input
              id="medications"
              {...register('medications')}
              className="zoo-input"
              placeholder="e.g., Amoxicillin 500mg twice daily"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              className="zoo-input min-h-[60px]"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="mint">
              Add Medical Check
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
