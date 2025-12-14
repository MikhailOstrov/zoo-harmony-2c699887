import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Database } from '@/integrations/supabase/types';
import { DietFormData } from '@/hooks/use-diets';
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

type Pet = Database['public']['Tables']['pets']['Row'];
type DietType = Database['public']['Tables']['diet_types']['Row'];
type Diet = Database['public']['Tables']['diets']['Row'];

const dietSchema = z.object({
  petId: z.string().min(1, 'Pet is required'),
  dietTypeId: z.string().min(1, 'Diet type is required'),
  foodName: z.string().min(1, 'Food name is required'),
  quantity: z.string().optional(),
  feedingTime: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
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
          petId: diet.pet_id,
          dietTypeId: diet.diet_type_id,
          foodName: diet.food_name,
          quantity: diet.quantity || undefined,
          feedingTime: diet.feeding_time || undefined,
          startDate: diet.start_date || undefined,
          endDate: diet.end_date || undefined,
          notes: diet.notes || undefined,
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
                defaultValue={diet?.pet_id}
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
                defaultValue={diet?.diet_type_id}
                onValueChange={(value) => setValue('dietTypeId', value)}
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {dietTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dietTypeId && (
                <p className="text-xs text-destructive">{errors.dietTypeId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="foodName">Food Name *</Label>
            <Input
              id="foodName"
              {...register('foodName')}
              className="zoo-input"
              placeholder="e.g., Raw chicken, Fresh vegetables"
            />
            {errors.foodName && (
              <p className="text-xs text-destructive">{errors.foodName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                {...register('quantity')}
                className="zoo-input"
                placeholder="e.g., 5 kg per day"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedingTime">Feeding Time</Label>
              <Input
                id="feedingTime"
                {...register('feedingTime')}
                className="zoo-input"
                placeholder="e.g., 8:00 AM, 5:00 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="zoo-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="zoo-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              className="zoo-input min-h-[80px]"
              placeholder="Additional notes..."
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
