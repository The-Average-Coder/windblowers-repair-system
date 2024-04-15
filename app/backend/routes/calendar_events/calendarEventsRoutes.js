const express = require('express');
var db = require('../../db');

const router = express.Router();

router.get('/getRecentCalendarEvents', (req, res) => {
    const sqlSelect = 'SELECT * FROM calendar_events WHERE EXTRACT(year from start) = EXTRACT(year from CURRENT_TIMESTAMP) or EXTRACT(year from start) = EXTRACT(year from CURRENT_TIMESTAMP) - 1;';

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



router.put('/updateRepairStatus', (req, res) => {
    const sqlUpdate = 'UPDATE calendar_events SET color = ? WHERE repair_id = ?;';

    db.query(sqlUpdate, [req.body.color, req.body.repair_id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

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