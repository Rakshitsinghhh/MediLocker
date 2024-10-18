const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Configure MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medilocker'
});

// Connect to the database
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database');
});

// Serve the add record form
app.get('/addrecord', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'addrecord.html'));
});

// Signup route
app.post('/signup', (req, res) => {
    const { username, mobile, password } = req.body;

    const query = `INSERT INTO users (username, mobile, password) VALUES (?, ?, ?)`;
    connection.query(query, [username, mobile, password], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Error saving user data' });
        } else {
            res.status(200).json({ message: 'User signed up successfully' });
        }
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error checking login credentials' });
        } else if (results.length > 0) {
            const user = results[0]; // Get the user data
            res.status(200).json({
                message: 'Login successful',
                redirectUrl: '/landingpage.html',
                uniqueId: user.id
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Add Record route
app.post('/addrecord', (req, res) => {
    const { id, disease, doctor, medicine, date } = req.body;

    const sqlQuery = `INSERT INTO Medicines (id, disease, doctor, medicine, date)
                      VALUES (?, ?, ?, ?, ?)`;

    connection.query(sqlQuery, [id, disease, doctor, medicine, date], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Error adding record' });
        } else {
            res.status(200).json({ message: 'Record added successfully', redirectUrl: '/landingpage.html', uniqueId: id });
        }
    });
});

// Fetch Record route
app.get('/getrecord', (req, res) => {
    const uniqueId = req.query.uniqueId;

    if (!uniqueId) {
        return res.status(400).json({ error: 'uniqueId is required' });
    }

    const id = parseInt(uniqueId, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'uniqueId must be a number' });
    }

    const sql = 'SELECT * FROM medicines WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'No records found' });
        }
        res.json(result);
    });
});





























// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
