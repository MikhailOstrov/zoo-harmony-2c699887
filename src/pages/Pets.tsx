import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PetTable } from '@/components/pets/PetTable';
import { PetCard } from '@/components/pets/PetCard';
import { PetForm } from '@/components/pets/PetForm';
import { Button } from '@/components/ui/button';
import { mockPets } from '@/data/mockData';
import { Pet, PetFormData } from '@/types/zoo';
import { Plus, LayoutGrid, List } from 'lucide-react';
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

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [formOpen, setFormOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>();
  const [deletingPet, setDeletingPet] = useState<Pet | undefined>();
  const { toast } = useToast();

  const handleAddPet = (data: PetFormData) => {
    const newPet: Pet = {
      ...data,
      id: String(Date.now()),
      dateOfBirth: new Date(data.dateOfBirth),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPets([newPet, ...pets]);
    toast({
      title: 'Pet Added',
      description: `${data.name} has been added to the zoo.`,
    });
  };

  const handleEditPet = (data: PetFormData) => {
    if (!editingPet) return;
    const updated = pets.map((p) =>
      p.id === editingPet.id
        ? { ...p, ...data, dateOfBirth: new Date(data.dateOfBirth), updatedAt: new Date() }
        : p
    );
    setPets(updated);
    setEditingPet(undefined);
    toast({
      title: 'Pet Updated',
      description: `${data.name}'s information has been updated.`,
    });
  };

  const handleDeletePet = () => {
    if (!deletingPet) return;
    setPets(pets.filter((p) => p.id !== deletingPet.id));
    toast({
      title: 'Pet Removed',
      description: `${deletingPet.name} has been removed from the zoo.`,
    });
    setDeletingPet(undefined);
  };

  const openEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormOpen(true);
  };

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
