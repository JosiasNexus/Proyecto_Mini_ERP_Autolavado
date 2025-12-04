import { useState } from 'react'
import '../styles/LavadoManual.css'

const STEPS = ['Prelavado', 'Espumado', 'Enjuague', 'Secado']

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export default function LavadoManual() {
  const [stations, setStations] = useState(() => {
    // Initialize 4 stations for the demo
    return Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      name: `Estación ${i + 1}`,
      status: 'Disponible', // Disponible, Ocupada, En limpieza, En mantenimiento, Fuera de servicio
      vehicleId: null,
      ingreso: null,
      inicio: null,
      step: -1,
      duration: 0,
    }))
  })

  const [supplies, setSupplies] = useState({
    shampoo: 100,
    cera: 100,
    paños: 100,
    agua: 100,
  })

  const [logs, setLogs] = useState([])

  function addLog(text) {
    setLogs((l) => [{ time: new Date().toISOString(), text }, ...l].slice(0, 50))
  }

  // RF-2: Simulate vehicle entry, auto-assign to first available station
  function simulateEntry() {
    const idx = stations.findIndex((s) => s.status === 'Disponible')
    if (idx === -1) {
      addLog('No hay estaciones disponibles para simular una entrada')
      return
    }
    const vehicleId = `V-${uid().toUpperCase()}`
    const updated = stations.map((s, i) => {
      if (i === idx) {
        return {
          ...s,
          status: 'Ocupada',
          vehicleId,
          ingreso: new Date().toISOString(),
        }
      }
      return s
    })
    setStations(updated)
    addLog(`Entrada simulada: ${vehicleId} asignado a ${stations[idx].name}`)
  }

  // Simulate entry to a specific station
  function simulateEntryToStation(stationId) {
    const idx = stations.findIndex((s) => s.id === stationId)
    if (idx === -1) return
    const s = stations[idx]
    if (s.status !== 'Disponible') {
      addLog(`No se puede simular entrada en ${s.name} porque no está disponible`)
      return
    }
    const vehicleId = `V-${uid().toUpperCase()}`
    setStations((prev) =>
      prev.map((st) => (st.id === stationId ? { ...st, status: 'Ocupada', vehicleId, ingreso: new Date().toISOString() } : st)),
    )
    addLog(`Entrada simulada: ${vehicleId} asignado a ${s.name}`)
  }

  // Start the manual washing process for a station (RF-4 sub-process enable)
  function startWash(stationId) {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id !== stationId) return s
        if (s.status !== 'Ocupada') return s
        return {
          ...s,
          inicio: new Date().toISOString(),
          step: 0,
        }
      }),
    )
    addLog(`Lavado iniciado en estación ${stationId}`)
  }

  // Progress to next step or finalize
  function nextStep(stationId) {
    const st = stations.find((s) => s.id === stationId)
    if (!st || st.status !== 'Ocupada') return
    if (st.step === -1) return // not started

    if (st.step < STEPS.length - 1) {
      setStations((prev) =>
        prev.map((s) => (s.id === stationId ? { ...s, step: s.step + 1 } : s)),
      )
      addLog(`Estación ${stationId}: ${STEPS[st.step + 1]}`)
    } else {
      // finalize
      finalizeService(stationId)
    }
  }

  // RF-6: Finalizar servicio, record duration, consumos y set estado a En limpieza
  function finalizeService(stationId) {
    const end = new Date()
    setStations((prev) =>
      prev.map((s) => {
        if (s.id !== stationId) return s
        const inicio = s.inicio ? new Date(s.inicio) : null
        const duration = inicio ? Math.max(1, Math.round((end - inicio) / 1000)) : 0
        return {
          ...s,
          status: 'En limpieza',
          step: -1,
          duration,
          vehicleId: null,
          ingreso: null,
          inicio: null,
        }
      }),
    )

    // Simulate consumos
    setSupplies((prev) => {
      const consumption = {
        shampoo: Math.round(5 + Math.random() * 10),
        cera: Math.round(2 + Math.random() * 6),
        paños: Math.round(1 + Math.random() * 4),
        agua: Math.round(10 + Math.random() * 15),
      }
      const result = {
        shampoo: Math.max(0, prev.shampoo - consumption.shampoo),
        cera: Math.max(0, prev.cera - consumption.cera),
        paños: Math.max(0, prev.paños - consumption.paños),
        agua: Math.max(0, prev.agua - consumption.agua),
      }
      addLog(`Servicio finalizado en Estación ${stationId}. Consumo: shampoo ${consumption.shampoo}%, cera ${consumption.cera}%, paños ${consumption.paños}%, agua ${consumption.agua}%`)
      return result
    })
  }

  // Action to set station back to available after limpieza
  function restoreStation(stationId) {
    setStations((prev) => prev.map((s) => (s.id === stationId ? { ...s, status: 'Disponible' } : s)))
    addLog(`Estación ${stationId} restablecida a Disponible`)
  }

  // Quick helpers to set station status (e.g., mantenimiento)
  function setStationStatus(stationId, newStatus) {
    setStations((prev) => prev.map((s) => (s.id === stationId ? { ...s, status: newStatus } : s)))
    addLog(`Estación ${stationId} actualizada a estado ${newStatus}`)
  }

  function getAvailabilityNumbers() {
    const counts = stations.reduce(
      (acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1
        return acc
      },
      { Disponible: 0, Ocupada: 0, 'En limpieza': 0, 'En mantenimiento': 0, 'Fuera de servicio': 0 },
    )
    return counts
  }

  const availability = getAvailabilityNumbers()

  const anyLow = Object.values(supplies).some((v) => v <= 20)

  return (
    <div className="lavado-manual-root">
      <header className="header">
        <h2>Lavado Manual</h2>
        <div className="header-actions">
          <button onClick={simulateEntry}>Simular Entrada de Vehículo</button>
          <button onClick={() => addLog('Panel recargado manualmente')}>Recargar Panel</button>
        </div>
      </header>

      {anyLow && <div className="supply-alert">⚠️ Atención: Algunos insumos están por debajo del 20%</div>}
      <main className="main-grid">
        <aside className="side-panel">
          <div className="supply-panel">
            <h3>Insumos</h3>
            {Object.entries(supplies).map(([k, v]) => (
              <div key={k} className="supply-row">
                <div className="supply-label">{k}</div>
                <div className="supply-bar">
                  <div className={`supply-progress ${v <= 20 ? 'low' : ''}`} style={{ width: `${v}%` }} />
                </div>
                <div className="supply-value">{v}%</div>
              </div>
            ))}
          </div>
        </aside>

        <section className="center-panel">
          <div className="availability">
            <div className="availability-item">Disponibles: <strong>{availability.Disponible}</strong></div>
            <div className="availability-item">Ocupadas: <strong>{availability.Ocupada}</strong></div>
            <div className="availability-item">En limpieza: <strong>{availability['En limpieza']}</strong></div>
            <div className="availability-item">Mantenimiento: <strong>{availability['En mantenimiento']}</strong></div>
          </div>

          <div className="stations-grid">
            {stations.map((s) => (
              <div key={s.id} className={`station-card ${s.status.replace(/\s+/g, '-').toLowerCase()}`}>
                <div className="station-header">
                  <div className="station-name">{s.name}</div>
                  <div className="station-status">{s.status}</div>
                </div>
                {s.vehicleId ? (
                  <div className="station-vehicle">Vehículo: <strong>{s.vehicleId}</strong></div>
                ) : (
                  <div className="station-empty">Sin vehículo</div>
                )}

                {s.ingreso && (
                  <div className="station-ingreso">Ingreso: {new Date(s.ingreso).toLocaleTimeString()}</div>
                )}
                {s.inicio && (
                  <div className="station-inicio">Inicio: {new Date(s.inicio).toLocaleTimeString()}</div>
                )}
                <div className="station-actions">
                  {s.status === 'Disponible' && (
                    <>
                      <button onClick={() => simulateEntryToStation(s.id)}>Simular Entrada</button>
                      <div style={{ marginTop: 6 }}>
                        <button onClick={() => setStationStatus(s.id, 'Fuera de servicio')}>Fuera de servicio</button>
                        <button onClick={() => setStationStatus(s.id, 'En mantenimiento')} style={{ marginLeft: 8 }}>
                          Poner mantenimiento
                        </button>
                      </div>
                    </>
                  )}
                  {s.status === 'Ocupada' && !s.inicio && (
                    <button onClick={() => startWash(s.id)}>Iniciar Lavado Manual</button>
                  )}
                  {s.status === 'Ocupada' && s.inicio && (
                    <>
                      <div className="station-step">Paso: {s.step >= 0 ? STEPS[s.step] : 'Pendiente'}</div>
                      <button onClick={() => nextStep(s.id)}>
                        {s.step < STEPS.length - 1 ? 'Siguiente Paso' : 'Finalizar Servicio'}
                      </button>
                    </>
                  )}
                  {s.status === 'En limpieza' && (
                    <button onClick={() => restoreStation(s.id)}>Finalizar Limpieza (Disponible)</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="log-panel">
          <h3>Registro de eventos</h3>
          <div className="logs">
            {logs.length === 0 && <div>No hay eventos recientes</div>}
            {logs.map((l) => (
              <div key={l.time} className="log-item">{new Date(l.time).toLocaleTimeString()} — {l.text}</div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  )
}