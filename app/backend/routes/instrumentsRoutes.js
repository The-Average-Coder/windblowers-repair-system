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

module.exports = router;