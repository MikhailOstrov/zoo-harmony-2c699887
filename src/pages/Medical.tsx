import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MedicalRecordCard } from '@/components/medical/MedicalRecordCard';
import { MedicalCheckForm } from '@/components/medical/MedicalCheckForm';
import { Button } from '@/components/ui/button';
import { useMedicalChecks, useAddMedicalCheck, MedicalCheckFormData } from '@/hooks/use-medical';
import { usePets } from '@/hooks/use-pets';
import { useEmployees } from '@/hooks/use-employees';
import { Plus, Stethoscope, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Medical() {
  const { data: records = [], isLoading: loadingRecords } = useMedicalChecks();
  const { data: pets = [], isLoading: loadingPets } = usePets();
  const { data: employees = [], isLoading: loadingEmployees } = useEmployees();
  const addMedicalCheck = useAddMedicalCheck();

  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();

  const vets = employees.filter((e) => e.role === 'Veterinarian');

  const getPet = (petId: string) => pets.find((p) => p.id === petId);
  const getVet = (vetId: string | null) => vetId ? employees.find((e) => e.id === vetId) : undefined;

  const handleAddMedicalCheck = async (data: MedicalCheckFormData) => {
    try {
      await addMedicalCheck.mutateAsync(data);
      const pet = getPet(data.petId);
      toast({
        title: 'Medical Check Added',
        description: `Medical check for ${pet?.name || 'pet'} has been recorded.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add medical check. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = loadingRecords || loadingPets || loadingEmployees;

  if (isLoading) {
    return (
      <MainLayout title="Medical Records" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Medical Records" subtitle={`${records.length} medical checks on file`}>
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Stethoscope className="w-5 h-5" />
          <span>Track and manage animal health</span>
        </div>
        <Button variant="mint" onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Medical Check
        </Button>
      </div>

      {/* Records Grid */}
      {records.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => {
            const pet = getPet(record.pet_id);
            const vet = getVet(record.vet_id);
            if (!pet) return null;
            return (
              <MedicalRecordCard key={record.id} record={record} pet={pet} vet={vet} />
            );
          })}
        </div>
      ) : (
        <div className="zoo-card text-center py-12">
          <Stethoscope className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl mb-2">No Medical Records</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding a medical check for one of the animals.
          </p>
          <Button variant="mint" onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Medical Check
          </Button>
        </div>
      )}

      {/* Add Form */}
      <MedicalCheckForm
        open={formOpen}
        onOpenChange={setFormOpen}
        pets={pets}
        vets={vets}
        onSubmit={handleAddMedicalCheck}
      />
    </MainLayout>
  );
}
