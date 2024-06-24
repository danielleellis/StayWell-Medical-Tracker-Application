const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

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


// Endpoint to handle user login
app.post('/api/signin', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM Users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        res.status(200).json({ userId: user.userId, email: user.email, firstName: user.firstName, lastName: user.lastName });
    });
});


// ==============================================================================
// Functions for posting info to database
// ==============================================================================

// Endpoint to sign up a new user with first/last name, email, password, and generate a userID by hashing their email address
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const stmt = db.prepare('INSERT INTO Users (userID, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)');

    stmt.run([userID, firstName, lastName, email, hashedPassword], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'User added successfully!', userID });
    });

    stmt.finalize();
});


// Endpoint to add profile setup info for username, pronouns, birthday, profile picture
app.post('/api/profile-setup', (req, res) => {
    const { email, username, pronouns, phone, birthday, profilePhoto } = req.body;

    const query = `
        UPDATE Users
        SET username = ?, pronouns = ?, phone = ?, birthday = ?, profilePhoto = ?
        WHERE email = ?
    `;

    db.run(query, [username, pronouns, phone, birthday, profilePhoto, email], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ success: true });
    });
});
