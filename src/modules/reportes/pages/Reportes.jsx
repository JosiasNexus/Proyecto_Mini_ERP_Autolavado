import React, { useState } from "react";
import './../styles/Reportes.css'

const API_BASE_URL = 'http://localhost:3000';

export default function Reportes() {
  const [reportData, setReportData] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async (endpoint, reportName) => {
    setLoading(true);
    setError(null);
    setActiveReport(reportName);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      setReportData(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError('Error al cargar el reporte: ' + err.message);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const getColumns = (data) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  };

  return (
    <div className="reportes-root">
      <h1 className="reportes-title">
        Reportes de módulos de lavado
      </h1>

      {/* Botones superiores */}
      <div className="btn-grid btn-grid-top">
        <button onClick={() => fetchReport('/servicios/manual', 'Servicios L. Manual')}>
          Servicios Lavado Manual
        </button>
        <button onClick={() => fetchReport('/servicios/automatico', 'Servicios L. Aut.')}>
          Servicios Lavado Automático
        </button>
        <button onClick={() => fetchReport('/tiempo-max/manual', 'Tiempo máximo en lavado Manual')}>
          Tiempo máximo en lavado Manual
        </button>
        <button onClick={() => fetchReport('/tiempo-max/automatico', 'Tiempo máximo en lavado Autom.')}>
          Tiempo máximo en lavado Autom.
        </button>
      </div>

      <div className="btn-grid btn-grid-bottom">
        <button onClick={() => fetchReport('/consumos/manual', 'Consumo de insumos: Lavado Manual')}>
          Consumo de insumos:<br/>Lavado Manual
        </button>
        <button onClick={() => fetchReport('/consumos/automatico', 'Consumo de insumos: Lavado Automático')}>
          Consumo de insumos:<br/>Lavado Automático
        </button>
        <button onClick={() => fetchReport('/consumos/diferencia', 'Diferencia de consumo')}>
          Diferencia de consumo
        </button>
        <button onClick={() => fetchReport('/ingresos/manual', 'Ingresos generados: Lavado Manual')}>
          Ingresos generados:<br/>Lavado Manual
        </button>
        <button onClick={() => fetchReport('/ingresos/automatico', 'Ingresos generados: Lavado Automático')}>
          Ingresos generados:<br/>Lavado Automático
        </button>
      </div>

      {/* Contenedor de reportes */}
      {activeReport && (
        <div className="reportes-container">
          <h2>{activeReport}</h2>
          
          {loading && <p className="loading-text">Cargando datos...</p>}
          
          {error && <p className="error-text">{error}</p>}
          
          {reportData.length > 0 && !loading && (
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    {getColumns(reportData).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, idx) => (
                    <tr key={idx}>
                          {getColumns(reportData).map((col) => (
                        <td key={`${idx}-${col}`}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {reportData.length === 0 && !loading && !error && (
            <p className="no-data-text">No hay datos disponibles</p>
          )}
        </div>
      )}
    </div>
  );
}
