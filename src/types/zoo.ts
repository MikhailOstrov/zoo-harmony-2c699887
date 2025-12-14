// Pet Types
export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  habitat: string;
  healthStatus: 'Healthy' | 'Sick' | 'Critical' | 'Recovering';
  keeperId?: string;
  vetId?: string;
  type: 'Regular' | 'MigratoryBird' | 'Reptile';
  // Migratory Bird specific
  winteringLocation?: string;
  migrationSeason?: string;
  // Reptile specific
  hibernationPeriod?: string;
  hibernationTemperature?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PetFormData {
  name: string;
  species: string;
  breed?: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  habitat: string;
  healthStatus: 'Healthy' | 'Sick' | 'Critical' | 'Recovering';
  keeperId?: string;
  vetId?: string;
  type: 'Regular' | 'MigratoryBird' | 'Reptile';
  winteringLocation?: string;
  migrationSeason?: string;
  hibernationPeriod?: string;
  hibernationTemperature?: number;
}

// Employee Types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Keeper' | 'Veterinarian';
  department: string;
  hireDate: Date;
  salary: number;
  spouseId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Keeper' | 'Veterinarian';
  department: string;
  hireDate: string;
  salary: number;
  spouseId?: string;
}

// Diet Types
export interface DietType {
  id: string;
  name: string;
  description: string;
  category: 'Carnivore' | 'Herbivore' | 'Omnivore' | 'Insectivore';
  createdAt: Date;
}

export interface DietTypeFormData {
  name: string;
  description: string;
  category: 'Carnivore' | 'Herbivore' | 'Omnivore' | 'Insectivore';
}

export interface Diet {
  id: string;
  petId: string;
  dietTypeId: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  feedingSchedule: string;
  quantity: string;
  createdAt: Date;
}

export interface DietFormData {
  petId: string;
  dietTypeId: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  feedingSchedule: string;
  quantity: string;
}

// Medical Record Types
export interface MedicalCheck {
  id: string;
  petId: string;
  vetId: string;
  checkDate: Date;
  diagnosis: string;
  treatment?: string;
  medications?: string;
  nextCheckDate?: Date;
  notes?: string;
  createdAt: Date;
}

export interface MedicalCheckFormData {
  petId: string;
  vetId: string;
  checkDate: string;
  diagnosis: string;
  treatment?: string;
  medications?: string;
  nextCheckDate?: string;
  notes?: string;
}

// Report Types
export interface PetFullInfo {
  pet: Pet;
  keeper?: Employee;
  vet?: Employee;
  currentDiet?: Diet & { dietType: DietType };
  recentMedicalCheck?: MedicalCheck;
}

export interface MarriedCouple {
  employee1: Employee;
  employee2: Employee;
}

export interface PetWithDiet {
  pet: Pet;
  diet: Diet;
  dietType: DietType;
}
