const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'AUTOLAVADO'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

// =============== ENDPOINTS ===============

// 1. Servicios Lavado Manual
app.get('/servicios/manual', (req, res) => {
    const q = `
    SELECT S.Id_Servicio, V.Id_Vehiculo AS Placa, S.Id_Estacion, S.Inicio, S.Fin, S.Duracion, S.Estado
    FROM SERVICIO S
    INNER JOIN VEHICULO V ON S.Id_Vehiculo = V.Id_Vehiculo
    WHERE S.Id_Estacion IN (1,2);
    `;
    db.query(q, (err, data) => err ? res.json(err) : res.json(data));
});

// 2. Servicios Lavado Automático
app.get('/servicios/automatico', (req, res) => {
    const q = `
    SELECT S.Id_Servicio, V.Id_Vehiculo AS Placa, S.Id_Estacion, S.Inicio, S.Fin, S.Duracion, S.Estado
    FROM SERVICIO S
    INNER JOIN VEHICULO V ON S.Id_Vehiculo = V.Id_Vehiculo
    WHERE S.Id_Estacion IN (3,4);
    `;
    db.query(q, (err, data) => err ? res.json(err) : res.json(data));
});

// 3. Tiempo máximo Lavado Manual
app.get('/tiempo-max/manual', (req, res) => {
    const q = `
    SELECT S.Id_Servicio, V.Id_Vehiculo AS Placa, S.Id_Estacion, S.Duracion, S.Inicio, S.Fin
    FROM SERVICIO S
    INNER JOIN VEHICULO V ON S.Id_Vehiculo = V.Id_Vehiculo
    WHERE S.Id_Estacion IN (1,2)
    ORDER BY S.Duracion DESC LIMIT 1;
    `;
    db.query(q, (err, data) => err ? res.json(err) : res.json(data));
});

// 4. Tiempo máximo Lavado Automático
app.get('/tiempo-max/automatico', (req, res) => {
    const q = `
    SELECT S.Id_Servicio, V.Id_Vehiculo AS Placa, S.Id_Estacion, S.Duracion, S.Inicio, S.Fin
    FROM SERVICIO S
    INNER JOIN VEHICULO V ON S.Id_Vehiculo = V.Id_Vehiculo
    WHERE S.Id_Estacion IN (3,4)
    ORDER BY S.Duracion DESC LIMIT 1;
    `;
    db.query(q, (err, data) => err ? res.json(err) : res.json(data));
});

// 5. Consumos Lavado Manual
app.get('/consumos/manual', (req, res) => {
    const q = `
    SELECT C.Id_Consumo, S.Id_Servicio, V.Id_Vehiculo AS Placa, S.Id_Estacion,
           C.Shampoo, C.Cera, C.Panos, C.Agua
    FROM CONSUMO C
    INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio
    INNER JOIN VEHICULO V ON S.Id_Vehiculo = V.Id_Vehiculo
    WHERE S.Id_Estacion IN (1,2);
    `;
    db.query(q, (err, data) => err ? res.json(err) : res.json(data));
});

// 6. Consumos Lavado Automático
app.get('/consumos/automatico', (req, res) => {
    const q = `
    SELECT C.Id_Consumo, S.Id_Servicio, V.Id_Vehiculo AS Placa, S.Id_Estacion,
           C.Shampoo, C.Cera, C.Panos, C.Agua
    FROM CONSUMO C
    INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio
    INNER JOIN VEHICULO V ON S.Id_Vehiculo = V.Id_Vehiculo
    WHERE S.Id_Estacion IN (3,4);
    `;
    db.query(q, (err, data) => err ? res.json(err) : res.json(data));
});

// 7. Diferencia de consumo Manual vs Automático
app.get('/consumos/diferencia', (req, res) => {
    const q = `
    SELECT
        'Shampoo' AS Insumo,
        (SELECT SUM(Shampoo) FROM CONSUMO C INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio WHERE S.Id_Estacion IN (1,2)) AS Manual,
        (SELECT SUM(Shampoo) FROM CONSUMO C INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio WHERE S.Id_Estacion IN (3,4)) AS Automatico
    UNION
    SELECT 'Cera',
        (SELECT SUM(Cera) FROM CONSUMO C INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio WHERE S.Id_Estacion IN (1,2)),
        (SELECT SUM(Cera) FROM CONSUMO C INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio WHERE S.Id_Estacion IN (3,4))
    UNION
    SELECT 'Panos',
        (SELECT SUM(Panos) FROM CONSUMO C INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio WHERE S.Id_Estacion IN (1,2)),
        (SELECT SUM(Panos) FROM CONSUMO C INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio WHERE S.Id_Estacion IN (3,4))
    UNION
    SELECT 'Agua',
        (SELECT SUM(Agua) FROM CONSUMO C INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio WHERE S.Id_Estacion IN (1,2)),
        (SELECT SUM(Agua) FROM CONSUMO C INNER JOIN SERVICIO S ON C.Id_Servicio = S.Id_Servicio WHERE S.Id_Estacion IN (3,4));
    `;
    db.query(q, (err, data) => err ? res.json(err) : res.json(data));
});

// 8. Ingresos Lavado Manual
app.get('/ingresos/manual', (req, res) => {
    const q = `
    SELECT S.Id_Servicio, V.Id_Vehiculo AS Placa, S.Id_Estacion, S.Inicio, S.Fin, S.Duracion,
            IFNULL(P.Precio, 0) AS Precio,
           (S.Duracion * IFNULL(P.Precio,0)) AS Ingreso
    FROM SERVICIO S
    INNER JOIN VEHICULO V ON S.Id_Vehiculo = V.Id_Vehiculo
    LEFT JOIN PRECIO P ON S.Id_Estacion = P.Id_Estacion
    WHERE S.Id_Estacion IN (1,2);
    `;
    db.query(q, (err, data) => err ? res.status(500).json({ error: err }) : res.json(data));
});

// 9. Ingresos Lavado Automático
app.get('/ingresos/automatico', (req, res) => {
    const q = `
    SELECT S.Id_Servicio, V.Id_Vehiculo AS Placa, S.Id_Estacion, S.Inicio, S.Fin, S.Duracion,
            IFNULL(P.Precio, 0) AS Precio,
           (S.Duracion * IFNULL(P.Precio,0)) AS Ingreso
    FROM SERVICIO S
    INNER JOIN VEHICULO V ON S.Id_Vehiculo = V.Id_Vehiculo
    LEFT JOIN PRECIO P ON S.Id_Estacion = P.Id_Estacion
    WHERE S.Id_Estacion IN (3,4);
    `;
    db.query(q, (err, data) => err ? res.status(500).json({ error: err }) : res.json(data));
});

// ===================== SERVIDOR =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
});
