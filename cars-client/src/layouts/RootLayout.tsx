import { NavLink, Outlet } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export default function RootLayout() {
  const favoriteCount = useCarUiStore(state => state.favoriteCarIds.length);

  return (
    <div className="app">
      <header className="site-header">
        <h1 className="logo">Cars Client</h1>
        <nav className="main-nav">
          <NavLink to="/" end>
            Strona główna
          </NavLink>
          <NavLink to="/cars">Samochody</NavLink>
          <NavLink to="/cars/new">Dodaj samochód</NavLink>
          <span className="favorite-counter">Ulubione: {favoriteCount}</span>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
