import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import CarForm from '../components/CarForm';
import type { Car, NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';

export default function EditCarPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await getCarById(id, controller.signal);
        setCar(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Nie udało się pobrać samochodu.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [id]);

  async function handleSave(updated: NewCar) {
    await updateCar(id, updated);
    navigate(`/cars/${id}`);
  }

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="error">Błąd: {error}</p>;
  if (!car) return null;

  return (
    <section>
      <h2>
        Edycja: {car.brand} {car.model}
      </h2>
      <CarForm initialValues={car} submitLabel="Zapisz zmiany" onSubmit={handleSave} />
    </section>
  );
}
