import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { usePetFullInfo } from '@/hooks/use-medical';
import { useMarriedCouples } from '@/hooks/use-employees';
import { usePetsWithDiets } from '@/hooks/use-diets';
import { Search, Heart, UtensilsCrossed, FileText, Bird, Bug, PawPrint, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: petFullInfo = [], isLoading: loadingPets } = usePetFullInfo(searchQuery || undefined);
  const { data: marriedCouples = [], isLoading: loadingCouples } = useMarriedCouples();
  const { data: petsWithDiets = [], isLoading: loadingDiets } = usePetsWithDiets();

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Mammal: PawPrint,
    Bird: Bird,
    Reptile: Bug,
    Amphibian: Bug,
    Fish: PawPrint,
    Invertebrate: Bug,
  };

  const healthStatusColors: Record<string, string> = {
    Healthy: 'zoo-badge-mint',
    Recovering: 'zoo-badge-yellow',
    Sick: 'zoo-badge-peach',
    Critical: 'bg-destructive text-destructive-foreground',
    'Under Treatment': 'zoo-badge-peach',
  };

  const isLoading = loadingPets || loadingCouples || loadingDiets;

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
                placeholder="Search by name, species, or enclosure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 zoo-input"
              />
            </div>
          </div>

          {loadingPets ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {petFullInfo.map((pet) => {
                const TypeIcon = typeIcons[pet.species_type] || PawPrint;

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
                          {pet.health_status && (
                            <span className={cn('zoo-badge', healthStatusColors[pet.health_status] || 'zoo-badge-mint')}>
                              {pet.health_status}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground">{pet.species}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">
                          {pet.date_of_birth ? format(new Date(pet.date_of_birth), 'MMM d, yyyy') : 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Gender</p>
                        <p className="font-medium">{pet.gender || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Enclosure</p>
                        <p className="font-medium">{pet.enclosure || 'Not assigned'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className="font-medium">{pet.weight ? `${pet.weight} kg` : 'Unknown'}</p>
                      </div>
                    </div>

                    {/* Staff */}
                    {pet.last_vet && (
                      <div className="p-3 rounded-xl bg-muted/50 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Last Veterinarian</p>
                          <p className="font-medium">Dr. {pet.last_vet}</p>
                        </div>
                      </div>
                    )}

                    {/* Current Diet */}
                    {pet.current_diet && (
                      <div className="p-3 rounded-xl bg-zoo-mint/30 mb-4">
                        <p className="text-xs font-medium text-primary mb-1">Current Diet</p>
                        <p className="font-medium">{pet.current_diet}</p>
                      </div>
                    )}

                    {/* Recent Medical */}
                    {pet.last_medical_check && (
                      <div className="p-3 rounded-xl bg-zoo-sky/30">
                        <p className="text-xs font-medium text-zoo-sky-dark mb-1">Last Medical Check</p>
                        <p className="text-sm">
                          {format(new Date(pet.last_medical_check), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}

                    {/* Special Fields for Birds */}
                    {pet.species_type === 'Bird' && pet.wintering_location && (
                      <div className="mt-4 p-3 rounded-xl bg-zoo-lavender/50">
                        <p className="text-xs font-medium text-accent-foreground mb-1">Migration Info</p>
                        <p className="text-sm">Winters in {pet.wintering_location}</p>
                      </div>
                    )}

                    {/* Special Fields for Reptiles */}
                    {pet.species_type === 'Reptile' && (pet.hibernation_start || pet.hibernation_end) && (
                      <div className="mt-4 p-3 rounded-xl bg-zoo-yellow/50">
                        <p className="text-xs font-medium text-zoo-yellow-dark mb-1">Hibernation Info</p>
                        <p className="text-sm">
                          {pet.hibernation_start && `From: ${format(new Date(pet.hibernation_start), 'MMM d')}`}
                          {pet.hibernation_end && ` To: ${format(new Date(pet.hibernation_end), 'MMM d')}`}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {petFullInfo.length === 0 && !loadingPets && (
                <div className="col-span-full text-center py-12">
                  <PawPrint className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No pets found matching your search.' : 'No pets in the database yet.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Married Couples */}
        <TabsContent value="couples">
          {loadingCouples ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marriedCouples.length > 0 ? (
                marriedCouples.map((couple, index) => (
                  <div key={index} className="zoo-card">
                    <div className="flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 text-destructive animate-bounce-gentle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="font-display font-bold">{couple.employee1_name}</p>
                        <p className="text-sm text-muted-foreground">{couple.employee1_role}</p>
                      </div>
                      <div className="px-4">
                        <span className="text-2xl">💕</span>
                      </div>
                      <div className="text-center flex-1">
                        <p className="font-display font-bold">{couple.employee2_name}</p>
                        <p className="text-sm text-muted-foreground">{couple.employee2_role}</p>
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
          )}
        </TabsContent>

        {/* Current Diets */}
        <TabsContent value="current-diets">
          {loadingDiets ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {petsWithDiets.length > 0 ? (
                petsWithDiets.map((item) => (
                  <div key={item.pet_id} className="zoo-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zoo-mint to-primary/30 flex items-center justify-center">
                        <UtensilsCrossed className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold">{item.pet_name}</h3>
                        <p className="text-sm text-muted-foreground">{item.species}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Diet Type</span>
                        <span className="font-medium">{item.diet_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Food</span>
                        <span className="font-medium">{item.food_name}</span>
                      </div>
                      {item.quantity && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Quantity</span>
                          <span className="font-medium text-sm">{item.quantity}</span>
                        </div>
                      )}
                      {item.feeding_time && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Feeding Time</span>
                          <span className="font-medium text-sm">{item.feeding_time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <UtensilsCrossed className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active diet plans found.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
