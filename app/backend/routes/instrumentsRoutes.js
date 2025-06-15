const express = require('express');
var db = require('../db');

const router = express.Router();

router.put('/update', async (req, res) => {

    try {

        db.query('UPDATE instruments SET type = ?, manufacturer = ?, model = ?, serial_number = ?, status_id = ? WHERE id = ?;',
            [req.body.type, req.body.manufacturer, req.body.model, req.body.serial_number, req.body.status_id, req.body.id]);

    } catch (err) {
        console.error('Failed to update instrument:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.post('/create', async (req, res) => {

    try {
    
        const response = await db.promise().query('INSERT INTO instruments (type, manufacturer, model, serial_number, status_id) VALUES (?, ?, ?, ?, ?);',
            [req.body.type, req.body.manufacturer, req.body.model, req.body.serial_number, req.body.status_id]);

        res.send(response[0]);

    } catch (err) {
        console.error('Failed to update instruments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
})

router.get('/search/:query', async (req, res) => {

    try {

        const searchResults = await db.promise().query('SELECT id, type, manufacturer, model, serial_number FROM instruments WHERE serial_number LIKE CONCAT("%", ?, "%") LIMIT 20;',
            [req.params.query]);
        
        res.send(searchResults[0]);

    } catch (err) {
        console.error('Failed to search customers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

module.exports = router;