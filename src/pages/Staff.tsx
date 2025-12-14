import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StaffCard } from '@/components/staff/StaffCard';
import { StaffForm } from '@/components/staff/StaffForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockEmployees } from '@/data/mockData';
import { Employee, EmployeeFormData } from '@/types/zoo';
import { Plus, Stethoscope, User } from 'lucide-react';
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

export default function Staff() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | undefined>();
  const { toast } = useToast();

  const keepers = employees.filter((e) => e.role === 'Keeper');
  const vets = employees.filter((e) => e.role === 'Veterinarian');

  const getSpouse = (employee: Employee) => {
    if (!employee.spouseId) return undefined;
    return employees.find((e) => e.id === employee.spouseId);
  };

  const handleAddEmployee = (data: EmployeeFormData) => {
    const newEmployee: Employee = {
      ...data,
      id: String(Date.now()),
      hireDate: new Date(data.hireDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // If spouse selected, update spouse's record too
    if (data.spouseId) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === data.spouseId ? { ...e, spouseId: newEmployee.id } : e
        )
      );
    }
    
    setEmployees((prev) => [newEmployee, ...prev]);
    toast({
      title: 'Employee Added',
      description: `${data.firstName} ${data.lastName} has joined the team.`,
    });
  };

  const handleEditEmployee = (data: EmployeeFormData) => {
    if (!editingEmployee) return;
    const updated = employees.map((e) =>
      e.id === editingEmployee.id
        ? { ...e, ...data, hireDate: new Date(data.hireDate), updatedAt: new Date() }
        : e
    );
    setEmployees(updated);
    setEditingEmployee(undefined);
    toast({
      title: 'Employee Updated',
      description: `${data.firstName} ${data.lastName}'s information has been updated.`,
    });
  };

  const handleDeleteEmployee = () => {
    if (!deletingEmployee) return;
    
    // Remove spouse link if exists
    if (deletingEmployee.spouseId) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === deletingEmployee.spouseId ? { ...e, spouseId: undefined } : e
        )
      );
    }
    
    setEmployees((prev) => prev.filter((e) => e.id !== deletingEmployee.id));
    toast({
      title: 'Employee Removed',
      description: `${deletingEmployee.firstName} ${deletingEmployee.lastName} has been removed.`,
    });
    setDeletingEmployee(undefined);
  };

  const openEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

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
              Remove {deletingEmployee?.firstName} {deletingEmployee?.lastName}?
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
