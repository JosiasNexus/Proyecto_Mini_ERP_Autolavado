import { useState, useEffect, useMemo, useRef } from "react";

export default function LavadoAutomatico() {
  // ESTADOS PRINCIPALES
  const [tunnelState, setTunnelState] = useState("Disponible"); // Disponible | Ocupado | En limpieza
  const [vehicleId, setVehicleId] = useState(null);
  const [washType, setWashType] = useState("");
  const [currentStage, setCurrentStage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sensores simulados
  const [sensors, setSensors] = useState({
    entrada: "Libre",
    salida: "Libre",
    ocupacion: "0%",
    temperatura: "28°C",
    nivelAgua: "75%"
  });

  // Etapas del túnel
  const stages = useMemo(() => [
    "Prelavado",
    "Aplicación de espuma",
    "Rodillos",
    "Enjuague a presión",
    washType === "premium" || washType === "encerado" ? "Aplicación de cera" : null,
    "Secado automático"
  ].filter(Boolean), [washType]);

  // Simula avance del proceso
  useEffect(() => {
    if (!isProcessing) return;

    let interval = setInterval(() => {
      setProgress((p) => {
        // advance with a safe clamp so we can detect completion in the same tick
        const step = 2;
        const next = Math.min(p + step, 100);
        if (next >= 100) {
          clearInterval(interval);
          finishService();
          return 100;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isProcessing]);

  // Cambio automático de etapa según progreso
  useEffect(() => {
    if (!isProcessing) return;
    if (stages.length === 0) return;

    const rawIndex = Math.floor((progress / 100) * stages.length);
    const stageIndex = Math.min(rawIndex, stages.length - 1);
    setCurrentStage(stages[stageIndex]);
  }, [progress, stages, isProcessing]);

  // Simular entrada al túnel
  const simularEntrada = () => {
    const id = "TUN-" + Math.floor(Math.random() * 9999);
    setVehicleId(id);
    setTunnelState("Ocupado");

    // activar sensores
    setSensors((s) => ({
      ...s,
      entrada: "Vehículo detectado",
      ocupacion: "100%"
    }));
  };

  // Cancelar proceso en curso (útil para pruebas)
  const cancelProcesamiento = () => {
    if (!isProcessing) return;

    // detener procesamiento, mantener el vehículo en el túnel para poder reintentar
    setIsProcessing(false);
    setProgress(0);
    setCurrentStage(null);

    // sensores permanecen indicando vehículo en el túnel
    setSensors((s) => ({ ...s, salida: "Libre", ocupacion: "100%" }));
    // túnel sigue estando ocupado (vehículo dentro)
    setTunnelState("Ocupado");
  };

  // Iniciar proceso
  const finishingRef = useRef(false);

  const iniciarLavado = () => {
    if (!vehicleId) {
      alert("No hay vehículo en el túnel");
      return;
    }
    if (tunnelState !== "Ocupado") {
      alert("El túnel no está en estado correcto para iniciar");
      return;
    }
    if (!washType) {
      alert("Selecciona un tipo de lavado");
      return;
    }

    // Asegurarnos de que comenzamos desde el principio
    setProgress(0);
    setCurrentStage(stages[0] ?? null);
    setIsProcessing(true);
  };

  // Finalizar proceso
  const finishService = () => {
    // make finish idempotent so multiple calls don't queue multiple resets
    if (finishingRef.current) return;
    finishingRef.current = true;

    setTunnelState("En limpieza");

    // marcar salida inmediatamente en sensores
    setSensors((s) => ({ ...s, salida: "Vehículo salido", ocupacion: "0%" }));

    setTimeout(() => {
      finishingRef.current = false;
      setTunnelState("Disponible");
      setVehicleId(null);
      setProgress(0);
      setCurrentStage(null);
      setIsProcessing(false);
      setWashType("");
      setSensors({
        entrada: "Libre",
        salida: "Libre",
        ocupacion: "0%",
        temperatura: "28°C",
        nivelAgua: "75%"
      });
    }, 2000);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lavado Automático</h2>

      <h3>Estado del túnel: {tunnelState}</h3>

      {/* RF-9 Simular Entrada */}
      <button disabled={tunnelState !== "Disponible"} onClick={simularEntrada}>
        Simular Entrada de Vehículo
      </button>

      {vehicleId && (
        <div>
          <p><strong>Vehículo ID:</strong> {vehicleId}</p>

          {/* RF-10 Selección de tipo de lavado */}
          <label>Tipo de Lavado:</label>
          <select value={washType} onChange={(e) => setWashType(e.target.value)} disabled={isProcessing}>
            <option value="">Seleccione</option>
            <option value="basico">Básico</option>
            <option value="premium">Premium</option>
            <option value="encerado">Con Encerado</option>
            <option value="express">Express</option>
          </select>

          {/* RF-11 Botón iniciar proceso */}
          <button disabled={isProcessing || !vehicleId || tunnelState !== "Ocupado"} onClick={iniciarLavado}>
            Iniciar Lavado Automático
          </button>
          {/* Botón cancelar disponible durante el proceso */}
          <button
            style={{ marginLeft: "8px" }}
            disabled={!isProcessing}
            onClick={cancelProcesamiento}
          >
            Cancelar
          </button>

          {/* RF-11 Proceso automático */}
          {isProcessing && (
            <div>
              <h3>Etapa actual: {currentStage}</h3>
              <div
                style={{ width: "300px", border: "1px solid black" }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label={`Progreso del lavado ${progress}%`}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "20px",
                    backgroundColor: "green"
                  }}
                />
              </div>
              <p>Progreso: {progress}%</p>
            </div>
          )}

          {/* RF-12 Sensores */}
          <h3>Sensores del túnel</h3>
          <ul>
            <li>Sensor de entrada: {sensors.entrada}</li>
            <li>Sensor de salida: {sensors.salida}</li>
            <li>Ocupación: {sensors.ocupacion}</li>
            <li>Temperatura: {sensors.temperatura}</li>
            <li>Nivel de agua presurizada: {sensors.nivelAgua}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
