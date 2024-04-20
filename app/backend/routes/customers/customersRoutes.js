const express = require('express');
var db = require('../../db');

const router = express.Router();

router.get('/getActiveCustomers', (req, res) => {
    const sqlSelect = 'SELECT customers.* FROM customers INNER JOIN repairs ON customers.id = repairs.customer_id WHERE repairs.status < 3;';

    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.get('/getCustomer/:id', (req, res) => {
    const sqlSelect = 'SELECT * FROM customers WHERE id = ?;';

    db.query(sqlSelect, req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
})

router.post('/searchCustomers', (req, res) => {
    const searchTerms = JSON.parse(req.body.searchTerms);

    var sqlSelect = 'SELECT * FROM customers WHERE CONCAT(firstname,surname,email,telephone,address) LIKE CONCAT("%",?,"%")';
    searchTerms.forEach(searchTerm => {
        if (searchTerm === searchTerms[0]) return;
        sqlSelect += ' AND CONCAT(firstname,surname,email,telephone,address) LIKE CONCAT("%",?,"%")';
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

router.post('/createCustomer', (req, res) => {
    const sqlInsert = 'INSERT INTO customers (surname, firstname, telephone, email, address) VALUES (?, ?, ?, ?, ?);';

    db.query(sqlInsert, [req.body.surname, req.body.firstname, req.body.telephone, req.body.email, req.body.address], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

router.put('/editCustomer', (req, res) => {
    const sqlUpdate = 'UPDATE customers SET surname = ?, firstname = ?, telephone = ?, email = ?, address = ? WHERE id = ?';

    db.query(sqlUpdate, [req.body.surname, req.body.firstname, req.body.telephone, req.body.email, req.body.address, req.body.id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send('Success!');
        }
    });
});

router.delete('/deleteCustomer/:id', (req, res) => {
    const sqlDelete = 'DELETE FROM customers WHERE id = ?';

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