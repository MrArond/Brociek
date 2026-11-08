export interface Car {
  id: string;
  brand: string;
  model: string;
  doorsNumber: number;
  luggageCapacity: number;
  engineCapacity: number;
  fuelType: string;
  productionDate: string;
  averageFuelConsumption: number;
  bodyType: string;
}

export type NewCar = Omit<Car, 'id'>;

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG'];

export const BODY_TYPES = ['Sedan', 'Kombi', 'Hatchback', 'SUV', 'Coupé', 'Kabriolet'];
