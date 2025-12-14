import { Pet } from '@/types/zoo';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Bird, Bug, PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PetTableProps {
  pets: Pet[];
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
}

const healthStatusColors = {
  Healthy: 'zoo-badge-mint',
  Recovering: 'zoo-badge-yellow',
  Sick: 'zoo-badge-peach',
  Critical: 'bg-destructive text-destructive-foreground',
};

const typeIcons = {
  Regular: PawPrint,
  MigratoryBird: Bird,
  Reptile: Bug,
};

export function PetTable({ pets, onEdit, onDelete }: PetTableProps) {
  return (
    <div className="zoo-card overflow-hidden p-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-display font-semibold">Name</TableHead>
            <TableHead className="font-display font-semibold">Species</TableHead>
            <TableHead className="font-display font-semibold">Type</TableHead>
            <TableHead className="font-display font-semibold">Habitat</TableHead>
            <TableHead className="font-display font-semibold">DOB</TableHead>
            <TableHead className="font-display font-semibold">Status</TableHead>
            <TableHead className="font-display font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pets.map((pet) => {
            const TypeIcon = typeIcons[pet.type];
            return (
              <TableRow key={pet.id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-zoo-sky/30 flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{pet.name}</p>
                      {pet.breed && (
                        <p className="text-xs text-muted-foreground">{pet.breed}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{pet.species}</TableCell>
                <TableCell>
                  <span className="zoo-badge-sky text-xs">{pet.type}</span>
                </TableCell>
                <TableCell>{pet.habitat}</TableCell>
                <TableCell>{format(new Date(pet.dateOfBirth), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <span className={cn('zoo-badge', healthStatusColors[pet.healthStatus])}>
                    {pet.healthStatus}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(pet)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(pet)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
