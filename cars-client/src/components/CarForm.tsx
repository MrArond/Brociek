import { useState, type ChangeEvent, type FormEvent } from 'react';
import { BODY_TYPES, FUEL_TYPES, type NewCar } from '../models/Car';

type NumericField =
  | 'doorsNumber'
  | 'luggageCapacity'
  | 'engineCapacity'
  | 'averageFuelConsumption';

const numericFields: NumericField[] = [
  'doorsNumber',
  'luggageCapacity',
  'engineCapacity',
  'averageFuelConsumption',
];

function isNumericField(name: string): name is NumericField {
  return numericFields.some(field => field === name);
}

interface CarFormProps {
  initialValues: NewCar;
  submitLabel: string;
  onSubmit: (car: NewCar) => Promise<void>;
}

export default function CarForm({ initialValues, submitLabel, onSubmit }: CarFormProps) {
  const [values, setValues] = useState<NewCar>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: isNumericField(name) ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
      setSaving(false);
    }
  }

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <label>
        Marka
        <input name="brand" value={values.brand} onChange={handleChange} required />
      </label>

      <label>
        Model
        <input name="model" value={values.model} onChange={handleChange} required />
      </label>

      <label>
        Liczba drzwi (2–5)
        <input
          name="doorsNumber"
          type="number"
          min={2}
          max={5}
          value={values.doorsNumber}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Pojemność bagażnika (l)
        <input
          name="luggageCapacity"
          type="number"
          min={0}
          value={values.luggageCapacity}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Pojemność silnika (cm³)
        <input
          name="engineCapacity"
          type="number"
          min={1}
          value={values.engineCapacity}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Rodzaj paliwa
        <select name="fuelType" value={values.fuelType} onChange={handleChange}>
          {FUEL_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label>
        Data produkcji
        <input
          name="productionDate"
          type="date"
          value={values.productionDate}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Średnie spalanie (l/100 km)
        <input
          name="averageFuelConsumption"
          type="number"
          min={1}
          value={values.averageFuelConsumption}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Typ nadwozia
        <select name="bodyType" value={values.bodyType} onChange={handleChange}>
          {BODY_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? 'Zapisywanie...' : submitLabel}
      </button>
    </form>
  );
}
