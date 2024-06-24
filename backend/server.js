const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = 3000;
const bcrypt = require('bcrypt');   // for hashing passwords

app.use(bodyParser.json());
app.use(cors());


// ==============================================================================
// Functions for managing status of database
// ==============================================================================

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Connect to SQLite database
const dbPath = path.resolve(__dirname, '../database/database.db');
const db = new sqlite3.Database(dbPath);


// Create users table if not exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`);
});


// ==============================================================================
// Functions for getting info from database
// ==============================================================================

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


// Endpoint to check if email is already taken
app.get('/api/check-email/:email', (req, res) => {
    const email = req.params.email;
    db.get('SELECT * FROM Users WHERE email = ?', [email], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            // Email is already taken
            res.json({ taken: true });
        } else {
            // Email is available
            res.json({ taken: false });
        }
    });
});


// ==============================================================================
// Functions for posting info to database
// ==============================================================================

// Endpoint to handle user login
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM User WHERE email = ?', [email], async (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.status(200).json({ userId: user.userID });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});


// Function to hash email
const hashEmail = (email) => {
    return crypto.createHash('sha256').update(email).digest('hex');
};


// Endpoint to add new user
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userID = hashEmail(email);                            // Hash email address to use as account's UserID
    const hashedPassword = await bcrypt.hash(password, 10);     // Hash the password

    const stmt = db.prepare('INSERT INTO Users (userID, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)');

    stmt.run([userID, firstName, lastName, email, hashedPassword], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ success: true, userID });
    });

    stmt.finalize();
});


// Endpoint to update user profile
app.put('/api/profile-setup/:userID', async (req, res) => {
    const userID = req.params.userID;
    const { username, pronouns, phone, birthday, profilePhoto } = req.body;

    const stmt = db.prepare('UPDATE Users SET username = ?, pronouns = ?, phoneNumber = ?, birthday = ?, profilePhoto = ? WHERE userID = ?');

    stmt.run([username, pronouns, phone, birthday, profilePhoto, userID], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ success: true });
    });

    stmt.finalize();
});
