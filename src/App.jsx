import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Inicio from './modules/inicio/pages/Inicio'
import LavadoManual from './modules/lavado-manual/pages/LavadoManual'
import LavadoAutomatico from './modules/lavado-automatico/pages/LavadoAutomatico'
import Reportes from './modules/reportes/pages/Reportes'

function App() {
  // app-level state removed (unused)

  return (
    <Router>
      <header className="header">
        <nav>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/lavado-manual" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Lavado manual</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/lavado-automatico" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Lavado automático</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/reportes" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Reportes</NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/lavado-manual" element={<LavadoManual />} />
          <Route path="/lavado-automatico" element={<LavadoAutomatico />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
