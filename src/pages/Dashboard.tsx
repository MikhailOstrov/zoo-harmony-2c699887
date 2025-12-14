import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { mockPets, mockEmployees, mockDietTypes, mockMedicalChecks } from '@/data/mockData';
import { PawPrint, Users, UtensilsCrossed, Stethoscope, Heart, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const healthyPets = mockPets.filter((p) => p.healthStatus === 'Healthy').length;
  const needsAttention = mockPets.filter((p) => ['Sick', 'Critical', 'Recovering'].includes(p.healthStatus)).length;
  const vets = mockEmployees.filter((e) => e.role === 'Veterinarian').length;
  const keepers = mockEmployees.filter((e) => e.role === 'Keeper').length;

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back! Here's what's happening at the zoo.">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Animals"
          value={mockPets.length}
          subtitle={`${healthyPets} healthy`}
          icon={PawPrint}
          variant="mint"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Staff Members"
          value={mockEmployees.length}
          subtitle={`${vets} vets, ${keepers} keepers`}
          icon={Users}
          variant="sky"
        />
        <StatCard
          title="Diet Types"
          value={mockDietTypes.length}
          subtitle="Active diet plans"
          icon={UtensilsCrossed}
          variant="yellow"
        />
        <StatCard
          title="Medical Checks"
          value={mockMedicalChecks.length}
          subtitle="This month"
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
                  {mockPets.filter((p) => p.healthStatus === 'Recovering').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm">Needs Care</span>
                </div>
                <span className="font-semibold">
                  {mockPets.filter((p) => ['Sick', 'Critical'].includes(p.healthStatus)).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
