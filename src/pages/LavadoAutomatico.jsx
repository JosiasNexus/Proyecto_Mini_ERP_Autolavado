import { useState, useEffect, useMemo, useRef } from "react";

export default function LavadoAutomatico() {
  // ESTADOS PRINCIPALES
  const [tunnelState, setTunnelState] = useState("Disponible");
  const [vehicleId, setVehicleId] = useState(null);
  const [washType, setWashType] = useState("");
  // currentStage is derived from progress/stages and isProcessing
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // DATOS DEL CLIENTE Y VEHÍCULO
  const [cliente, setCliente] = useState({
    nombre: "",
    apellidos: "",
    placas: "",
    telefono: "",
    marca: "",
    modelo: "",
    color: "",
    tipoVehiculo: ""
  });

  // SENSORES
  const [sensors, setSensors] = useState({
    entrada: "Libre",
    salida: "Libre",
    ocupacion: "0%",
    temperatura: "28°C",
    nivelAgua: "75%"
  });

  // ETAPAS
  const stages = useMemo(
    () =>
      [
        "Prelavado",
        "Aplicación de espuma",
        "Rodillos",
        "Enjuague a presión",
        washType === "premium" || washType === "encerado" ? "Aplicación de cera" : null,
        "Secado automático"
      ].filter(Boolean),
    [washType]
  );

  // VALIDACIÓN COMPLETA
  const validarCampos = () => {
    const { nombre, apellidos, placas, telefono, marca, modelo, color, tipoVehiculo } = cliente;

    const soloLetras = /^[a-zA-ZÁÉÍÓÚÑáéíóúñ ]+$/;
    if (!nombre.trim()) return "El nombre es obligatorio.";
    if (!soloLetras.test(nombre)) return "El nombre solo puede contener letras.";

    if (!apellidos.trim()) return "Los apellidos son obligatorios.";
    if (!soloLetras.test(apellidos)) return "Los apellidos solo pueden contener letras.";

    const regexPlacas = /^[A-Z0-9-]{5,10}$/i;
    if (!placas.trim()) return "El número de placas es obligatorio.";
    if (!regexPlacas.test(placas)) return "Formato de placas inválido.";

    const regexTelefono = /^[0-9]{10}$/;
    if (!telefono.trim()) return "El número de teléfono es obligatorio.";
    if (!regexTelefono.test(telefono)) return "El teléfono debe tener 10 dígitos.";

    if (!marca.trim()) return "La marca del vehículo es obligatoria.";
    if (!modelo.trim()) return "El modelo del vehículo es obligatorio.";
    if (!color.trim()) return "El color del vehículo es obligatorio.";
    if (!tipoVehiculo.trim()) return "El tipo de vehículo es obligatorio.";

    return null;
  };

  // SIMULACIÓN DE AVANCE
  // Guardamos una marca para evitar duplicados en finalización
  

  // FINALIZAR SERVICIO
  const finishService = () => {
    if (finishingRef.current) return;
    finishingRef.current = true;

    setTunnelState("En limpieza");

    setSensors((s) => ({
      ...s,
      salida: "Vehículo salido",
      ocupacion: "0%"
    }));

    setTimeout(() => {
      finishingRef.current = false;
      setTunnelState("Disponible");
      setVehicleId(null);
      setProgress(0);
      setIsProcessing(false);
      setWashType("");

      setCliente({
        nombre: "",
        apellidos: "",
        placas: "",
        telefono: "",
        marca: "",
        modelo: "",
        color: "",
        tipoVehiculo: ""
      });

      setSensors({
        entrada: "Libre",
        salida: "Libre",
        ocupacion: "0%",
        temperatura: "28°C",
        nivelAgua: "75%"
      });
    }, 2000);
  };

  useEffect(() => {
    if (!isProcessing) return;

    let interval = setInterval(() => {
      setProgress((p) => {
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

  // Etapa actual derivada
  const currentStage = useMemo(() => {
    if (!isProcessing) return null;
    if (stages.length === 0) return null;

    const index = Math.floor((progress / 100) * stages.length);
    setCurrentStage(stages[Math.min(index, stages.length - 1)]);
  }, [progress, stages, isProcessing]);

  // SIMULAR ENTRADA
  const simularEntrada = () => {
    const id = "TUN-" + Math.floor(Math.random() * 9999);
    setVehicleId(id);
    setTunnelState("Ocupado");

    setSensors((s) => ({
      ...s,
      entrada: "Vehículo detectado",
      ocupacion: "100%"
    }));
  };

  // CANCELAR PROCESO
  const cancelProcesamiento = () => {
    if (!isProcessing) return;

    setIsProcessing(false);
    setProgress(0);

    setSensors((s) => ({ ...s, salida: "Libre", ocupacion: "100%" }));
    setTunnelState("Ocupado");
  };

  const finishingRef = useRef(false);

  // INICIAR LAVADO
  const iniciarLavado = () => {
    const error = validarCampos();
    if (error) {
      alert(error);
      return;
    }

    if (!vehicleId) return alert("No hay vehículo en el túnel");
    if (tunnelState !== "Ocupado") return alert("El túnel no está listo");
    if (!washType) return alert("Selecciona un tipo de lavado");

    setProgress(0);
    // currentStage is derived from progress/stages
    setIsProcessing(true);
  };

  // finishService moved above so effect can call it safely

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lavado Automático</h2>
      <h3>Estado del túnel: {tunnelState}</h3>

      <button disabled={tunnelState !== "Disponible"} onClick={simularEntrada}>
        Simular Entrada de Vehículo
      </button>

      {vehicleId && (
        <div>
          <p><strong>Vehículo ID:</strong> {vehicleId}</p>

          <h3>Datos del Cliente y Vehículo</h3>

          {/* FORMULARIO DE CLIENTE */}
          {[
            ["nombre", "Nombre"],
            ["apellidos", "Apellidos"],
            ["placas", "Placas"],
            ["telefono", "Teléfono"],
            ["marca", "Marca"],
            ["modelo", "Modelo"],
            ["color", "Color"],
            ["tipoVehiculo", "Tipo de Vehículo"]
          ].map(([field, label]) => (
            <div key={field} style={{ marginBottom: "5px" }}>
              <label>{label}: </label>
              <input
                type="text"
                value={cliente[field]}
                disabled={isProcessing}
                onChange={(e) =>
                  setCliente((prev) => ({ ...prev, [field]: e.target.value }))
                }
              />
            </div>
          ))}

          {/* TIPO DE LAVADO */}
          <label>Tipo de Lavado:</label>
          <select
            value={washType}
            onChange={(e) => setWashType(e.target.value)}
            disabled={isProcessing}
          >
            <option value="">Seleccione</option>
            <option value="basico">Básico</option>
            <option value="premium">Premium</option>
            <option value="encerado">Con Encerado</option>
            <option value="express">Express</option>
          </select>

          <br /><br />

          <button disabled={isProcessing} onClick={iniciarLavado}>
            Iniciar Lavado Automático
          </button>

          <button
            disabled={!isProcessing}
            onClick={cancelProcesamiento}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>

          {/* PROCESO */}
          {isProcessing && (
            <div>
              <h3>Etapa actual: {currentStage}</h3>
              <div style={{ width: "300px", border: "1px solid black" }}>
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

          {/* SENSORES */}
          <h3>Sensores</h3>
          <ul>
            <li>Entrada: {sensors.entrada}</li>
            <li>Salida: {sensors.salida}</li>
            <li>Ocupación: {sensors.ocupacion}</li>
            <li>Temperatura: {sensors.temperatura}</li>
            <li>Nivel de agua: {sensors.nivelAgua}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
