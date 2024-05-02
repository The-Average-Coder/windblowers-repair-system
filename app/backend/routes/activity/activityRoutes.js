const express = require('express');
var db = require('../../db');

const router = express.Router();

router.get('/getActivity', (req, res) => {
    const sqlSelect = 'SELECT * FROM activity;';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.post('/createActivity', (req, res) => {
    const sqlInsert = 'INSERT INTO activity (repair_id, type) VALUES (?, ?);';

    db.query(sqlInsert, [req.body.repair_id, req.body.type], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.delete('/deleteActivity/:id', (req, res) => {
    const sqlDelete = 'DELETE FROM activity WHERE id = ?';

    db.query(sqlDelete, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.delete('/deleteActivityOfRepair/:id', (req, res) => {
    const sqlDelete = 'DELETE FROM activity WHERE repair_id = ?';

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