var mysql = require('mysql2');
var settings = {
    host: process.env.db_host,
    user: process.env.db_username,
    password: process.env.db_password,
    database: process.env.db_name,
};
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createPool(settings);

        /*db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });*/
    }
    return db;
}

module.exports = connectDatabase();