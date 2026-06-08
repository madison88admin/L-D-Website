import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import AboutUs from './pages/AboutUs';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={isHome ? 'app-shell home-shell' : 'app-shell'}>
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Madison88 Learning & Development Website home">
          <img
            className="brand-logo"
            src={isHome ? '/images/madison88-logo-white.png' : '/images/madison88-logo-blue.png'}
            alt="Madison88"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <span className="brand-fallback">Madison88</span>
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
          <Route path="/programs/:slug" element={<ProgramDetail />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
