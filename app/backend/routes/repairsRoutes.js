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

        db.promise().query(`SELECT id, date_created, time, time_cost, materials, material_cost, job_type_id, notes
                            FROM assessments
                            WHERE repair_id = ?;`,
                        [req.params.id])

        ]

        const [repair, assessments] = await Promise.all(queries);

        if (repair[0].length === 0) {
            res.send('Invalid Repair Id');
            return;
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
                    date_created: assessment.date_created,
                    time: assessment.time,
                    time_cost: assessment.time_cost,
                    materials: assessment.materials,
                    material_cost: assessment.material_cost,
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

router.put('/update', async (req, res) => {

    try {

        db.query('UPDATE repairs SET status = ?, notes = ? WHERE id = ?;', [req.body.status, req.body.notes, req.body.id]);

    } catch (err) {
        console.error('Failed to update repair:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

module.exports = router;