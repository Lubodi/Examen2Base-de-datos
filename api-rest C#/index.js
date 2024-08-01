const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

const region = require('./routes/regions');
const country = require('./routes/contries');
const job = require('./routes/jobs');
const job_history = require('./routes/jobs_history');
const locations = require('./routes/locations');
const employees = require('./routes/employes');
const departments = require('./routes/departments');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const config = {
    user: 'hr',                 // Nombre de usuario
    password: '12345678',       // Contraseña
    server: 'localhost',        // O apunta a LAPTOP-7RQTGCIG si es necesario
    database: 'hr',             // Nombre de tu base de datos
    options: {
        encrypt: false,         // Cambia a true si estás usando Azure SQL
        trustServerCertificate: true // Solo para desarrollo, permite conexiones no aseguradas
    }
};
  
  
// Configuración de conexión a la base de datos
const dbConfig = config;
let pool;

async function initialize() {
    try {
        pool = await sql.connect(dbConfig); // Conectar a SQL Server
        console.log('Conexión a la base de datos establecida correctamente');

        // Middleware para adquirir la conexión
        app.use(async (req, res, next) => {
            try {
                req.connection = await pool.connect(); // Adquirir conexión del pool
                console.log('Conexión adquirida:', req.connection);
                next();
            } catch (err) {
                console.error('Error al obtener la conexión:', err);
                return res.status(500).json({ error: 'Error de conexión a la base de datos' });
            }

            // Middleware para liberar la conexión después de cada solicitud
            res.on('finish', async () => {
                try {
                    // No es necesario cerrar la conexión, el pool lo maneja automáticamente.
                    await req.connection.close();
                    console.log('Conexión liberada' + req.connection);
                } catch (err) {
                    console.error('Error al liberar la conexión:', err);
                }
            });
        });

        app.use('/regions', region);
        app.use('/contries', country);
        app.use('/jobs', job);
        app.use('/jobs_history', job_history);
        app.use('/locations', locations);
        app.use('/employes', employees);
        app.use('/departments', departments);
   

    } catch (err) {
        console.error('Error al crear el pool de conexiones:', err);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    initialize();
});
