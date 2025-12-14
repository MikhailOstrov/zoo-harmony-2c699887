import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StaffCard } from '@/components/staff/StaffCard';
import { StaffForm } from '@/components/staff/StaffForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployees, useAddEmployee, useUpdateEmployee, useDeleteEmployee, EmployeeFormData } from '@/hooks/use-employees';
import { Database } from '@/integrations/supabase/types';
import { Plus, Stethoscope, User, Loader2 } from 'lucide-react';
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

type Employee = Database['public']['Tables']['employees']['Row'];

export default function Staff() {
  const { data: employees = [], isLoading } = useEmployees();
  const addEmployee = useAddEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | undefined>();
  const { toast } = useToast();

  const keepers = employees.filter((e) => e.role === 'Keeper');
  const vets = employees.filter((e) => e.role === 'Veterinarian');

  const getSpouse = (employee: Employee) => {
    if (!employee.spouse_id) return undefined;
    return employees.find((e) => e.id === employee.spouse_id);
  };

  const handleAddEmployee = async (data: EmployeeFormData) => {
    try {
      const newId = await addEmployee.mutateAsync(data);
      
      // If spouse selected, update spouse's record too
      if (data.spouseId && newId) {
        await updateEmployee.mutateAsync({
          id: data.spouseId,
          data: { spouseId: newId },
        });
      }
      
      toast({
        title: 'Employee Added',
        description: `${data.firstName} ${data.lastName} has joined the team.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add employee. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditEmployee = async (data: EmployeeFormData) => {
    if (!editingEmployee) return;
    try {
      await updateEmployee.mutateAsync({ id: editingEmployee.id, data });
      setEditingEmployee(undefined);
      toast({
        title: 'Employee Updated',
        description: `${data.firstName} ${data.lastName}'s information has been updated.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update employee. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;
    try {
      // Remove spouse link if exists
      if (deletingEmployee.spouse_id) {
        await updateEmployee.mutateAsync({
          id: deletingEmployee.spouse_id,
          data: { spouseId: undefined },
        });
      }
      
      await deleteEmployee.mutateAsync(deletingEmployee.id);
      toast({
        title: 'Employee Removed',
        description: `${deletingEmployee.first_name} ${deletingEmployee.last_name} has been removed.`,
      });
      setDeletingEmployee(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove employee. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  if (isLoading) {
    return (
      <MainLayout title="Staff" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Staff" subtitle={`Managing ${employees.length} team members`}>
      {/* Actions Bar */}
      <div className="flex items-center justify-end mb-6">
        <Button variant="mint" onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            All Staff ({employees.length})
          </TabsTrigger>
          <TabsTrigger value="keepers" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <User className="w-4 h-4 mr-1" />
            Keepers ({keepers.length})
          </TabsTrigger>
          <TabsTrigger value="vets" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Stethoscope className="w-4 h-4 mr-1" />
            Veterinarians ({vets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <StaffCard
                key={employee.id}
                employee={employee}
                spouse={getSpouse(employee)}
                onEdit={openEdit}
                onDelete={setDeletingEmployee}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="keepers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keepers.map((employee) => (
              <StaffCard
                key={employee.id}
                employee={employee}
                spouse={getSpouse(employee)}
                onEdit={openEdit}
                onDelete={setDeletingEmployee}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vets.map((employee) => (
              <StaffCard
                key={employee.id}
                employee={employee}
                spouse={getSpouse(employee)}
                onEdit={openEdit}
                onDelete={setDeletingEmployee}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Form */}
      <StaffForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingEmployee(undefined);
        }}
        employee={editingEmployee}
        employees={employees}
        onSubmit={editingEmployee ? handleEditEmployee : handleAddEmployee}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingEmployee} onOpenChange={() => setDeletingEmployee(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {deletingEmployee?.first_name} {deletingEmployee?.last_name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this
              employee from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
