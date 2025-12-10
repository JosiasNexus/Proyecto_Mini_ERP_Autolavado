// serviciosBD.js
import { pool } from './api_manual.js'

// Guardar vehículo
export async function guardarVehiculo(Id_Vehiculo, Id_Estacion, Fecha_Ingreso) {
  await pool.query(
    `INSERT INTO VEHICULO (Id_Vehiculo, Id_Estacion, Fecha_Ingreso) VALUES (?,?,?)`,
    [Id_Vehiculo, Id_Estacion, Fecha_Ingreso]
  )
}

// Guardar servicio
export async function guardarServicio(Id_Vehiculo, Id_Estacion, Inicio, Fin, Duracion_Segundos, Estado) {
  const [result] = await pool.query(
    `INSERT INTO SERVICIO (Id_Vehiculo, Id_Estacion, Inicio, Fin, Duracion, Estado) VALUES (?,?,?,?,?,?)`,
    [Id_Vehiculo, Id_Estacion, Inicio, Fin, Duracion, Estado]
  )
  return result.insertId
}

// Guardar paso
export async function guardarPaso(Id_Servicio, Paso_Numero, Paso_Nombre) {
  await pool.query(
    `INSERT INTO PASOS_SERVICIO (Id_Servicio, Paso_Numero, Paso_Nombre) VALUES (?,?,?)`,
    [Id_Servicio, Paso_Numero, Paso_Nombre]
  )
}

// Guardar consumo
export async function guardarConsumo(Id_Servicio, Shampoo, Cera, Panos, Agua) {
  await pool.query(
    `INSERT INTO CONSUMO (Id_Servicio, Shampoo, Cera, Panos, Agua) VALUES (?,?,?,?,?)`,
    [Id_Servicio, Shampoo, Cera, Panos, Agua]
  )
}

// Guardar log
export async function guardarLog(Descripcion) {
  await pool.query(`INSERT INTO LOG (Descripcion) VALUES (?)`, [Descripcion])
}