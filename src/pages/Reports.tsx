import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { mockPets, mockEmployees, mockDiets, mockDietTypes, mockMedicalChecks } from '@/data/mockData';
import { Search, Heart, UtensilsCrossed, FileText, Bird, Bug, PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState('');

  // Get married couples
  const marriedCouples = mockEmployees
    .filter((e) => e.spouseId)
    .reduce((acc, emp) => {
      const spouse = mockEmployees.find((e) => e.id === emp.spouseId);
      if (spouse && !acc.some((c) => c.includes(emp.id) && c.includes(spouse.id))) {
        acc.push([emp.id, spouse.id]);
      }
      return acc;
    }, [] as string[][])
    .map((pair) => ({
      employee1: mockEmployees.find((e) => e.id === pair[0])!,
      employee2: mockEmployees.find((e) => e.id === pair[1])!,
    }));

  // Get pets with current diets
  const petsWithDiets = mockPets.map((pet) => {
    const diet = mockDiets.find((d) => d.petId === pet.id && !d.endDate);
    const dietType = diet ? mockDietTypes.find((t) => t.id === diet.dietTypeId) : undefined;
    return { pet, diet, dietType };
  }).filter((p) => p.diet);

  // Filter pets for full info search
  const filteredPets = mockPets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getKeeperName = (keeperId?: string) => {
    if (!keeperId) return 'Unassigned';
    const keeper = mockEmployees.find((e) => e.id === keeperId);
    return keeper ? `${keeper.firstName} ${keeper.lastName}` : 'Unknown';
  };

  const getVetName = (vetId?: string) => {
    if (!vetId) return 'Unassigned';
    const vet = mockEmployees.find((e) => e.id === vetId);
    return vet ? `Dr. ${vet.firstName} ${vet.lastName}` : 'Unknown';
  };

  const typeIcons = {
    Regular: PawPrint,
    MigratoryBird: Bird,
    Reptile: Bug,
  };

  const healthStatusColors = {
    Healthy: 'zoo-badge-mint',
    Recovering: 'zoo-badge-yellow',
    Sick: 'zoo-badge-peach',
    Critical: 'bg-destructive text-destructive-foreground',
  };

  return (
    <MainLayout title="Reports" subtitle="View detailed information and analytics">
      <Tabs defaultValue="pet-info" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="pet-info" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <FileText className="w-4 h-4 mr-1" />
            Full Pet Info
          </TabsTrigger>
          <TabsTrigger value="couples" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Heart className="w-4 h-4 mr-1" />
            Married Couples
          </TabsTrigger>
          <TabsTrigger value="current-diets" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <UtensilsCrossed className="w-4 h-4 mr-1" />
            Current Diets
          </TabsTrigger>
        </TabsList>

        {/* Full Pet Info */}
        <TabsContent value="pet-info">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or species..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 zoo-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPets.map((pet) => {
              const TypeIcon = typeIcons[pet.type];
              const currentDiet = mockDiets.find((d) => d.petId === pet.id && !d.endDate);
              const dietType = currentDiet ? mockDietTypes.find((t) => t.id === currentDiet.dietTypeId) : undefined;
              const recentMedical = mockMedicalChecks
                .filter((m) => m.petId === pet.id)
                .sort((a, b) => new Date(b.checkDate).getTime() - new Date(a.checkDate).getTime())[0];

              return (
                <div key={pet.id} className="zoo-card">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4 pb-4 border-b border-border">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-zoo-sky/30 flex items-center justify-center">
                      <TypeIcon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-xl">{pet.name}</h3>
                        <span className={cn('zoo-badge', healthStatusColors[pet.healthStatus])}>
                          {pet.healthStatus}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {pet.species} {pet.breed ? `• ${pet.breed}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{format(new Date(pet.dateOfBirth), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="font-medium">{pet.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Habitat</p>
                      <p className="font-medium">{pet.habitat}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium">{pet.type}</p>
                    </div>
                  </div>

                  {/* Staff */}
                  <div className="p-3 rounded-xl bg-muted/50 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Keeper</p>
                        <p className="font-medium">{getKeeperName(pet.keeperId)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Veterinarian</p>
                        <p className="font-medium">{getVetName(pet.vetId)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Diet */}
                  {currentDiet && dietType && (
                    <div className="p-3 rounded-xl bg-zoo-mint/30 mb-4">
                      <p className="text-xs font-medium text-primary mb-1">Current Diet</p>
                      <p className="font-medium">{dietType.name}</p>
                      <p className="text-sm text-muted-foreground">{currentDiet.feedingSchedule}</p>
                    </div>
                  )}

                  {/* Recent Medical */}
                  {recentMedical && (
                    <div className="p-3 rounded-xl bg-zoo-sky/30">
                      <p className="text-xs font-medium text-zoo-sky-dark mb-1">Last Medical Check</p>
                      <p className="text-sm">{recentMedical.diagnosis}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(recentMedical.checkDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}

                  {/* Special Fields */}
                  {pet.type === 'MigratoryBird' && pet.winteringLocation && (
                    <div className="mt-4 p-3 rounded-xl bg-zoo-lavender/50">
                      <p className="text-xs font-medium text-accent-foreground mb-1">Migration Info</p>
                      <p className="text-sm">Winters in {pet.winteringLocation}</p>
                      {pet.migrationSeason && (
                        <p className="text-xs text-muted-foreground">{pet.migrationSeason}</p>
                      )}
                    </div>
                  )}

                  {pet.type === 'Reptile' && pet.hibernationPeriod && (
                    <div className="mt-4 p-3 rounded-xl bg-zoo-yellow/50">
                      <p className="text-xs font-medium text-zoo-yellow-dark mb-1">Hibernation Info</p>
                      <p className="text-sm">{pet.hibernationPeriod}</p>
                      {pet.hibernationTemperature && (
                        <p className="text-xs text-muted-foreground">Temp: {pet.hibernationTemperature}°C</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Married Couples */}
        <TabsContent value="couples">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marriedCouples.length > 0 ? (
              marriedCouples.map((couple, index) => (
                <div key={index} className="zoo-card">
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-destructive animate-bounce-gentle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="font-display font-bold">
                        {couple.employee1.firstName} {couple.employee1.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{couple.employee1.role}</p>
                      <p className="text-xs text-muted-foreground">{couple.employee1.department}</p>
                    </div>
                    <div className="px-4">
                      <span className="text-2xl">💕</span>
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-display font-bold">
                        {couple.employee2.firstName} {couple.employee2.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{couple.employee2.role}</p>
                      <p className="text-xs text-muted-foreground">{couple.employee2.department}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No married couples found in the staff records.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Current Diets */}
        <TabsContent value="current-diets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petsWithDiets.map(({ pet, diet, dietType }) => (
              <div key={pet.id} className="zoo-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zoo-mint to-primary/30 flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">{pet.species}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Diet Type</span>
                    <span className="font-medium">{dietType?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="zoo-badge-mint text-xs">{dietType?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Schedule</span>
                    <span className="font-medium text-sm">{diet?.feedingSchedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <span className="font-medium text-sm">{diet?.quantity}</span>
                  </div>
                </div>

                {diet?.notes && (
                  <p className="mt-3 text-sm text-muted-foreground italic">"{diet.notes}"</p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
