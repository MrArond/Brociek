import { useNavigate } from 'react-router';
import CarForm from '../components/CarForm';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';

const emptyCar: NewCar = {
  brand: '',
  model: '',
  doorsNumber: 4,
  luggageCapacity: 0,
  engineCapacity: 1,
  fuelType: 'Petrol',
  productionDate: '',
  averageFuelConsumption: 1,
  bodyType: 'Sedan',
};

export default function CreateCarPage() {
  const navigate = useNavigate();

  async function handleCreate(car: NewCar) {
    const created = await createCar(car);
    navigate(`/cars/${created.id}`);
  }

  return (
    <section>
      <h2>Dodaj samochód</h2>
      <CarForm initialValues={emptyCar} submitLabel="Dodaj" onSubmit={handleCreate} />
    </section>
  );
}
