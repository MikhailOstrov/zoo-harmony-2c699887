import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DietTypeCard } from '@/components/diets/DietTypeCard';
import { DietForm } from '@/components/diets/DietForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDietTypes, useDiets, useAddDietType, useAddDiet, useUpdateDiet, useDeleteDiet, useDeleteDietType, DietFormData, DietTypeFormData } from '@/hooks/use-diets';
import { usePets } from '@/hooks/use-pets';
import { Database } from '@/integrations/supabase/types';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type DietType = Database['public']['Tables']['diet_types']['Row'];
type Diet = Database['public']['Tables']['diets']['Row'];

export default function Diets() {
  const { data: dietTypes = [], isLoading: loadingTypes } = useDietTypes();
  const { data: diets = [], isLoading: loadingDiets } = useDiets();
  const { data: pets = [] } = usePets();
  
  const addDietType = useAddDietType();
  const addDiet = useAddDiet();
  const updateDiet = useUpdateDiet();
  const deleteDiet = useDeleteDiet();
  const deleteDietType = useDeleteDietType();

  const [dietFormOpen, setDietFormOpen] = useState(false);
  const [dietTypeFormOpen, setDietTypeFormOpen] = useState(false);
  const [editingDiet, setEditingDiet] = useState<Diet | undefined>();
  const [deletingDietType, setDeletingDietType] = useState<DietType | undefined>();
  const [deletingDiet, setDeletingDiet] = useState<Diet | undefined>();
  const [newDietType, setNewDietType] = useState<DietTypeFormData>({
    name: '',
    description: '',
  });
  const { toast } = useToast();

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : 'Unknown';
  };

  const getDietTypeName = (dietTypeId: string) => {
    const type = dietTypes.find((t) => t.id === dietTypeId);
    return type ? type.name : 'Unknown';
  };

  const handleAddDiet = async (data: DietFormData) => {
    try {
      await addDiet.mutateAsync(data);
      toast({
        title: 'Diet Added',
        description: 'New diet plan has been created.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add diet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditDiet = async (data: DietFormData) => {
    if (!editingDiet) return;
    try {
      await updateDiet.mutateAsync({ id: editingDiet.id, data });
      setEditingDiet(undefined);
      toast({
        title: 'Diet Updated',
        description: 'Diet plan has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update diet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddDietType = async () => {
    if (!newDietType.name) return;
    try {
      await addDietType.mutateAsync(newDietType);
      setNewDietType({ name: '', description: '' });
      setDietTypeFormOpen(false);
      toast({
        title: 'Diet Type Added',
        description: `${newDietType.name} has been added.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add diet type. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDietType = async () => {
    if (!deletingDietType) return;
    try {
      await deleteDietType.mutateAsync(deletingDietType.id);
      toast({
        title: 'Diet Type Removed',
        description: `${deletingDietType.name} has been removed.`,
      });
      setDeletingDietType(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Cannot delete diet type that is in use.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDiet = async () => {
    if (!deletingDiet) return;
    try {
      await deleteDiet.mutateAsync(deletingDiet.id);
      toast({
        title: 'Diet Removed',
        description: 'Diet plan has been removed.',
      });
      setDeletingDiet(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove diet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = loadingTypes || loadingDiets;

  if (isLoading) {
    return (
      <MainLayout title="Diets" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Diets" subtitle="Manage diet types and feeding plans">
      <Tabs defaultValue="plans" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="plans" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Diet Plans ({diets.length})
            </TabsTrigger>
            <TabsTrigger value="types" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Diet Types ({dietTypes.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="plans">
          <div className="flex justify-end mb-6">
            <Button variant="mint" onClick={() => setDietFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Diet Plan
            </Button>
          </div>

          <div className="zoo-card overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-display font-semibold">Pet</TableHead>
                  <TableHead className="font-display font-semibold">Diet Type</TableHead>
                  <TableHead className="font-display font-semibold">Food</TableHead>
                  <TableHead className="font-display font-semibold">Quantity</TableHead>
                  <TableHead className="font-display font-semibold">Start Date</TableHead>
                  <TableHead className="font-display font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diets.map((diet) => (
                  <TableRow key={diet.id} className="group">
                    <TableCell className="font-medium">{getPetName(diet.pet_id)}</TableCell>
                    <TableCell>
                      <span className="zoo-badge-mint text-xs">{getDietTypeName(diet.diet_type_id)}</span>
                    </TableCell>
                    <TableCell>{diet.food_name}</TableCell>
                    <TableCell>{diet.quantity || '-'}</TableCell>
                    <TableCell>{diet.start_date ? format(new Date(diet.start_date), 'MMM d, yyyy') : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingDiet(diet);
                            setDietFormOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingDiet(diet)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="types">
          <div className="flex justify-end mb-6">
            <Button variant="mint" onClick={() => setDietTypeFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Diet Type
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietTypes.map((type) => (
              <DietTypeCard
                key={type.id}
                dietType={type}
                onDelete={setDeletingDietType}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Diet Form */}
      <DietForm
        open={dietFormOpen}
        onOpenChange={(open) => {
          setDietFormOpen(open);
          if (!open) setEditingDiet(undefined);
        }}
        diet={editingDiet}
        pets={pets}
        dietTypes={dietTypes}
        onSubmit={editingDiet ? handleEditDiet : handleAddDiet}
      />

      {/* Diet Type Form */}
      <Dialog open={dietTypeFormOpen} onOpenChange={setDietTypeFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add Diet Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="typeName">Name *</Label>
              <Input
                id="typeName"
                value={newDietType.name}
                onChange={(e) => setNewDietType({ ...newDietType, name: e.target.value })}
                className="zoo-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeDescription">Description</Label>
              <Textarea
                id="typeDescription"
                value={newDietType.description || ''}
                onChange={(e) => setNewDietType({ ...newDietType, description: e.target.value })}
                className="zoo-input min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDietTypeFormOpen(false)}>
                Cancel
              </Button>
              <Button variant="mint" onClick={handleAddDietType} disabled={!newDietType.name}>
                Add Diet Type
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Diet Type Confirmation */}
      <AlertDialog open={!!deletingDietType} onOpenChange={() => setDeletingDietType(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deletingDietType?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this diet type. Existing diet plans using this type will need to be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDietType} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Diet Confirmation */}
      <AlertDialog open={!!deletingDiet} onOpenChange={() => setDeletingDiet(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this diet plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this diet plan from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDiet} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
