const express = require('express');
var db = require('../../db');

const router = express.Router();

router.get('/getRecentCalendarEvents', (req, res) => {
    const sqlSelect = 'SELECT calendar_events.*, repairers.color, repairers.id AS repairer_id, repairs.status, instruments.type FROM calendar_events INNER JOIN repairs ON repairs.id = calendar_events.repair_id LEFT JOIN repairers ON repairers.id = repairs.repairer_id LEFT JOIN instruments ON instruments.id = repairs.instrument_id WHERE EXTRACT(year from calendar_events.start) = EXTRACT(year from CURRENT_TIMESTAMP) or EXTRACT(year from calendar_events.start) = EXTRACT(year from CURRENT_TIMESTAMP) - 1 or EXTRACT(year from calendar_events.start) = EXTRACT(year from CURRENT_TIMESTAMP) + 1;';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.put('/moveEvent', (req, res) => {
    const sqlUpdate = 'UPDATE calendar_events SET start = ? WHERE id = ?;';

    db.query(sqlUpdate, [new Date(req.body.start), req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.put('/updatePriority', (req, res) => {
    const sqlUpdate = 'UPDATE calendar_events SET priority = ? WHERE id = ?;';

    db.query(sqlUpdate, [req.body.priority, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
})

router.post('/createEvent', (req, res) => {
    const sqlInsert = 'INSERT INTO calendar_events (repair_id, time, start, priority) VALUES (?, ?, ?, ?);';

    db.query(sqlInsert, [req.body.repair_id, req.body.time, req.body.start, req.body.priority], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})

router.delete('/deleteEvent/:id', (req, res) => {
    const sqlDelete = 'DELETE FROM calendar_events WHERE id = ?;';

    db.query(sqlDelete, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.delete('/deleteEventsOfRepair/:id', (req, res) => {
    const sqlDelete = 'DELETE FROM calendar_events WHERE repair_id = ?;';

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
