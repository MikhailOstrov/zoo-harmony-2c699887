import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Diet, DietFormData, Pet, DietType } from '@/types/zoo';
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

const dietSchema = z.object({
  petId: z.string().min(1, 'Pet is required'),
  dietTypeId: z.string().min(1, 'Diet type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  feedingSchedule: z.string().min(1, 'Feeding schedule is required').max(200),
  quantity: z.string().min(1, 'Quantity is required').max(100),
  notes: z.string().max(500).optional(),
});

interface DietFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diet?: Diet;
  pets: Pet[];
  dietTypes: DietType[];
  onSubmit: (data: DietFormData) => void;
}

export function DietForm({ open, onOpenChange, diet, pets, dietTypes, onSubmit }: DietFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DietFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues: diet
      ? {
          ...diet,
          startDate: format(new Date(diet.startDate), 'yyyy-MM-dd'),
          endDate: diet.endDate ? format(new Date(diet.endDate), 'yyyy-MM-dd') : undefined,
        }
      : {},
  });

  const handleFormSubmit = (data: DietFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {diet ? 'Edit Diet' : 'Add New Diet'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pet *</Label>
              <Select
                defaultValue={diet?.petId}
                onValueChange={(value) => setValue('petId', value)}
              >
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
              <Label>Diet Type *</Label>
              <Select
                defaultValue={diet?.dietTypeId}
                onValueChange={(value) => setValue('dietTypeId', value)}
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {dietTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} ({type.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dietTypeId && (
                <p className="text-xs text-destructive">{errors.dietTypeId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="zoo-input"
              />
              {errors.startDate && (
                <p className="text-xs text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="zoo-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedingSchedule">Feeding Schedule *</Label>
            <Input
              id="feedingSchedule"
              {...register('feedingSchedule')}
              className="zoo-input"
              placeholder="e.g., Twice daily - 8:00 AM and 5:00 PM"
            />
            {errors.feedingSchedule && (
              <p className="text-xs text-destructive">{errors.feedingSchedule.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              {...register('quantity')}
              className="zoo-input"
              placeholder="e.g., 5 kg per day"
            />
            {errors.quantity && (
              <p className="text-xs text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              className="zoo-input min-h-[80px]"
              placeholder="Additional notes about the diet..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="mint">
              {diet ? 'Save Changes' : 'Add Diet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
