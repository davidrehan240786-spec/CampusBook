const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campus_book_exchange'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting:', err);
        process.exit(1);
    }
    db.query('DESCRIBE users', (err, results) => {
        if (err) {
            console.error('Error describing users:', err);
        } else {
            console.log('Users table columns:');
            console.table(results);
        }
        db.end();
    });
});
