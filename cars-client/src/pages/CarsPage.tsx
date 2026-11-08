import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import CarCard from '../components/CarCard';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchTerm = useCarUiStore(state => state.searchTerm);
  const setSearchTerm = useCarUiStore(state => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore(state => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore(state => state.setShowFavoritesOnly);
  const favoriteCarIds = useCarUiStore(state => state.favoriteCarIds);
  const removeFavorite = useCarUiStore(state => state.removeFavorite);
  const syncFavorites = useCarUiStore(state => state.syncFavorites);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCars() {
      try {
        setLoading(true);
        setError(null);
        const loadedCars = await getCars(controller.signal);
        setCars(loadedCars);
        syncFavorites(loadedCars.map(car => car.id));
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

    void loadCars();

    return () => {
      controller.abort();
    };
  }, [syncFavorites]);

  async function handleDelete(car: Car) {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć samochód ${car.brand} ${car.model}?`,
    );
    if (!confirmed) return;

    try {
      await deleteCar(car.id);
      removeFavorite(car.id);
      setCars(currentCars => currentCars.filter(item => item.id !== car.id));
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : 'Nie udało się usunąć samochodu.',
      );
    }
  }

  if (loading) return <p>Ładowanie listy...</p>;
  if (error) return <p className="error">Błąd: {error}</p>;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleCars = cars.filter(car => {
    const matchesSearch =
      car.brand.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);

    const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id);

    return matchesSearch && matchesFavorite;
  });

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
          <div className="cars-toolbar">
            <input
              type="search"
              placeholder="Szukaj po marce lub modelu..."
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />

            <label className="favorite-filter">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={event => setShowFavoritesOnly(event.target.checked)}
              />
              Tylko ulubione
            </label>
          </div>

          {visibleCars.length === 0 ? (
            <p>Brak samochodów pasujących do wyszukiwania lub filtra.</p>
          ) : (
            <div className="cars-grid">
              {visibleCars.map(car => (
                <CarCard key={car.id} car={car} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
