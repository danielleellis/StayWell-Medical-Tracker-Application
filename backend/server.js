const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to SQLite database
const dbPath = path.resolve(__dirname, '../database/database.db');
const db = new sqlite3.Database(dbPath);

// Endpoint to get all users
app.get('/users', (req, res) => {
    db.all('SELECT * FROM User', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ users: rows });
    });
});

// Endpoint to get a specific user by ID
app.get('/users/:id', (req, res) => {
    const userID = req.params.id;
    db.get('SELECT * FROM User WHERE userID = ?', [userID], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ user: row });
    });
});

// Endpoint to add a new user
app.post('/users', (req, res) => {
    const { username, password, legalName, userID, pronouns, birthday, phoneNumber, emailAddress } = req.body;
    db.run(
        `INSERT INTO User (username, password, legalName, userID, pronouns, birthday, phoneNumber, emailAddress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, password, legalName, userID, pronouns, birthday, phoneNumber, emailAddress],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'User added successfully', id: this.lastID });
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
