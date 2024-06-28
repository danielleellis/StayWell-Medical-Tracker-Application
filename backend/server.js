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


// Endpoint to sign up a new user with first/last name, email, password, and generate a userID by hashing their email address
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Generate userID (example: using email for simplicity)
        const userID = await bcrypt.hash(email, 10); // Hashing email to generate userID

        const stmt = db.prepare('INSERT INTO Users (userID, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)');
        stmt.run([userID, firstName, lastName, email, hashedPassword], function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({ success: true, userID });
        });

        stmt.finalize();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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


// ==============================================================================
// Functions for email verification and forgot password codes
// ==============================================================================

// Endpoint to retrieve verification code for a specific email
app.get('/api/verify-code/:email', (req, res) => {
    const email = req.params.email;

    const sql = 'SELECT verificationCode FROM Users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Verification code not found for the email.' });
        }
        res.status(200).json({ verificationCode: row.verificationCode });
    });
});


// Endpoint to generate a 4-digit code for email verification or forgot password
app.put('/api/verify-code/:email', async (req, res) => {
    const email = req.params.email;

    // Function to generate a random 4-digit code
    function generateVerificationCode() {
        return Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
    }

    const verificationCode = generateVerificationCode();

    const stmt = db.prepare('UPDATE Users SET verificationCode = ? WHERE email = ?');
    stmt.run(verificationCode, email, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ success: true, verificationCode: verificationCode });
    });

    stmt.finalize();
});
