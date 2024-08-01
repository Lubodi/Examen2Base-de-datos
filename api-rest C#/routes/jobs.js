const express = require('express');
const router = express.Router();
const sql = require('mssql'); // Asegúrate de importar el paquete mssql
router.get('/', async (req, res) => {
  try {
    // Ejecuta la consulta SQL
    const queryResult = await req.connection.query('SELECT * FROM hr.JOBS;');

    // Transforma el recordset a un array de arrays
    const transformedResult = queryResult.recordset.map(row => [row.JOB_ID, row.JOB_TITLE, row.MIN_SALARY, row.MAX_SALARY]);

    // Envía los resultados como respuesta (formato deseado)
    res.status(200).json(transformedResult);
  } catch (err) {
    console.error('Error en la consulta SQL', err);
    // Enviar un mensaje más detallado en caso de error
    res.status(500).json({ error: 'Error de la base de datos', message: err.message });
  }
});

module.exports = router;