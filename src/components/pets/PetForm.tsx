import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pet, PetFormData } from '@/types/zoo';
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

const petSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  species: z.string().min(1, 'Species is required').max(100),
  breed: z.string().max(100).optional(),
  dateOfBirth: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Date of birth cannot be in the future',
  }),
  gender: z.enum(['Male', 'Female']),
  habitat: z.string().min(1, 'Habitat is required').max(200),
  healthStatus: z.enum(['Healthy', 'Sick', 'Critical', 'Recovering']),
  type: z.enum(['Regular', 'MigratoryBird', 'Reptile']),
  winteringLocation: z.string().max(200).optional(),
  migrationSeason: z.string().max(100).optional(),
  hibernationPeriod: z.string().max(100).optional(),
  hibernationTemperature: z.number().min(-10).max(40).optional(),
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
          ...pet,
          dateOfBirth: format(new Date(pet.dateOfBirth), 'yyyy-MM-dd'),
        }
      : {
          type: 'Regular',
          gender: 'Male',
          healthStatus: 'Healthy',
        },
  });

  const petType = watch('type');

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
              <Label htmlFor="breed">Breed</Label>
              <Input id="breed" {...register('breed')} className="zoo-input" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                max={format(new Date(), 'yyyy-MM-dd')}
                {...register('dateOfBirth')}
                className="zoo-input"
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select
                defaultValue={pet?.gender || 'Male'}
                onValueChange={(value) => setValue('gender', value as 'Male' | 'Female')}
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type *</Label>
              <Select
                defaultValue={pet?.type || 'Regular'}
                onValueChange={(value) =>
                  setValue('type', value as 'Regular' | 'MigratoryBird' | 'Reptile')
                }
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="MigratoryBird">Migratory Bird</SelectItem>
                  <SelectItem value="Reptile">Reptile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="habitat">Habitat *</Label>
              <Input id="habitat" {...register('habitat')} className="zoo-input" />
              {errors.habitat && (
                <p className="text-xs text-destructive">{errors.habitat.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Health Status *</Label>
              <Select
                defaultValue={pet?.healthStatus || 'Healthy'}
                onValueChange={(value) =>
                  setValue('healthStatus', value as 'Healthy' | 'Sick' | 'Critical' | 'Recovering')
                }
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Recovering">Recovering</SelectItem>
                  <SelectItem value="Sick">Sick</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Migratory Bird Fields */}
          {petType === 'MigratoryBird' && (
            <div className="p-4 rounded-xl bg-zoo-sky/30 space-y-4">
              <p className="text-sm font-medium text-zoo-sky-dark">Migration Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="winteringLocation">Wintering Location</Label>
                  <Input
                    id="winteringLocation"
                    {...register('winteringLocation')}
                    className="zoo-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="migrationSeason">Migration Season</Label>
                  <Input
                    id="migrationSeason"
                    {...register('migrationSeason')}
                    className="zoo-input"
                    placeholder="e.g., October - March"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reptile Fields */}
          {petType === 'Reptile' && (
            <div className="p-4 rounded-xl bg-zoo-yellow/30 space-y-4">
              <p className="text-sm font-medium text-zoo-yellow-dark">Hibernation Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hibernationPeriod">Hibernation Period</Label>
                  <Input
                    id="hibernationPeriod"
                    {...register('hibernationPeriod')}
                    className="zoo-input"
                    placeholder="e.g., December - February"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hibernationTemperature">Temperature (°C)</Label>
                  <Input
                    id="hibernationTemperature"
                    type="number"
                    {...register('hibernationTemperature', { valueAsNumber: true })}
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
