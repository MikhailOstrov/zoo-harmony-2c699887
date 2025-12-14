import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-20 px-8">
        {/* Title Section */}
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-64 bg-muted/50 border-border rounded-xl focus:bg-card"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* User Avatar */}
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-zoo-sky-dark flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
