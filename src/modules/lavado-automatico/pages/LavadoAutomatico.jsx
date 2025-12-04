import { useState, useEffect, useMemo, useCallback } from "react";

export default function LavadoAutomatico() {
  // === CREAR ESTACIÓN ===
  const crearEstacion = useCallback(() => ({
    tunnelState: "Disponible",
    vehicleId: null,
    progress: 0,
    isProcessing: false,
    currentStage: "",
    sensors: {
      entrada: "Libre",
      salida: "Libre",
      ocupacion: "0%",
      temperatura: "28°C",
      nivelAgua: "75%"
    }
  }), []);

  // === ESTADO GENERAL ===
  const [estaciones, setEstaciones] = useState([
    crearEstacion(),
    crearEstacion(),
    crearEstacion(),
    crearEstacion()
  ]);

  // === INSUMOS CRÍTICOS ===
  const [insumos, setInsumos] = useState({
    Shampoo: 100,
    Cera: 100,
    Panos: 100,
    Agua: 100
  });

  const [eventos, setEventos] = useState([]);

  const stages = useMemo(() => [
    "Prelavado",
    "Aplicación de espuma",
    "Rodillos",
    "Enjuague a presión",
    "Secado automático"
  ], []);

  // === REGISTRAR EVENTOS ===
  const log = (texto) => {
    setEventos((prev) => [
      { time: new Date().toLocaleTimeString(), text: texto },
      ...prev
    ]);
  };

  // === SIMULAR ENTRADA ===
  const simularEntrada = (i) => {
    setEstaciones(prev => {
      const e = [...prev];
      if (e[i].tunnelState !== "Disponible") return prev;

      e[i].vehicleId = "TUN-" + Math.floor(Math.random() * 9999);
      e[i].tunnelState = "Ocupado";
      e[i].sensors.entrada = "Detectado";
      e[i].sensors.ocupacion = "100%";

      log(`Vehículo entró en Estación ${i + 1}`);

      return e;
    });

    // BAJAR INSUMOS
    setInsumos(prev => ({
      Shampoo: Math.max(prev.Shampoo - 5, 0),
      Cera: Math.max(prev.Cera - 3, 0),
      Panos: Math.max(prev.Panos - 2, 0),
      Agua: Math.max(prev.Agua - 8, 0)
    }));
  };

  // === INICIAR LAVADO ===
  const iniciarLavado = (i) => {
    setEstaciones(prev => {
      const e = [...prev];
      if (!e[i].vehicleId) return prev;

      e[i].isProcessing = true;
      e[i].progress = 0;
      e[i].currentStage = stages[0];

      log(`Lavado iniciado en Estación ${i + 1}`);
      return e;
    });
  };

  // === CANCELAR ===
  const cancelar = (i) => {
    setEstaciones(prev => {
      const e = [...prev];
      e[i].isProcessing = false;
      e[i].progress = 0;
      e[i].currentStage = "";
      log(`Lavado cancelado en Estación ${i + 1}`);
      return e;
    });
  };

  // === FINALIZAR ===
  const finalizar = useCallback((i) => {
    setEstaciones(prev => {
      const e = [...prev];

      // si está en mantenimiento, NO finalizar
      if (e[i].tunnelState === "Mantenimiento") return prev;

      e[i].tunnelState = "En limpieza";
      e[i].sensors.salida = "Saliendo";
      e[i].sensors.ocupacion = "0%";

      log(`Lavado finalizado en Estación ${i + 1}`);
      return e;
    });

    setTimeout(() => {
      setEstaciones(prev => {
        const e = [...prev];

        if (e[i].tunnelState === "Mantenimiento") return prev;

        e[i] = crearEstacion();
        log(`Estación ${i + 1} está Disponible de nuevo`);
        return e;
      });
    }, 1600);
  }, [crearEstacion]);

  // === PONER EN MANTENIMIENTO ===
  const ponerMantenimiento = (i) => {
    setEstaciones(prev => {
      const e = [...prev];

      e[i].isProcessing = false;
      e[i].progress = 0;
      e[i].vehicleId = null;
      e[i].currentStage = "";

      e[i].tunnelState = "Mantenimiento";

      e[i].sensors.entrada = "Libre";
      e[i].sensors.salida = "Libre";
      e[i].sensors.ocupacion = "0%";

      log(`Estación ${i + 1} pasó a Mantenimiento`);
      return e;
    });
  };

  // === PONER EN SERVICIO ===
  const ponerEnServicio = (i) => {
    setEstaciones(prev => {
      const e = [...prev];
      e[i] = crearEstacion();
      log(`Estación ${i + 1} volvió al servicio`);
      return e;
    });
  };

  // === EFECTO GLOBAL ===
  useEffect(() => {
    const interval = setInterval(() => {
      setEstaciones(prev => {
        const e = [...prev];

        e.forEach((est, i) => {
          if (!est.isProcessing || est.tunnelState === "Mantenimiento") return;

          let next = est.progress + 2;

          if (next >= 100) {
            est.isProcessing = false;
            finalizar(i);
            next = 100;
          } else {
            const idx = Math.floor((next / 100) * stages.length);
            est.currentStage = stages[Math.min(idx, stages.length - 1)];
          }

          est.progress = next;
        });

        return e;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [stages, finalizar]);

  // === CONTADORES ===
  const countDisponible = estaciones.filter(e => e.tunnelState === "Disponible").length;
  const countOcupado = estaciones.filter(e => e.tunnelState === "Ocupado").length;
  const countLimpieza = estaciones.filter(e => e.tunnelState === "En limpieza").length;
  const countMantenimiento = estaciones.filter(e => e.tunnelState === "Mantenimiento").length;

  // === ESTILOS ===
  const styles = {
    box: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "10px",
      marginBottom: "10px",
      background: "white"
    },
    badge: {
      Disponible: { background: "#d4f8d4", color: "#2b6e2b" },
      Ocupado: { background: "#ffe9b3", color: "#a66b00" },
      "En limpieza": { background: "#ffd5d5", color: "#b30000" },
      Mantenimiento: { background: "#cfcfcf", color: "#333" }
    },
    button: {
      background: "#0d6efd",
      color: "white",
      border: "none",
      padding: "6px 10px",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "6px"
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      
      {/* PANEL LATERAL */}
      <div style={{ width: "250px" }}>
        <h4>Insumos críticos</h4>

        {Object.entries(insumos).map(([nombre, valor]) => (
          <div key={nombre} style={{ marginBottom: "12px" }}>
            <span>{nombre} {valor}%</span>
            <div style={{ height: "6px", background: "#eee", borderRadius: "4px" }}>
              <div style={{
                width: `${valor}%`,
                height: "100%",
                background: valor > 30 ? "#28a745" : "#c90000",
                borderRadius: "4px",
                transition: "0.3s"
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* PANEL CENTRAL */}
      <div style={{ flex: 1 }}>
        <h2>Lavado Automático</h2>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <span><strong>Disponibles:</strong> {countDisponible}</span>
          <span><strong>Ocupadas:</strong> {countOcupado}</span>
          <span><strong>En limpieza:</strong> {countLimpieza}</span>
          <span><strong>Mantenimiento:</strong> {countMantenimiento}</span>
        </div>

        {/* ESTACIONES */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "15px"
        }}>
          {estaciones.map((e, i) => (
            <div key={i} style={styles.box}>
              <h3>Estación {i + 1}</h3>

              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  ...styles.badge[e.tunnelState]
                }}
              >
                {e.tunnelState}
              </span>

              <p>{e.vehicleId ? `Vehículo: ${e.vehicleId}` : "Sin vehículo"}</p>

              {/* BOTONES */}
              {e.tunnelState !== "Mantenimiento" && (
                <>
                  <button
                    style={styles.button}
                    disabled={e.tunnelState !== "Disponible"}
                    onClick={() => simularEntrada(i)}
                  >
                    Simular Entrada
                  </button>

                  <button
                    style={styles.button}
                    disabled={!e.vehicleId || e.isProcessing}
                    onClick={() => iniciarLavado(i)}
                  >
                    Iniciar Lavado
                  </button>

                  <button
                    style={{ ...styles.button, background: "#6c757d" }}
                    disabled={!e.isProcessing}
                    onClick={() => cancelar(i)}
                  >
                    Cancelar
                  </button>

                  <button
                    style={{ ...styles.button, background: "#b30000" }}
                    disabled={e.isProcessing}
                    onClick={() => ponerMantenimiento(i)}
                  >
                    Mantenimiento
                  </button>
                </>
              )}

              {/* BOTÓN poner en servicio */}
              {e.tunnelState === "Mantenimiento" && (
                <button
                  style={{
                    ...styles.button,
                    background: "#198754"
                  }}
                  onClick={() => ponerEnServicio(i)}
                >
                  Poner en Servicio
                </button>
              )}

              {/* PROCESO */}
              {e.isProcessing && (
                <div>
                  <p><strong>Etapa:</strong> {e.currentStage}</p>
                  <div style={{ height: "12px", background: "#eee" }}>
                    <div style={{
                      width: `${e.progress}%`,
                      height: "12px",
                      background: "#28a745"
                    }} />
                  </div>
                  <p>Progreso: {e.progress}%</p>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* PANEL DERECHA */}
      <div style={{ width: "280px" }}>
        <h3>Registro de eventos</h3>
        <div style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "scroll",
          padding: "10px",
          borderRadius: "8px"
        }}>
          {eventos.map((e, index) => (
            <p key={index} style={{ fontSize: "14px" }}>
              <strong>{e.time}</strong> — {e.text}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}
