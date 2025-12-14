import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PetTable } from '@/components/pets/PetTable';
import { PetCard } from '@/components/pets/PetCard';
import { PetForm } from '@/components/pets/PetForm';
import { Button } from '@/components/ui/button';
import { usePets, useAddPet, useUpdatePet, useDeletePet, PetFormData } from '@/hooks/use-pets';
import { Database } from '@/integrations/supabase/types';
import { Plus, LayoutGrid, List, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

type Pet = Database['public']['Tables']['pets']['Row'];

export default function Pets() {
  const { data: pets = [], isLoading } = usePets();
  const addPet = useAddPet();
  const updatePet = useUpdatePet();
  const deletePet = useDeletePet();

  const [view, setView] = useState<'table' | 'grid'>('table');
  const [formOpen, setFormOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>();
  const [deletingPet, setDeletingPet] = useState<Pet | undefined>();
  const { toast } = useToast();

  const handleAddPet = async (data: PetFormData) => {
    try {
      await addPet.mutateAsync(data);
      toast({
        title: 'Pet Added',
        description: `${data.name} has been added to the zoo.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add pet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditPet = async (data: PetFormData) => {
    if (!editingPet) return;
    try {
      await updatePet.mutateAsync({ id: editingPet.id, data });
      setEditingPet(undefined);
      toast({
        title: 'Pet Updated',
        description: `${data.name}'s information has been updated.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update pet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePet = async () => {
    if (!deletingPet) return;
    try {
      await deletePet.mutateAsync(deletingPet.id);
      toast({
        title: 'Pet Removed',
        description: `${deletingPet.name} has been removed from the zoo.`,
      });
      setDeletingPet(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove pet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormOpen(true);
  };

  if (isLoading) {
    return (
      <MainLayout title="Pets" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Pets" subtitle={`Managing ${pets.length} animals in the zoo`}>
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
          >
            <List className="w-4 h-4 mr-1" />
            Table
          </Button>
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="w-4 h-4 mr-1" />
            Grid
          </Button>
        </div>
        <Button variant="mint" onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Pet
        </Button>
      </div>

      {/* Content */}
      {view === 'table' ? (
        <PetTable pets={pets} onEdit={openEdit} onDelete={setDeletingPet} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onEdit={openEdit} onDelete={setDeletingPet} />
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      <PetForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingPet(undefined);
        }}
        pet={editingPet}
        onSubmit={editingPet ? handleEditPet : handleAddPet}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingPet} onOpenChange={() => setDeletingPet(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deletingPet?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{' '}
              {deletingPet?.name} from the zoo records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePet} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
