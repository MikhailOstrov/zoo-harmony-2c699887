import { Pet } from '@/types/zoo';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Bird, Bug, PawPrint } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
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

export function PetCard({ pet, onEdit, onDelete }: PetCardProps) {
  const TypeIcon = typeIcons[pet.type];

  return (
    <div className="zoo-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-zoo-sky/30 flex items-center justify-center">
            <TypeIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">{pet.species}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(pet)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(pet)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Habitat</span>
          <span className="font-medium">{pet.habitat}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Gender</span>
          <span className="font-medium">{pet.gender}</span>
        </div>
        {pet.breed && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Breed</span>
            <span className="font-medium">{pet.breed}</span>
          </div>
        )}
      </div>

      {/* Special Fields */}
      {pet.type === 'MigratoryBird' && pet.winteringLocation && (
        <div className="p-3 rounded-xl bg-zoo-sky/50 mb-4">
          <p className="text-xs font-medium text-zoo-sky-dark mb-1">Migration Info</p>
          <p className="text-sm">Winters in {pet.winteringLocation}</p>
          {pet.migrationSeason && (
            <p className="text-xs text-muted-foreground mt-1">{pet.migrationSeason}</p>
          )}
        </div>
      )}

      {pet.type === 'Reptile' && pet.hibernationPeriod && (
        <div className="p-3 rounded-xl bg-zoo-yellow/50 mb-4">
          <p className="text-xs font-medium text-zoo-yellow-dark mb-1">Hibernation Info</p>
          <p className="text-sm">{pet.hibernationPeriod}</p>
          {pet.hibernationTemperature && (
            <p className="text-xs text-muted-foreground mt-1">
              Temp: {pet.hibernationTemperature}°C
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className={cn('zoo-badge', healthStatusColors[pet.healthStatus])}>
          {pet.healthStatus}
        </span>
        <span className="text-xs text-muted-foreground">
          Age: {Math.floor((Date.now() - new Date(pet.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
        </span>
      </div>
    </div>
  );
}
