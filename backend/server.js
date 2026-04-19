// Simple Backend Server for College Project
// Uses: Express, MySQL, CORS
// Running on Port 5000
// coderabbit full review trigger

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON data from frontend

// 1. MySQL Connection Configuration
const db = mysql.createConnection({
    host: 'localhost',      // XAMPP default
    user: 'root',           // XAMPP default
    password: '',           // XAMPP default (empty)
    database: 'campus_book_exchange'
});

// Connect to Database
db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed: " + err);
    } else {
        console.log("Connected to MySQL Database!");
    }
});

// 2. Default Route
app.get('/', (req, res) => {
    res.send("Server working");
});

// 3. Login API Route
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ Error: "Error in SQL Query" });
        }
        
        if (result.length > 0) {
            // User found
            return res.json({ Login: true, User: result[0] });
        } else {
            // User not found
            return res.json({ Login: false, Message: "Wrong email or password" });
        }
    });
});

// 4. Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
});
