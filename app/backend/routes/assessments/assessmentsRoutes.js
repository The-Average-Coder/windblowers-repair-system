const express = require('express');
var db = require('../../db');

const router = express.Router();

router.get('/getActiveAssessments', (req, res) => {
    const sqlSelect = 'SELECT assessments.* FROM assessments INNER JOIN repairs ON repairs.id = assessments.repair_id WHERE repairs.status < 4;';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.get('/getRepairAssessments/:id', (req, res) => {
    const sqlSelect = 'SELECT * FROM assessments WHERE repair_id = ?';

    db.query(sqlSelect, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.post('/addAssessment', (req, res) => {
    const sqlInsert = 'INSERT INTO assessments (repair_id, date_created, time, time_cost, materials, material_cost, material_cost_customer, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';

    db.query(sqlInsert, [req.body.repair_id, req.body.date_created, req.body.time, req.body.time_cost, req.body.materials, req.body.material_cost, req.body.material_cost_customer, req.body.notes], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.put('/updateAssessment', (req, res) => {
    const sqlUpdate = 'UPDATE assessments SET repair_id = ?, time = ?, time_cost = ?, materials = ?, material_cost = ?, material_cost_customer = ?, notes = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.repair_id, req.body.time, req.body.time_cost, req.body.materials, req.body.material_cost, req.body.material_cost_customer, req.body.notes, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.delete('/deleteAssessment/:id', (req, res) => {
    const sqlDelete = 'DELETE FROM assessments WHERE id = ?';

    db.query(sqlDelete, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

module.exports = router;