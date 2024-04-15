const express = require('express');
var db = require('../../db');

const router = express.Router();

router.get('/getActiveInstruments', (req, res) => {
    const sqlSelect = 'SELECT instruments.* FROM instruments INNER JOIN repairs ON instruments.id = repairs.instrument_id WHERE repairs.status < 3;';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.get('/getInstrument/:id', (req, res) => {
    const sqlSelect = 'SELECT * FROM instruments WHERE id = ?;';

    db.query(sqlSelect, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})

router.post('/searchInstruments', (req, res) => {
    const searchTerms = JSON.parse(req.body.searchTerms);

    var sqlSelect = 'SELECT * FROM instruments WHERE CONCAT(type,manufacturer,model,serial_number) LIKE CONCAT("%",?,"%")';
    searchTerms.forEach(searchTerm => {
        if (searchTerm === searchTerms[0]) return;
        sqlSelect += ' AND CONCAT(type,manufacturer,model,serial_number) LIKE CONCAT("%",?,"%")';
    });
    sqlSelect += ';';
    console.log(sqlSelect)

    db.query(sqlSelect, searchTerms, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
            console.log(result)
        }
    });
});

router.post('/createInstrument', (req, res) => {
    const sqlInsert = 'INSERT INTO instruments (type, manufacturer, model, serial_number) VALUES (?, ?, ?, ?);';

    db.query(sqlInsert, [req.body.type, req.body.manufacturer, req.body.model, req.body.serial_number], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.put('/editInstrument', (req, res) => {
    const sqlUpdate = 'UPDATE instruments SET type = ?, manufacturer = ?, model = ?, serial_number = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.type, req.body.manufacturer, req.body.model, req.body.serial_number, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.delete('/deleteInstrument/:id', (req, res) => {
    const sqlDelete = 'DELETE FROM instruments WHERE id = ?';

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