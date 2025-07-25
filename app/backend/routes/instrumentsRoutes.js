const express = require('express');
var db = require('../db');

const router = express.Router();

router.get('/get/:id', async (req, res) => {

    try {

        const response = await db.promise().query('SELECT * FROM instruments WHERE id = ?',
            [req.params.id]);
            
        res.send(response[0][0]);

    } catch (err) {
        console.error('Failed to get instrument: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }

})

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

        const searchResults = await db.promise().query('SELECT id, type, manufacturer, model, serial_number FROM instruments WHERE serial_number LIKE CONCAT("%", ?, "%") LIMIT 5;',
            [req.params.query]);
        
        res.send(searchResults[0]);

    } catch (err) {
        console.error('Failed to search customers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.get('/getRepairHistory/:id', async (req, res) => {

    try {

        const response = await db.promise().query('SELECT repairs.id, customers.firstname, customers.surname FROM repairs INNER JOIN customers ON repairs.customer_id = customers.id WHERE instrument_id = ? ORDER BY repairs.id DESC',
            [req.params.id]);
        
        const formattedData = response[0].map(repair => {return {
            id: repair.id,
            customer: {
                firstname: repair.firstname,
                surname: repair.surname
            }
        }})
            
        res.send(formattedData);

    } catch (err) {
        console.error('Failed to get customer: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }

})

module.exports = router;