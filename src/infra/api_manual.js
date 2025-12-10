import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "AUTOLAVADO"
});

db.connect(err => {
    if (err) {
        console.log("Error connecting to the database:", err.message);
        return;
    }
    console.log("Connected to the database.");
});

app.get('/', (req, res) => {
    res.send('Hello New Contact');
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});