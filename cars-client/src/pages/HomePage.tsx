import { Link } from 'react-router';

export default function HomePage() {
  return (
    <section>
      <h2>Witaj w Cars Client</h2>
      <p>
        Aplikacja do zarządzania listą samochodów. Przeglądaj, dodawaj, edytuj i usuwaj
        pojazdy.
      </p>
      <Link to="/cars" className="button-link">
        Przejdź do listy samochodów
      </Link>
    </section>
  );
}
