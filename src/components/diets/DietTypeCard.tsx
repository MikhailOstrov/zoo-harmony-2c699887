import { DietType } from '@/types/zoo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Beef, Leaf, Apple, Bug } from 'lucide-react';

interface DietTypeCardProps {
  dietType: DietType;
  onEdit: (dietType: DietType) => void;
  onDelete: (dietType: DietType) => void;
}

const categoryConfig = {
  Carnivore: { icon: Beef, color: 'zoo-badge-peach', bg: 'bg-zoo-coral/30' },
  Herbivore: { icon: Leaf, color: 'zoo-badge-mint', bg: 'bg-zoo-mint/30' },
  Omnivore: { icon: Apple, color: 'zoo-badge-yellow', bg: 'bg-zoo-yellow/30' },
  Insectivore: { icon: Bug, color: 'zoo-badge-lavender', bg: 'bg-zoo-lavender/30' },
};

export function DietTypeCard({ dietType, onEdit, onDelete }: DietTypeCardProps) {
  const config = categoryConfig[dietType.category];
  const Icon = config.icon;

  return (
    <div className="zoo-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', config.bg)}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">{dietType.name}</h3>
            <span className={cn('zoo-badge text-xs', config.color)}>{dietType.category}</span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(dietType)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(dietType)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{dietType.description}</p>
    </div>
  );
}
