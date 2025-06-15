const express = require('express');
var db = require('../db');

const router = express.Router();

router.get('/get', async (req, res) => {
    
    try {
        const repairers = await db.promise().query('SELECT * FROM repairers;');

        const formatted_data = repairers[0].map(repairer => {return {
            ...repairer,
            hours: repairer.hours.split(',').map(Number)
        }})

        res.send(formatted_data);

    } catch (err) {
        console.error('Failed to fetch repairers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.post('/create', async (req, res) => {

    try {

        const response = await db.promise().query('INSERT INTO repairers (name, hours) VALUES (?, ?);',
            [req.body.name, req.body.hours.join(',')]);

        res.send(response[0]);

    } catch (err) {
        console.error('Failed to update repairers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.put('/update', async (req, res) => {

    try {

        db.query('UPDATE repairers SET name = ?, hours = ? WHERE id = ?;',
            [req.body.name, req.body.hours.join(','), req.body.id]);

    } catch (err) {
        console.error('Failed to update repairers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.delete('/delete/:id', async (req, res) => {

    try {

        db.query('DELETE FROM repairers WHERE id = ?;',
            [req.params.id]);

    } catch (err) {
        console.error('Failed to update repairers:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

module.exports = router;