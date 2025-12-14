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
import { mockDietTypes, mockDiets, mockPets } from '@/data/mockData';
import { DietType, Diet, DietFormData, DietTypeFormData } from '@/types/zoo';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Diets() {
  const [dietTypes, setDietTypes] = useState<DietType[]>(mockDietTypes);
  const [diets, setDiets] = useState<Diet[]>(mockDiets);
  const [dietFormOpen, setDietFormOpen] = useState(false);
  const [dietTypeFormOpen, setDietTypeFormOpen] = useState(false);
  const [editingDiet, setEditingDiet] = useState<Diet | undefined>();
  const [editingDietType, setEditingDietType] = useState<DietType | undefined>();
  const [deletingDietType, setDeletingDietType] = useState<DietType | undefined>();
  const [deletingDiet, setDeletingDiet] = useState<Diet | undefined>();
  const [newDietType, setNewDietType] = useState<DietTypeFormData>({
    name: '',
    description: '',
    category: 'Omnivore',
  });
  const { toast } = useToast();

  const getPetName = (petId: string) => {
    const pet = mockPets.find((p) => p.id === petId);
    return pet ? pet.name : 'Unknown';
  };

  const getDietTypeName = (dietTypeId: string) => {
    const type = dietTypes.find((t) => t.id === dietTypeId);
    return type ? type.name : 'Unknown';
  };

  const handleAddDiet = (data: DietFormData) => {
    const newDiet: Diet = {
      ...data,
      id: String(Date.now()),
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      createdAt: new Date(),
    };
    setDiets([newDiet, ...diets]);
    toast({
      title: 'Diet Added',
      description: 'New diet plan has been created.',
    });
  };

  const handleEditDiet = (data: DietFormData) => {
    if (!editingDiet) return;
    const updated = diets.map((d) =>
      d.id === editingDiet.id
        ? {
            ...d,
            ...data,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : undefined,
          }
        : d
    );
    setDiets(updated);
    setEditingDiet(undefined);
    toast({
      title: 'Diet Updated',
      description: 'Diet plan has been updated.',
    });
  };

  const handleAddDietType = () => {
    const newType: DietType = {
      ...newDietType,
      id: String(Date.now()),
      createdAt: new Date(),
    };
    setDietTypes([newType, ...dietTypes]);
    setNewDietType({ name: '', description: '', category: 'Omnivore' });
    setDietTypeFormOpen(false);
    toast({
      title: 'Diet Type Added',
      description: `${newDietType.name} has been added.`,
    });
  };

  const handleDeleteDietType = () => {
    if (!deletingDietType) return;
    setDietTypes(dietTypes.filter((t) => t.id !== deletingDietType.id));
    toast({
      title: 'Diet Type Removed',
      description: `${deletingDietType.name} has been removed.`,
    });
    setDeletingDietType(undefined);
  };

  const handleDeleteDiet = () => {
    if (!deletingDiet) return;
    setDiets(diets.filter((d) => d.id !== deletingDiet.id));
    toast({
      title: 'Diet Removed',
      description: 'Diet plan has been removed.',
    });
    setDeletingDiet(undefined);
  };

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
                  <TableHead className="font-display font-semibold">Schedule</TableHead>
                  <TableHead className="font-display font-semibold">Quantity</TableHead>
                  <TableHead className="font-display font-semibold">Start Date</TableHead>
                  <TableHead className="font-display font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diets.map((diet) => (
                  <TableRow key={diet.id} className="group">
                    <TableCell className="font-medium">{getPetName(diet.petId)}</TableCell>
                    <TableCell>
                      <span className="zoo-badge-mint text-xs">{getDietTypeName(diet.dietTypeId)}</span>
                    </TableCell>
                    <TableCell>{diet.feedingSchedule}</TableCell>
                    <TableCell>{diet.quantity}</TableCell>
                    <TableCell>{format(new Date(diet.startDate), 'MMM d, yyyy')}</TableCell>
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
                onEdit={(t) => {
                  setEditingDietType(t);
                  setNewDietType({
                    name: t.name,
                    description: t.description,
                    category: t.category,
                  });
                  setDietTypeFormOpen(true);
                }}
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
        pets={mockPets}
        dietTypes={dietTypes}
        onSubmit={editingDiet ? handleEditDiet : handleAddDiet}
      />

      {/* Diet Type Form */}
      <Dialog open={dietTypeFormOpen} onOpenChange={setDietTypeFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingDietType ? 'Edit Diet Type' : 'Add Diet Type'}
            </DialogTitle>
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
              <Label>Category *</Label>
              <Select
                value={newDietType.category}
                onValueChange={(value) =>
                  setNewDietType({
                    ...newDietType,
                    category: value as 'Carnivore' | 'Herbivore' | 'Omnivore' | 'Insectivore',
                  })
                }
              >
                <SelectTrigger className="zoo-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Carnivore">Carnivore</SelectItem>
                  <SelectItem value="Herbivore">Herbivore</SelectItem>
                  <SelectItem value="Omnivore">Omnivore</SelectItem>
                  <SelectItem value="Insectivore">Insectivore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeDescription">Description *</Label>
              <Textarea
                id="typeDescription"
                value={newDietType.description}
                onChange={(e) => setNewDietType({ ...newDietType, description: e.target.value })}
                className="zoo-input min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDietTypeFormOpen(false)}>
                Cancel
              </Button>
              <Button variant="mint" onClick={handleAddDietType}>
                {editingDietType ? 'Save Changes' : 'Add Diet Type'}
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
