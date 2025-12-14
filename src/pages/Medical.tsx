import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MedicalRecordCard } from '@/components/medical/MedicalRecordCard';
import { MedicalCheckForm } from '@/components/medical/MedicalCheckForm';
import { Button } from '@/components/ui/button';
import { mockMedicalChecks, mockPets, mockEmployees } from '@/data/mockData';
import { MedicalCheck, MedicalCheckFormData } from '@/types/zoo';
import { Plus, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Medical() {
  const [records, setRecords] = useState<MedicalCheck[]>(mockMedicalChecks);
  const [formOpen, setFormOpen] = useState(false);
  const { toast } = useToast();

  const vets = mockEmployees.filter((e) => e.role === 'Veterinarian');

  const getPet = (petId: string) => mockPets.find((p) => p.id === petId);
  const getVet = (vetId: string) => mockEmployees.find((e) => e.id === vetId);

  const handleAddMedicalCheck = (data: MedicalCheckFormData) => {
    const newRecord: MedicalCheck = {
      ...data,
      id: String(Date.now()),
      checkDate: new Date(data.checkDate),
      nextCheckDate: data.nextCheckDate ? new Date(data.nextCheckDate) : undefined,
      createdAt: new Date(),
    };
    setRecords([newRecord, ...records]);
    
    const pet = getPet(data.petId);
    toast({
      title: 'Medical Check Added',
      description: `Medical check for ${pet?.name || 'pet'} has been recorded.`,
    });
  };

  // Sort records by date (most recent first)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.checkDate).getTime() - new Date(a.checkDate).getTime()
  );

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
      {sortedRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRecords.map((record) => {
            const pet = getPet(record.petId);
            const vet = getVet(record.vetId);
            if (!pet || !vet) return null;
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
        pets={mockPets}
        vets={vets}
        onSubmit={handleAddMedicalCheck}
      />
    </MainLayout>
  );
}
