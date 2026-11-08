import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section>
      <h2>404 – Nie znaleziono strony</h2>
      <p>Adres, który podałeś, nie istnieje.</p>
      <Link to="/">Wróć na stronę główną</Link>
    </section>
  );
}
