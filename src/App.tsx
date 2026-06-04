import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Madison88 Learning & Development Website home">
          <span className="brand-mark">M88</span>
          <span>Madison88 Learning & Development</span>
        </NavLink>

        <nav className="site-nav" aria-label="Public navigation">
          <NavLink to="/about-us">About Us</NavLink>
          <NavLink to="/programs">Programs</NavLink>
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
