import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { usePets } from '@/hooks/use-pets';
import { useEmployees } from '@/hooks/use-employees';
import { useDietTypes } from '@/hooks/use-diets';
import { useMedicalChecks } from '@/hooks/use-medical';
import { PawPrint, Users, UtensilsCrossed, Stethoscope, AlertTriangle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { data: pets = [], isLoading: loadingPets } = usePets();
  const { data: employees = [], isLoading: loadingEmployees } = useEmployees();
  const { data: dietTypes = [], isLoading: loadingDietTypes } = useDietTypes();
  const { data: medicalChecks = [], isLoading: loadingMedical } = useMedicalChecks();

  const healthyPets = pets.filter((p) => p.health_status === 'Healthy').length;
  const needsAttention = pets.filter((p) => ['Sick', 'Critical', 'Recovering', 'Under Treatment'].includes(p.health_status || '')).length;
  const vets = employees.filter((e) => e.role === 'Veterinarian').length;
  const keepers = employees.filter((e) => e.role === 'Keeper').length;

  const isLoading = loadingPets || loadingEmployees || loadingDietTypes || loadingMedical;

  if (isLoading) {
    return (
      <MainLayout title="Dashboard" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's what's happening at the zoo.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Animals"
          value={pets.length}
          subtitle={`${healthyPets} healthy`}
          icon={PawPrint}
          variant="mint"
        />
        <StatCard
          title="Staff Members"
          value={employees.length}
          subtitle={`${vets} vets, ${keepers} keepers`}
          icon={Users}
          variant="sky"
        />
        <StatCard
          title="Diet Types"
          value={dietTypes.length}
          subtitle="Active diet plans"
          icon={UtensilsCrossed}
          variant="yellow"
        />
        <StatCard
          title="Medical Checks"
          value={medicalChecks.length}
          subtitle="Total records"
          icon={Stethoscope}
          variant="default"
        />
      </div>

      {/* Alert Cards */}
      {needsAttention > 0 && (
        <div className="mb-8 p-4 rounded-2xl bg-zoo-peach/50 border border-destructive/20 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-destructive/10">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">Attention Required</h3>
            <p className="text-sm text-muted-foreground">
              {needsAttention} animal(s) need medical attention or are in recovery.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />

          {/* Health Overview */}
          <div className="mt-6 zoo-card">
            <h3 className="font-display font-bold text-lg text-foreground mb-4">
              Health Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">Healthy</span>
                </div>
                <span className="font-semibold">{healthyPets}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zoo-yellow-dark" />
                  <span className="text-sm">Recovering</span>
                </div>
                <span className="font-semibold">
                  {pets.filter((p) => p.health_status === 'Recovering').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm">Needs Care</span>
                </div>
                <span className="font-semibold">
                  {pets.filter((p) => ['Sick', 'Critical', 'Under Treatment'].includes(p.health_status || '')).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
