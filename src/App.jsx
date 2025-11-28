import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Inicio from './pages/Inicio'
import LavadoManual from './pages/LavadoManual'
import LavadoAutomatico from './pages/LavadoAutomatico'
import LavadoSinContacto from './pages/LavadoSinContacto'

function App() {
  // app-level state removed (unused)

  return (
    <Router>
      <header className="header">
        <nav>
          <ul className="nav-list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/lavado-manual">Lavado manual</Link></li>
            <li><Link to="/lavado-automatico">Lavado automático</Link></li>
            <li><Link to="/lavado-sin-contacto">Lavado sin contacto</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/lavado-manual" element={<LavadoManual />} />
          <Route path="/lavado-automatico" element={<LavadoAutomatico />} />
          <Route path="/lavado-sin-contacto" element={<LavadoSinContacto />} />
          {/* Ruta fallback opcional */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>
    </Router>
  )
}

export default App
