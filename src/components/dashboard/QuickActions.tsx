import { Plus, Stethoscope, UtensilsCrossed, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Pet',
      icon: Plus,
      variant: 'mint' as const,
      onClick: () => navigate('/pets?action=add'),
    },
    {
      label: 'Medical Check',
      icon: Stethoscope,
      variant: 'yellow' as const,
      onClick: () => navigate('/medical?action=add'),
    },
    {
      label: 'Update Diet',
      icon: UtensilsCrossed,
      variant: 'sky' as const,
      onClick: () => navigate('/diets?action=add'),
    },
    {
      label: 'View Reports',
      icon: ClipboardList,
      variant: 'secondary' as const,
      onClick: () => navigate('/reports'),
    },
  ];

  return (
    <div className="zoo-card">
      <h3 className="font-display font-bold text-lg text-foreground mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="h-auto py-4 flex-col gap-2"
            onClick={action.onClick}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
