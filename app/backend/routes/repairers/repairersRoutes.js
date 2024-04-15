const express = require('express');
var db = require('../../db');

const router = express.Router();

router.get('/getRepairers', (req, res) => {
    const sqlSelect = 'SELECT * FROM repairers;';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.post('/addRepairer', (req, res) => {
    const sqlInsert = 'INSERT INTO repairers (name) VALUES (?);';

    db.query(sqlInsert, req.body.name, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.put('/editRepairer', (req, res) => {
    const sqlUpdate = 'UPDATE repairers SET name = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.name, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.delete('/deleteRepairer/:id', (req, res) => {
    const sqlDelete = 'DELETE FROM repairers WHERE id = ?';

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