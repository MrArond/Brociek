import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';

export default function CarDetailsPage() {
  const { id = '' } = useParams();
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

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="error">Błąd: {error}</p>;
  if (!car) return null;

  return (
    <section>
      <h2>
        {car.brand} {car.model}
      </h2>

      <dl className="car-details">
        <dt>Liczba drzwi</dt>
        <dd>{car.doorsNumber}</dd>
        <dt>Pojemność bagażnika</dt>
        <dd>{car.luggageCapacity} l</dd>
        <dt>Pojemność silnika</dt>
        <dd>{car.engineCapacity} cm³</dd>
        <dt>Rodzaj paliwa</dt>
        <dd>{car.fuelType}</dd>
        <dt>Data produkcji</dt>
        <dd>{car.productionDate}</dd>
        <dt>Średnie spalanie</dt>
        <dd>{car.averageFuelConsumption} l/100 km</dd>
        <dt>Typ nadwozia</dt>
        <dd>{car.bodyType}</dd>
      </dl>

      <div className="actions">
        <Link to={`/cars/${car.id}/edit`} className="button-link">
          Edytuj
        </Link>
        <Link to="/cars">← Powrót do listy</Link>
      </div>
    </section>
  );
}
