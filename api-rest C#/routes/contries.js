const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', async (req, res) => {
    try {
        // Ejecuta la consulta SQL
        const queryResult = await req.connection.query('SELECT * FROM hr.COUNTRIES;');

        // Transforma el recordset a un array de arrays
        const transformedResult = queryResult.recordset.map(row => [row.COUNTRY_ID, row.COUNTRY_NAME, row.REGION_ID]);

        // Envía los resultados como respuesta (formato deseado)
        res.status(200).json(transformedResult);
    } catch (err) {
        console.error('Error en la consulta SQL', err);
        // Enviar un mensaje más detallado en caso de error
        res.status(500).json({ error: 'Error de la base de datos', message: err.message });
    }
});

module.exports = router;

