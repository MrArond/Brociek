import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';

interface CarCardProps {
  car: Car;
  onDelete: (car: Car) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
  const isFavorite = useCarUiStore(state => state.favoriteCarIds.includes(car.id));
  const toggleFavorite = useCarUiStore(state => state.toggleFavorite);

  return (
    <article className="car-card">
      <div className="car-card-header">
        <h3>
          {car.brand} {car.model}
        </h3>
        <button
          type="button"
          className={isFavorite ? 'favorite-button active-favorite' : 'favorite-button'}
          onClick={() => toggleFavorite(car.id)}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★ Ulubiony' : '☆ Do ulubionych'}
        </button>
      </div>

      <dl className="car-card-details">
        <div>
          <dt>Paliwo</dt>
          <dd>{car.fuelType}</dd>
        </div>
        <div>
          <dt>Nadwozie</dt>
          <dd>{car.bodyType}</dd>
        </div>
        <div>
          <dt>Drzwi</dt>
          <dd>{car.doorsNumber}</dd>
        </div>
        <div>
          <dt>Spalanie</dt>
          <dd>{car.averageFuelConsumption} l/100 km</dd>
        </div>
      </dl>

      <div className="actions">
        <Link to={`/cars/${car.id}`}>Szczegóły</Link>
        <Link to={`/cars/${car.id}/edit`}>Edytuj</Link>
        <button type="button" className="danger" onClick={() => onDelete(car)}>
          Usuń
        </button>
      </div>
    </article>
  );
}
