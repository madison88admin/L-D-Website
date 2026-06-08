import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Programs from './pages/Programs';
import AboutUs from './pages/AboutUs';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about-us';
  const isPrograms = location.pathname.startsWith('/programs');

  return (
    <div className={`app-shell${isHome ? ' home-shell' : ''}${isAbout || isPrograms ? ' flush-shell' : ''}`}>
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Madison88 Learning & Development Website home">
          Global HR &amp; Admin
        </NavLink>

        <nav className="site-nav" aria-label="Public navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/programs">Programs</NavLink>
          <NavLink to="/about-us">About Us</NavLink>
        </nav>
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
