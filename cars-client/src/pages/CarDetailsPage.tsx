import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarDetailsPage() {
  const { id = '' } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFavorite = useCarUiStore(state => state.favoriteCarIds.includes(id));
  const toggleFavorite = useCarUiStore(state => state.toggleFavorite);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCar() {
      try {
        setLoading(true);
        setError(null);
        const loadedCar = await getCarById(id, controller.signal);
        setCar(loadedCar);
      } catch (caughtError) {
        if (axios.isCancel(caughtError)) {
          return;
        }
        setError(caughtError instanceof Error ? caughtError.message : 'Wystąpił nieznany błąd.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadCar();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="error">Błąd: {error}</p>;
  if (!car) return null;

  return (
    <section>
      <div className="page-header">
        <h2>
          {car.brand} {car.model}
        </h2>
        <button
          type="button"
          className={isFavorite ? 'favorite-button active-favorite' : 'favorite-button'}
          onClick={() => toggleFavorite(car.id)}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★ Ulubiony' : '☆ Do ulubionych'}
        </button>
      </div>

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
