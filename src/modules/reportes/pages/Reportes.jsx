import React from "react";
import './../styles/Reportes.css'

export default function Reportes() {
  return (
    <div className="reportes-root">
      <h1 className="reportes-title">
        Reportes de módulos de lavado
      </h1>

      {/* Botones superiores */}
      <div className="btn-grid">
        <button>Servicios L. Manual</button>
        <button>Servicios L. Aut.</button>
        <button>Tiempo máximo en lavado Manual</button>
        <button>Tiempo máximo en lavado Autom.</button>
      </div>

      <div className="btn-grid">
        <button>Consumo de insumos:<br/>Lavado Manual</button>
        <button>Consumo de insumos:<br/>Lavado Automático</button>
        <button>Diferencia de consumo</button>
        <button>Ingresos generados:<br/>Lavado Manual</button>
        <button>Ingresos generados:<br/>Lavado Automático</button>
      </div>

      {/* Contenedores inferiores */}
      <div className="reportes-bottom-grid">
        <div className="report-box"></div>
        <div className="report-box"></div>
        <div className="report-box"></div>
      </div>
    </div>
  );
}
