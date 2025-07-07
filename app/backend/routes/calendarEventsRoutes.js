const express = require('express');
var db = require('../db');

const router = express.Router();

router.get('/get', async (req, res) => {

    try {

        const formatDate = (date) => {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            // Add leading zero to day and month if needed
            day = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;

            // Format the date as dd-mm-yyyy
            const formattedDate = `${day}-${month}-${year}`;

            return formattedDate;
        }

        const response = await db.promise().query(
            `SELECT calendar_events.id, calendar_events.type, calendar_events.title, calendar_events.description,
            calendar_events.date, calendar_events.time, calendar_events.all_day, calendar_events.color, calendar_events.repairer_id,
            repairs.id as repair_id, repairs.status, repairs.in_house,
            customers.firstname, customers.surname,
            instruments.type as instrument_type, instruments.manufacturer, instruments.model, instruments.serial_number, instruments.status_id,
            assessment.job_type_id
            FROM calendar_events
            LEFT JOIN repairs ON calendar_events.repair_id = repairs.id
            LEFT JOIN customers ON customers.id = repairs.customer_id
            LEFT JOIN instruments ON instruments.id = repairs.instrument_id
            LEFT JOIN (
                SELECT * FROM assessments a1 WHERE a1.id = (SELECT a2.id FROM assessments a2 WHERE a2.repair_id = a1.repair_id ORDER BY a2.date_created ASC LIMIT 1)
            ) assessment ON assessment.repair_id = repairs.id
            WHERE date BETWEEN CURRENT_DATE - INTERVAL 1 YEAR AND CURRENT_DATE + INTERVAL 1 YEAR;`)

        const formattedData = response[0].map(event => {return {
            id: event.id,
            type: event.type,
            title: event.title,
            description: event.description,
            date: formatDate(event.date),
            time: event.time,
            all_day: Boolean(event.all_day),
            color: event.color,
            repairer_id: event.repairer_id,
            repair: event.repair_id ? {
                id: parseInt(event.repair_id),
                status: event.status,
                in_house: event.in_house,
                customer: event.in_house ? {} : {
                    firstname: event.firstname,
                    surname: event.surname
                },
                instrument: {
                    type: event.instrument_type,
                    manufacturer: event.manufacturer,
                    model: event.model,
                    serial_number: event.serial_number,
                    status: event.status_id
                },
                assessment: {
                    job_type: event.job_type_id
                }
            } : {}
        }})

        res.send(formattedData);

    } catch (err) {
        console.error('Failed to fetch calendar events:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.post('/create', async (req, res) => {

    try {
    
        const response = await db.promise().query('INSERT INTO calendar_events (type, title, description, date, time, all_day, color, repairer_id, repair_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
            [req.body.type, req.body.title, req.body.description, new Date(`${req.body.date.slice(3, 5)}/${req.body.date.slice(0, 2)}/${req.body.date.slice(6)}`), req.body.time, req.body.all_day, req.body.color, req.body.repairer_id, req.body.repair ? req.body.repair.id : '']);

        res.send(response[0]);

    } catch (err) {
        console.error('Failed to create repair:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.put('/update', async (req, res) => {

    try {

        db.query('UPDATE calendar_events SET type = ?, title = ?, description = ?, date = ?, time = ?, all_day = ?, color = ?, repairer_id = ?, repair_id = ? WHERE id = ?;',
            [req.body.type, req.body.title, req.body.description, new Date(req.body.date.slice(3, 6) + req.body.date.slice(0, 3) + req.body.date.slice(6)), req.body.time, req.body.all_day, req.body.color, req.body.repairer_id, req.body.repair && req.body.repair.id ? req.body.repair.id : '0', req.body.id]);

    } catch (err) {
        console.error('Failed to update calendar event:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.delete('/delete/:id', async (req, res) => {

    try {

        db.query('DELETE FROM calendar_events WHERE id = ?;',
            [req.params.id]);

    } catch (err) {
        console.error('Failed to delete calendar event:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

module.exports = router;