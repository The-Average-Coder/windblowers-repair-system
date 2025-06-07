const express = require('express');
var db = require('../db');

const router = express.Router();

router.get('/get', async (req, res) => {

    try {
        const queries = [
            db.promise().query('SELECT * FROM job_types WHERE id > 1;'), // ID > 1 to ignore 'Unspecified' which isn't needed for settings page
            db.promise().query('SELECT * FROM instrument_statuses;'),
            db.promise().query('SELECT * FROM materials;'),
            db.promise().query('SELECT * FROM calendar_details_settings;'),
            db.promise().query('SELECT hourly_rate FROM hourly_rate;')
        ];

        const [job_types, instrument_statuses, materials, calendar_details_settings, hourly_rate] = await Promise.all(queries);

        const formatted_data = {
            job_types: job_types[0].map(job_type => {return {...job_type, materials: job_type.materials.trim() !== '' ? job_type.materials.split(',').map(materialString => {return { id: materialString.split('x')[0], quantity: materialString.split('x')[1] }}) : []}}),
            instrument_statuses: instrument_statuses[0],
            materials: materials[0].map(material => {return {...material, price: material.price / 100}}),
            calendar_details_settings: calendar_details_settings[0],
            hourly_rate: hourly_rate[0][0].hourly_rate / 100
        };

        res.send(formatted_data);

    } catch (err) {
        console.error('Failed to fetch settings:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.post('/addJobType', async (req, res) => {

    try {

        const response = await db.promise().query('INSERT INTO job_types (name, notes, materials, time) VALUES (?, ?, ?, ?);',
            [req.body.name, req.body.notes, req.body.materials.length > 0 ? req.body.materials.map(material => `${material.id}x${material.quantity}`).join(',') : '', req.body.time]);

        res.send(response[0]);

    } catch (err) {
        console.error('Failed to update job types:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.put('/updateJobType', async (req, res) => {

    try {

        db.query('UPDATE job_types SET name = ?, notes = ?, materials = ?, time = ? WHERE id = ?;',
            [req.body.name, req.body.notes, req.body.materials.map(material => `${material.id}x${material.quantity}`).join(','), req.body.time, req.body.id]);

    } catch (err) {
        console.error('Failed to update job types:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.delete('/deleteJobType/:id', async (req, res) => {

    try {

        db.query('DELETE FROM job_types WHERE id = ?;',
            [req.params.id]);

    } catch (err) {
        console.error('Failed to update job types:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.get('/getInstrumentStatuses', async (req, res) => {

    try {

        const instrumentStatuses = await db.promise().query('SELECT id, status FROM instrument_statuses;');

        res.send(instrumentStatuses[0])

    } catch (err) {
        console.error('Failed to fetch instrument statuses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.post('/addInstrumentStatus', async (req, res) => {

    try {

        const response = await db.promise().query('INSERT INTO instrument_statuses (status) VALUES (?);',
            [req.body.status]);

        res.send(response[0]);

    } catch (err) {
        console.error('Failed to update instrument statuses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.put('/updateInstrumentStatus', async (req, res) => {

    try {

        db.query('UPDATE instrument_statuses SET status = ? WHERE id = ?;',
            [req.body.status, req.body.id]);

    } catch (err) {
        console.error('Failed to update instrument statuses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.delete('/deleteInstrumentStatus/:id', async (req, res) => {

    try {

        db.query('DELETE FROM instrument_statuses WHERE id = ?;',
            [req.params.id]);

    } catch (err) {
        console.error('Failed to update instrument statuses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.get('/getMaterials', async (req, res) => {

    try {

        const materials = await db.promise().query('SELECT id, name, price FROM instrument_statuses;');

        res.send(materials[0])

    } catch (err) {
        console.error('Failed to fetch materials:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.post('/addMaterial', async (req, res) => {

    try {

        const response = await db.promise().query('INSERT INTO materials (name, price) VALUES (?, ?);',
            [req.body.name, req.body.price * 100]);

        res.send(response[0]);

    } catch (err) {
        console.error('Failed to update materials:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.put('/updateMaterial', async (req, res) => {

    try {

        db.query('UPDATE materials SET name = ?, price = ? WHERE id = ?;',
            [req.body.name, req.body.price * 100, req.body.id]);

    } catch (err) {
        console.error('Failed to update materials:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.delete('/deleteMaterial/:id', async (req, res) => {

    try {

        db.query('DELETE FROM materials WHERE id = ?;',
            [req.params.id]);

    } catch (err) {
        console.error('Failed to update materials:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.put('/updateHourlyRate', async(req, res) => {

    try {

        db.query('UPDATE hourly_rate SET hourly_rate = ? WHERE id = 1;',
            [req.body.new_rate * 100]);

    }catch (err) {
        console.error('Failed to update hourly rate:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.put('/updateCalendarDetailSetting', async (req, res) => {

    try {

        db.query('UPDATE calendar_details_settings SET week_enabled = ?, day_enabled = ? WHERE id = ?;',
            [req.body.week_enabled, req.body.day_enabled, req.body.id]);

    } catch (err) {
        console.error('Failed to update calendar settings:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

module.exports = router;