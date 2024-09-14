/*
 * This file contains the server commands between client and Node server to MYSQL
 * Includes AWS S3 commands for document and image storage/retrieval
 * Utilizes the config.json file for endpoint connection to either local or AWS server
 *
 * Author: Max Schumacher
 * Last Updated: September 12, 2024
 */

// ==============================================================================
// Required packages
// ==============================================================================
require("dotenv").config(); // .env file contains database/ec2/s3 connection info
const express = require("express");
const bodyParser = require("body-parser");

// Database requirements
const cors = require("cors");
const bcrypt = require("bcrypt"); // For hashing passwords
const mysql = require("mysql");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// S3 bucket reqirements
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer();

// ==============================================================================
// Functions for connection of MYSQL database
// ==============================================================================

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Declare variables from the .env file for MySQL connection
const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

// Create MySQL connection
const connection = mysql.createConnection({
    host: db_host,
    port: db_port,
    user: db_user,
    password: db_pass,
    database: db_name,
});

// Ensure the database connection is established
connection.connect((err) => {
    if (err) {
        console.error("Database connection error:", err);
        return;
    }
    console.log("Connected to MySQL database");

    // Create Users table if not exists
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Users (
        userID VARCHAR(255) PRIMARY KEY,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        username VARCHAR(255),
        pronouns VARCHAR(255),
        phoneNumber VARCHAR(255),
        birthday DATE,
        profilePhoto VARCHAR(255),
        verificationCode INT
    )`;

    connection.query(createTableQuery, (err) => {
        if (err) {
            console.error("Error creating Users table:", err);
            return;
        }
        console.log("Users table created or already exists");
    });
});

// ==============================================================================
// Helper functions for database needs like generating data
// ==============================================================================

// userID generation function
const generateRandomID = (length = 10) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    console.log("Generated ID:", result);
    return result;
};

// Helper function to format the date as MM/DD/YYYY with validation
const formatBirthdayForDisplay = (date) => {
    if (!date) return null; // Return null if date is not provided

    const parsedDate = new Date(date);

    // Check if parsedDate is a valid date
    if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date provided:", date);
        return null; // Return null if the date is invalid
    }

    const month = parsedDate.getMonth() + 1; // Months are 0-indexed
    const day = parsedDate.getDate();
    const year = parsedDate.getFullYear();

    // Return formatted date as MM/DD/YYYY
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
};


// ==============================================================================
// Functions for getting info from database
// ==============================================================================
// Health check endpoint to test server connection
app.get("/", (req, res) => {
    console.log("Root endpoint accessed - server is running");
    res.send("Server is running on port 3000");
});

// Endpoint to get all users
app.get("/users", (req, res) => {
    console.log("/users endpoint reached");

    const sql = "SELECT * FROM Users";
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ users: results });
        console.log("Returning all users data");
    });
});

// Endpoint to get a user by ID
app.get("/users/:id", (req, res) => {
    console.log("/users/:id endpoint reached");
    const userID = req.params.id;
    const sql = "SELECT * FROM Users WHERE userID = ?";
    connection.query(sql, [userID], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            console.error("Error fetching user by ID:", err.message);
            return;
        }

        if (results.length > 0) {
            const user = results[0];

            // Format birthday if it exists
            if (user.birthday) {
                user.birthday = formatBirthdayForDisplay(user.birthday);
            }

            res.json({ user });
            console.log(
                `Returning data for user ${user.firstName} ${user.lastName}`
            );
        } else {
            res.status(404).json({ error: "User not found" });
            console.log("User not found");
        }
    });
});

// Endpoint to check if email is already taken
app.get("/check-email/:email", (req, res) => {
    console.log("/check-email/:email endpoint reached");
    const email = req.params.email;
    console.log(`Checking email on sign up: ${email}`);
    const sql = "SELECT * FROM Users WHERE email = ?";
    connection.query(sql, [email], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            console.error("Error checking email:", err.message);
            return;
        }
        if (results.length > 0) {
            // Email is already taken
            res.json({ taken: true });
            console.log(`Email ${email} is already taken`);
        } else {
            // Email is available
            res.json({ taken: false });
            console.log(`Email ${email} is available`);
        }
    });
});

// ==============================================================================
// Functions for posting info to database
// ==============================================================================

// Endpoint to handle user login
app.post("/signin", async (req, res) => {
    console.log("/signin endpoint reached");
    const { email, password } = req.body;

    const sql = "SELECT * FROM Users WHERE email = ?";
    connection.query(sql, [email], async (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            console.error("Error during sign-in:", err.message);
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.status(200).json({ userID: user.userID });
                console.log(`Password match found for ${email}`);
            } else {
                res.status(401).json({ message: "Invalid email or password" });
                console.log(`Password match not found for ${email}`);
            }
        } else {
            res.status(401).json({ message: "User not found" });
            console.log("User not found");
        }
    });
});


app.post("/signup", async (req, res) => {
    console.log("/signup endpoint reached");
    const { firstName, lastName, email, password, profilePhoto } = req.body;
    console.log(`Signup Attempted: ${firstName} ${lastName} ${email}`);

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);

        // Generate userID
        const userID = generateRandomID(10);
        console.log("Generated userID:", userID);

        const sql =
            "INSERT INTO Users (userID, firstName, lastName, email, password, profilePhoto) VALUES (?, ?, ?, ?, ?, ?)";
        connection.query(
            sql,
            [userID, firstName, lastName, email, hashedPassword, profilePhoto],
            (err) => {
                if (err) {
                    console.log(
                        `Error encountered during signup: ${err.message}`
                    );
                    return res.status(400).json({ error: err.message });
                }
                console.log(
                    `Signup successful for ${userID}: ${firstName} ${lastName} ${email}`
                );
                res.status(200).json({ success: true, userID, hashedPassword });
            }
        );
    } catch (error) {
        console.log(`Error caught during signup: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});


