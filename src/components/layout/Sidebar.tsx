import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PawPrint,
  Users,
  UtensilsCrossed,
  ClipboardList,
  Stethoscope,
  Heart,
  Bird,
  Leaf,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pets', href: '/pets', icon: PawPrint },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Diets', href: '/diets', icon: UtensilsCrossed },
  { name: 'Reports', href: '/reports', icon: ClipboardList },
  { name: 'Medical Records', href: '/medical', icon: Stethoscope },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-zoo-mint-dark flex items-center justify-center shadow-zoo">
            <PawPrint className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zoo-yellow flex items-center justify-center">
            <Heart className="w-3 h-3 text-secondary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-sidebar-foreground">ZooKeeper</h1>
          <p className="text-xs text-muted-foreground">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-zoo'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Decorative Elements */}
      <div className="absolute bottom-6 left-4 right-4 p-4 rounded-2xl bg-gradient-to-br from-zoo-mint/50 to-zoo-sky/50 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Bird className="w-5 h-5 text-zoo-sky-dark animate-bounce-gentle" />
          <Leaf className="w-4 h-4 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground">
          Caring for <span className="font-semibold text-foreground">6 animals</span> today
        </p>
      </div>
    </aside>
  );
}
