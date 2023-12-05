const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_PASSWORD,
});

console.log('Connected to database');
console.log('MYSQL_HOST: ' + process.env.MYSQL_HOST);
console.log('MYSQL_USER: ' + process.env.MYSQL_USER);
console.log('MYSQL_DATABASE: ' + process.env.MYSQL_DATABASE);
console.log('MYSQL_PASSWORD: ' + process.env.MYSQL_PASSWORD);

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