// Endpoint to update user profile
app.put("/profile-setup", async (req, res) => {
    console.log("/profile-setup endpoint reached");
    const {
        userID,
        username,
        pronouns = "",
        phone,
        birthday,
        profilePhoto,
    } = req.body;

    console.log("Received userID:", userID);
    console.log("Received data:", {
        username,
        pronouns,
        phone,
        birthday,
        profilePhoto,
    });

    // Check if all required fields are present
    if (!userID || !username || !phone || !birthday) {
        console.error("Missing fields in profile setup data");
        return res
            .status(400)
            .json({ error: "Missing fields in profile setup data" });
    }

    const formattedBirthday = new Date(birthday).toISOString().split('T')[0];

    const sql = "UPDATE Users SET username = ?, pronouns = ?, phoneNumber = ?, birthday = ?, profilePhoto = ? WHERE userID = ?";
    connection.query(sql, [username, pronouns, phone, formattedBirthday, profilePhoto, userID], (err) => {
        if (err) {
            console.error("Error updating user:", err.message);
            return res.status(400).json({ error: err.message });
        }
        console.log("Database update successful");
        res.status(200).json({ success: true });
    });

});


// Endpoint to fetch user profile data
app.get("/profile/:userID", async (req, res) => {
    console.log("/profile/:userID endpoint reached");
    const { userID } = req.params;
    console.log("Received userID:", userID);

    const sql = "SELECT username, pronouns, phoneNumber, birthday, profilePhoto FROM Users WHERE userID = ?";
    connection.query(sql, [userID], (err, results) => {
        if (err) {
            console.error("Error fetching user data:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        const user = results[0];

        // Format the birthday for display purposes (MM/DD/YYYY)
        if (user.birthday) {
            user.birthday = formatBirthdayForDisplay(user.birthday);
        }

        console.log("User data fetched successfully:", user);
        res.status(200).json(user);
    });
});


// ==============================================================================
// Functions for email verification and forgot password codes
// ==============================================================================

// Endpoint to retrieve verification code for a specific email
app.get("/verify-code/:email", (req, res) => {
    console.log("//verify-code/:email endpoint reached");
    const email = req.params.email;

    const sql = "SELECT verificationCode FROM Users WHERE email = ?";
    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Error retrieving verification code:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Verification code retrieved successfully");
        res.status(200).json({ verificationCode: results[0].verificationCode });
    });
});

// Endpoint to update verification code for a specific email
app.put("/update-verify-code", (req, res) => {
    console.log("/update-verify-code endpoint reached");
    const { email, verificationCode } = req.body;

    const sql = "UPDATE Users SET verificationCode = ? WHERE email = ?";
    connection.query(sql, [verificationCode, email], (err, results) => {
        if (err) {
            console.error("Error updating verification code:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (results.affectedRows === 0) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Verification code updated successfully");
        res.status(200).json({ success: true });
    });
});

// ==============================================================================
// S3 bucket variables declaration and commands
// ==============================================================================

// S3 bucket requirements
const s3_bucket = process.env.S3_BUCKET;
const s3_access_key = process.env.S3_ACCESS_KEY_ID;
const s3_secret_access_key = process.env.S3_SECRET_ACCESS_KEY;
const aws_region = process.env.AWS_REGION;

// Set up S3
const s3 = new AWS.S3({
    accessKeyId: s3_access_key,
    secretAccessKey: s3_secret_access_key,
    region: aws_region,
});

// Handle image upload
app.post(
    "/upload-profile-picture",
    upload.single("image"),
    async (req, res) => {
        console.log("/upload-profile-picture endpoint reached");

        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // Extract userID from req.file.originalname properly
            const userID = req.file.originalname.split("-")[0];
            const filePath = `users/${userID}/${userID}-profile-picture.jpg`; // Correct file path

            const params = {
                Bucket: s3_bucket,
                Key: filePath,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };

            const data = await s3.upload(params).promise();
            console.log("File uploaded successfully:", data.Location);
            res.json({ imageUrl: data.Location });
        } catch (error) {
            console.error("Error uploading file:", error);
            res.status(500).json({ error: "Error uploading file" });
        }
    }
);

app.get("/get-image", async (req, res) => {
    console.log("/get-image endpoint reached");

    const { key } = req.query;
    const params = {
        Bucket: s3_bucket,
        Key: `users/${key}/${key}-profile-picture.jpg`, // Use correct path format
    };

    console.log(`Checking image existence from ${params.Key}`);
    try {
        await s3.headObject(params).promise(); // Check if the object exists

        // If object exists, generate the signed URL
        const url = await s3.getSignedUrlPromise("getObject", {
            ...params,
            Expires: 60 * 5, // Set expiration as needed
        });
        res.status(200).json({ url });
    } catch (error) {
        if (error.code === "NotFound") {
            console.log(`Image not found at ${params.Key}`);
            res.status(404).json({ error: "Image not found" });
        } else {
            console.error("Error generating signed URL:", error);
            res.status(500).json({ error: "Error generating signed URL" });
        }
    }
});
