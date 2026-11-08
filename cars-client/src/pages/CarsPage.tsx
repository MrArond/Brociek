import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await getCars(controller.signal);
        setCars(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Nie udało się pobrać listy.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  async function handleDelete(car: Car) {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć samochód ${car.brand} ${car.model}?`
    );
    if (!confirmed) return;

    try {
      await deleteCar(car.id);
      setCars(prev => prev.filter(c => c.id !== car.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się usunąć samochodu.');
    }
  }

  if (loading) return <p>Ładowanie listy...</p>;
  if (error) return <p className="error">Błąd: {error}</p>;

  const normalizedFilter = filter.trim().toLowerCase();
  const visibleCars = cars.filter(car =>
    `${car.brand} ${car.model}`.toLowerCase().includes(normalizedFilter)
  );

  return (
    <section>
      <div className="page-header">
        <h2>Samochody</h2>
        <Link to="/cars/new" className="button-link">
          Dodaj samochód
        </Link>
      </div>

      {cars.length === 0 ? (
        <p>Brak samochodów na liście.</p>
      ) : (
        <>
          <input
            className="filter-input"
            type="search"
            placeholder="Filtruj po marce lub modelu..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />

          {visibleCars.length === 0 ? (
            <p>Brak samochodów pasujących do filtra.</p>
          ) : (
            <ul className="car-list">
              {visibleCars.map(car => (
                <li key={car.id} className="car-item">
                  <span className="car-name">
                    {car.brand} {car.model}
                  </span>
                  <div className="actions">
                    <Link to={`/cars/${car.id}`}>Szczegóły</Link>
                    <Link to={`/cars/${car.id}/edit`}>Edytuj</Link>
                    <button type="button" className="danger" onClick={() => handleDelete(car)}>
                      Usuń
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
