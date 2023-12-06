const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    }

    console.log('Connected to database');
    connection.release();
});

process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error(err);
        }
        console.log('Connection pool closed');
        process.exit();
    });
});

module.exports = pool.promise();
