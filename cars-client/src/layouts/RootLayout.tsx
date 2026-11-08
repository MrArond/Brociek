import { NavLink, Outlet } from 'react-router';

export default function RootLayout() {
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
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
