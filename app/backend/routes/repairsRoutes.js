const express = require('express');
var db = require('../db');

const router = express.Router();

router.get('/get/:id', async (req, res) => {

    try {

        const queries = [

        db.promise().query(`SELECT repairs.status, repairs.in_house, repairs.notes, repairs.customer_id, repairs.instrument_id,
                            customers.firstname, customers.surname, customers.email, customers.telephone, customers.address,
                            instruments.type, instruments.manufacturer, instruments.model, instruments.serial_number, instruments.status_id
                            FROM repairs
                            INNER JOIN customers ON repairs.customer_id = customers.id
                            INNER JOIN instruments ON repairs.instrument_id = instruments.id
                            WHERE repairs.id = ?;`,
                        [req.params.id]),

        db.promise().query(`SELECT id, date_created, time, time_cost, materials, job_type_id, notes
                            FROM assessments
                            WHERE repair_id = ?;`,
                        [req.params.id])

        ]

        const [repair, assessments] = await Promise.all(queries);

        if (repair[0].length === 0) {
            res.send('Invalid Repair Id');
            return;
        }

        const formatDate = (date) => {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            // Add leading zero to day and month if needed
            day = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;

            // Format the date as dd/mm/yyyy
            const formattedDate = `${day}/${month}/${year}`;

            return formattedDate;
        }

        const formatted_data = {
            status: repair[0][0].status,
            in_house: repair[0][0].in_house,
            notes: repair[0][0].notes,
            customer: {
                id: repair[0][0].customer_id,
                firstname: repair[0][0].firstname,
                surname: repair[0][0].surname,
                email: repair[0][0].email,
                telephone: repair[0][0].telephone,
                address: repair[0][0].address
            },
            instrument: {
                id: repair[0][0].instrument_id,
                type: repair[0][0].type,
                manufacturer: repair[0][0].manufacturer,
                model: repair[0][0].model,
                serial_number: repair[0][0].serial_number,
                status_id: repair[0][0].status_id
            },
            assessments: assessments[0].map(assessment => {
                return {
                    id: assessment.id,
                    date_created: formatDate(assessment.date_created),
                    time: assessment.time,
                    time_cost: assessment.time_cost / 100,
                    materials: assessment.materials.trim() !== '' ? assessment.materials.split(',').map(materialString => {return { id: parseInt(materialString.split('x')[0]), quantity: materialString.split('x')[1].split(':')[0], cost: materialString.split(':')[1] / 100 }}) : [],
                    job_type_id: assessment.job_type_id,
                    notes: assessment.notes
                }
            })
        }

        res.send(formatted_data)

    } catch (err) {
        console.error('Failed to fetch repair:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.post('/create', async (req, res) => {

    try {

        db.query('INSERT INTO repairs (id, status, customer_id, in_house, instrument_id, notes) VALUES (?, ?, ?, ?, ?, ?);',
            [req.body.id, 1, req.body.customer_id, req.body.in_house, req.body.instrument_id, req.body.notes]);

    } catch (err) {
        console.error('Failed to create repair:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.put('/update', async (req, res) => {

    try {

        db.query('UPDATE repairs SET status = ?, notes = ? WHERE id = ?;', [req.body.status, req.body.notes, req.body.id]);

    } catch (err) {
        console.error('Failed to update repair:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.delete('/delete/:id', async (req, res) => {

    try {
    
        db.query('DELETE FROM repairs WHERE id = ?;',
            [req.params.id]);

        db.query('DELETE FROM assessments WHERE repair_id = ?',
            [req.params.id]);

    } catch (err) {
        console.error('Failed to delete repair:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.get('/getPreviousRepairId', async (req, res) => {

    try {

        const response = await db.promise().query('SELECT max(id) as max_id FROM repairs;')

        res.send(response[0]);

    } catch (err) {
        console.error('Failed to get previous repair id: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.post('/assess', async (req, res) => {

    try {

        const response = await db.promise().query('INSERT INTO assessments (repair_id, date_created, time, time_cost, materials, job_type_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?);',
            [req.body.repair_id, new Date(req.body.date_created.slice(3, 6) + req.body.date_created.slice(0, 3) + req.body.date_created.slice(6)), req.body.time, Math.round(req.body.time_cost * 100), req.body.materials.map(material => `${material.id}x${material.quantity}:${Math.round(material.cost * 100)}`).join(','), req.body.job_type_id, req.body.notes]);

        db.query('UPDATE repairs SET status = 2 WHERE id = ?;', [req.body.repair_id]);

        res.send(response[0])

    } catch (err) {
        console.error('Failed to create repair:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.put('/overwriteAssessment', async (req, res) => {

    try {

        db.query('UPDATE assessments SET time = ?, time_cost = ?, materials = ?, notes = ? WHERE id = ?;',
            [req.body.time, Math.round(req.body.time_cost * 100), req.body.materials.map(material => `${material.id}x${material.quantity}:${Math.round(material.cost * 100)}`).join(','), req.body.notes, req.body.id]);

    } catch (err) {
        console.error('Failed to update assessment:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.put('/complete', async (req, res) => {

    try {

        db.query('UPDATE repairs SET status = 3 WHERE id = ?;',
            [req.body.id]);

    } catch (err) {
        console.error('Failed to update repair:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.put('/collected', async (req, res) => {

    try {

        db.query('UPDATE repairs SET status = 4 WHERE id = ?;',
            [req.body.id]);
        
        db.query('UPDATE instruments SET status_id = 1 WHERE id = ?',
            [req.body.instrument_id]
        )

    } catch (err) {
        console.error('Failed to update repair:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

module.exports = router;