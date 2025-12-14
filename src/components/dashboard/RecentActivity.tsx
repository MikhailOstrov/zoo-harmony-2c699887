import { Stethoscope, UtensilsCrossed, PawPrint, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
  {
    id: 1,
    type: 'medical',
    title: 'Medical checkup completed',
    description: 'Ella the elephant had her routine checkup',
    time: '2 hours ago',
    icon: Stethoscope,
    color: 'bg-zoo-peach text-destructive',
  },
  {
    id: 2,
    type: 'feeding',
    title: 'Feeding schedule updated',
    description: "Leo's diet adjusted per vet recommendation",
    time: '4 hours ago',
    icon: UtensilsCrossed,
    color: 'bg-zoo-yellow text-zoo-yellow-dark',
  },
  {
    id: 3,
    type: 'pet',
    title: 'New animal registered',
    description: 'Sunny the Barn Swallow joined our sanctuary',
    time: '1 day ago',
    icon: PawPrint,
    color: 'bg-zoo-mint text-primary',
  },
  {
    id: 4,
    type: 'staff',
    title: 'New keeper hired',
    description: 'Lisa Williams joined the Bird Sanctuary team',
    time: '3 days ago',
    icon: UserPlus,
    color: 'bg-zoo-sky text-zoo-sky-dark',
  },
];

export function RecentActivity() {
  return (
    <div className="zoo-card">
      <h3 className="font-display font-bold text-lg text-foreground mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn('p-2 rounded-xl', activity.color)}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
