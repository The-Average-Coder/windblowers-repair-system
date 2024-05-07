const express = require('express');
var db = require('../../db');

const router = express.Router();

router.get('/getActiveRepairs', (req, res) => {
    const sqlSelect = 'SELECT * FROM repairs WHERE status < 3 ORDER BY id DESC';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})

router.get('/getLastRepairId', (req, res) => {
    const sqlSelect = 'SELECT max(id) as maxId From repairs';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})

router.get('/getRepair/:id', (req, res) => {
    const sqlSelect = 'SELECT * FROM repairs WHERE id = ?';

    db.query(sqlSelect, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.get('/getRepairsOfCustomer/:id', (req, res) => {
    const sqlSelect = 'SELECT repairs.*, instruments.type, instruments.manufacturer, instruments.model, instruments.serial_number FROM repairs LEFT JOIN instruments ON repairs.instrument_id = instruments.id WHERE customer_id = ?';

    db.query(sqlSelect, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.get('/getRepairsOfInstrument/:id', (req, res) => {
    const sqlSelect = 'SELECT repairs.*, customers.firstname, customers.surname FROM repairs LEFT JOIN customers ON repairs.customer_id = customers.id WHERE instrument_id = ?';

    db.query(sqlSelect, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.get('/getRepairsRecievedThisMonth', (req, res) => {
    const sqlSelect = 'SELECT COUNT(CASE WHEN MONTH(STR_TO_DATE(date_created, "%d-%m-%Y")) = MONTH(CURRENT_DATE()) THEN id END) AS repairCount FROM repairs;';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})

router.get('/getRepairsCompleteThisMonth', (req, res) => {
    const sqlSelect = 'SELECT COUNT(CASE WHEN MONTH(STR_TO_DATE(date_completed, "%d-%m-%Y")) = MONTH(CURRENT_DATE()) THEN id END) AS repairCount FROM repairs;';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})

router.post('/searchRepairs', (req, res) => {
    const searchTerms = JSON.parse(req.body.searchTerms);

    var sqlSelect = 'SELECT repairs.*,firstname,surname,type,manufacturer,model,serial_number FROM repairs INNER JOIN customers ON customers.id = repairs.customer_id INNER JOIN instruments ON instruments.id = repairs.instrument_id WHERE CONCAT(repairs.id,firstname,surname,email,telephone,address,type,manufacturer,model,serial_number) LIKE CONCAT("%",?,"%")';
    searchTerms.forEach(searchTerm => {
        if (searchTerm === searchTerms[0]) return;
        sqlSelect += ' AND CONCAT(repairs.id,firstname,surname,email,telephone,address,type,manufacturer,model,serial_number) LIKE CONCAT("%",?,"%")';
    });
    sqlSelect += ';';

    db.query(sqlSelect, searchTerms, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.post('/createRepair', (req, res) => {
    const sqlInsert = 'INSERT INTO repairs (id, date_created) VALUES (?, ?);';

    db.query(sqlInsert, [req.body.id, req.body.date_created], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/addCustomer', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET customer_id = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.customer_id, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/removeCustomer/:id', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET customer_id = -1 WHERE id = ?';

    db.query(sqlUpdate, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/addInstrument', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET instrument_id = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.instrument_id, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/removeInstrument/:id', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET instrument_id = -1 WHERE id = ?';

    db.query(sqlUpdate, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/editNotes', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET notes = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.notes, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/editOpenJobDetails', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET repairer_id = ?, deadline = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.repairer_id, req.body.deadline, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
})

router.put('/incrementStatus/:id', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET status = status + 1 WHERE id = ?';

    db.query(sqlUpdate, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/decrementStatus/:id', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET status = status - 1 WHERE id = ?';

    db.query(sqlUpdate, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/completeJob', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET date_completed = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.date, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/uncompleteJob/:id', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET date_completed = NULL WHERE id = ?';

    db.query(sqlUpdate, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/collectJob', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET date_collected = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.date, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/uncollectJob/:id', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET date_collected = NULL WHERE id = ?';

    db.query(sqlUpdate, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/toggleArchive/:id', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET archived = 1 - archived WHERE id = ?';

    db.query(sqlUpdate, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/deleteCustomer/:id', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET customer_id = -1 WHERE customer_id = ?';

    db.query(sqlUpdate, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/deleteInstrument/:id', (req, res) => {
    const sqlUpdate = 'UPDATE repairs SET instrument_id = -1 WHERE instrument_id = ?';

    db.query(sqlUpdate, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.delete('/deleteRepair/:id', (req, res) => {
    const sqlDelete = 'DELETE FROM repairs WHERE id = ?';

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