import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Database } from '@/integrations/supabase/types';
import { PetFormData } from '@/hooks/use-pets';
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

type Pet = Database['public']['Tables']['pets']['Row'];

const petSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  species: z.string().min(1, 'Species is required').max(100),
  speciesType: z.enum(['Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish', 'Invertebrate']),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  weight: z.number().optional(),
  healthStatus: z.enum(['Healthy', 'Sick', 'Under Treatment', 'Recovering', 'Critical']).optional(),
  enclosure: z.string().optional(),
  winteringLocation: z.string().optional(),
  hibernationStart: z.string().optional(),
  hibernationEnd: z.string().optional(),
  notes: z.string().optional(),
});

interface PetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pet?: Pet;
  onSubmit: (data: PetFormData) => void;
}

export function PetForm({ open, onOpenChange, pet, onSubmit }: PetFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: pet
      ? {
          name: pet.name,
          species: pet.species,
          speciesType: pet.species_type,
          dateOfBirth: pet.date_of_birth || undefined,
          gender: pet.gender || undefined,
          weight: pet.weight || undefined,
          healthStatus: pet.health_status || 'Healthy',
          enclosure: pet.enclosure || undefined,
          winteringLocation: pet.wintering_location || undefined,
          hibernationStart: pet.hibernation_start || undefined,
          hibernationEnd: pet.hibernation_end || undefined,
          notes: pet.notes || undefined,
        }
      : {
          speciesType: 'Mammal',
          gender: 'Unknown',
          healthStatus: 'Healthy',
        },
  });

  const speciesType = watch('speciesType');

  const handleFormSubmit = (data: PetFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {pet ? 'Edit Pet' : 'Add New Pet'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register('name')} className="zoo-input" />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Species *</Label>
              <Input id="species" {...register('species')} className="zoo-input" />
              {errors.species && (
                <p className="text-xs text-destructive">{errors.species.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Species Type *</Label>
              <Select
                defaultValue={pet?.species_type || 'Mammal'}
                onValueChange={(value) => setValue('speciesType', value as any)}
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mammal">Mammal</SelectItem>
                  <SelectItem value="Bird">Bird</SelectItem>
                  <SelectItem value="Reptile">Reptile</SelectItem>
                  <SelectItem value="Amphibian">Amphibian</SelectItem>
                  <SelectItem value="Fish">Fish</SelectItem>
                  <SelectItem value="Invertebrate">Invertebrate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                max={format(new Date(), 'yyyy-MM-dd')}
                {...register('dateOfBirth')}
                className="zoo-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                defaultValue={pet?.gender || 'Unknown'}
                onValueChange={(value) => setValue('gender', value)}
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Health Status</Label>
              <Select
                defaultValue={pet?.health_status || 'Healthy'}
                onValueChange={(value) => setValue('healthStatus', value as any)}
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Recovering">Recovering</SelectItem>
                  <SelectItem value="Sick">Sick</SelectItem>
                  <SelectItem value="Under Treatment">Under Treatment</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enclosure">Enclosure</Label>
              <Input id="enclosure" {...register('enclosure')} className="zoo-input" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                {...register('weight', { valueAsNumber: true })}
                className="zoo-input"
              />
            </div>
          </div>

          {/* Bird Fields */}
          {speciesType === 'Bird' && (
            <div className="p-4 rounded-xl bg-zoo-sky/30 space-y-4">
              <p className="text-sm font-medium text-zoo-sky-dark">Migration Details</p>
              <div className="space-y-2">
                <Label htmlFor="winteringLocation">Wintering Location</Label>
                <Input
                  id="winteringLocation"
                  {...register('winteringLocation')}
                  className="zoo-input"
                />
              </div>
            </div>
          )}

          {/* Reptile Fields */}
          {speciesType === 'Reptile' && (
            <div className="p-4 rounded-xl bg-zoo-yellow/30 space-y-4">
              <p className="text-sm font-medium text-zoo-yellow-dark">Hibernation Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hibernationStart">Start Date</Label>
                  <Input
                    id="hibernationStart"
                    type="date"
                    {...register('hibernationStart')}
                    className="zoo-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hibernationEnd">End Date</Label>
                  <Input
                    id="hibernationEnd"
                    type="date"
                    {...register('hibernationEnd')}
                    className="zoo-input"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="mint">
              {pet ? 'Save Changes' : 'Add Pet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
