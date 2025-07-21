const express = require('express');
var db = require('../db');

const router = express.Router();

router.get('/get/:id', async (req, res) => {

    try {

        const response = await db.promise().query('SELECT * FROM customers WHERE id = ?',
            [req.params.id]);
            
        res.send(response[0][0]);

    } catch (err) {
        console.error('Failed to get customer: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }

})

router.put('/update', async (req, res) => {

    try {

        db.query('UPDATE customers SET firstname = ?, surname = ?, email = ?, telephone = ?, address = ? WHERE id = ?;',
            [req.body.firstname, req.body.surname, req.body.email, req.body.telephone, req.body.address, req.body.id]);

    } catch (err) {
        console.error('Failed to update customer:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.post('/create', async (req, res) => {

    try {
    
        const response = await db.promise().query('INSERT INTO customers (firstname, surname, email, telephone, address) VALUES (?, ?, ?, ?, ?);',
            [req.body.firstname, req.body.surname, req.body.email, req.body.telephone, req.body.address]);

        res.send(response[0]);

    } catch (err) {
        console.error('Failed to update customers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
})

router.get('/search/:query', async (req, res) => {

    try {

        const searchResults = await db.promise().query('SELECT id, firstname, surname, email, telephone, address FROM customers WHERE CONCAT(firstname, " ", surname) LIKE CONCAT("%", ?, "%") LIMIT 5;',
            [req.params.query]);
        
        res.send(searchResults[0]);

    } catch (err) {
        console.error('Failed to search customers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.get('/getRepairHistory/:id', async (req, res) => {

    try {

        const response = await db.promise().query('SELECT repairs.id, instruments.type, instruments.manufacturer, instruments.model FROM repairs INNER JOIN instruments ON repairs.instrument_id = instruments.id WHERE customer_id = ? ORDER BY repairs.id DESC',
            [req.params.id]);
        
        const formattedData = response[0].map(repair => {return {
            id: repair.id,
            instrument: {
                type: repair.type,
                manufacturer: repair.manufacturer,
                model: repair.model
            }
        }})
            
        res.send(formattedData);

    } catch (err) {
        console.error('Failed to get customer: ', err);
        res.status(500).json({ error: 'Internal Server Error' })
    }

})

module.exports = router;