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

// Configure Multer to handle both images and a PDF
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
}).fields([
    { name: "images", maxCount: 15 }, // Allow up to 15 images
    { name: "pdf", maxCount: 1 }      // Allow only one PDF
]);

// Resend used for verification codes sent in emails
const { Resend } = require('resend');
const resend = new Resend(String(process.env.EMAIL_API_KEY));

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
    return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year}`;
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

        // Generate a random 4-digit verification code
        const verificationCode = Math.floor(1000 + Math.random() * 9000);  // Random 4-digit code
        console.log("Generated verification code:", verificationCode);

        const sql =
            "INSERT INTO Users (userID, firstName, lastName, email, password, profilePhoto, verificationCode) VALUES (?, ?, ?, ?, ?, ?, ?)";
        connection.query(
            sql,
            [userID, firstName, lastName, email, hashedPassword, profilePhoto, verificationCode],
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

    const formattedBirthday = new Date(birthday).toISOString().split("T")[0];

    const sql =
        "UPDATE Users SET username = ?, pronouns = ?, phoneNumber = ?, birthday = ?, profilePhoto = ? WHERE userID = ?";
    connection.query(
        sql,
        [username, pronouns, phone, formattedBirthday, profilePhoto, userID],
        (err) => {
            if (err) {
                console.error("Error updating user:", err.message);
                return res.status(400).json({ error: err.message });
            }
            console.log("Database update successful");
            res.status(200).json({ success: true });
        }
    );
});

// Endpoint to fetch user profile data
app.get("/profile/:userID", async (req, res) => {
    console.log("/profile/:userID endpoint reached");
    const { userID } = req.params;
    console.log("Received userID:", userID);

    const sql =
        "SELECT username, pronouns, phoneNumber, birthday, profilePhoto FROM Users WHERE userID = ?";
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

// Endpoint to send and generate a new verification code for a specific email
app.get("/verify-code/:email", async (req, res) => {
    console.log("/verify-code/:email endpoint reached");

    // Get email from the request parameters
    const email = req.params.email;

    // Generate a new random 4-digit verification code
    const newVerificationCode = Math.floor(1000 + Math.random() * 9000);  // Generates a 4-digit number
    console.log(`Generated new verification code: ${newVerificationCode}`);

    // SQL query to update the new verification code in the database
    const updateSql = "UPDATE Users SET verificationCode = ? WHERE email = ?";
    connection.query(updateSql, [newVerificationCode, email], async (err, results) => {
        if (err) {
            console.error(`Error updating verification code for ${email}:`, err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // If no user is found with the given email
        if (results.affectedRows === 0) {
            console.log(`User with email ${email} not found`);
            return res.status(404).json({ error: `User with email ${email} not found` });
        }

        console.log(`Verification code updated for ${email}:`, newVerificationCode);

        // Send the new verification code via email
        try {
            console.log(`Sending new verification code to ${email}...`);
            const emailResponse = await resend.emails.send({
                from: 'onboarding@resend.dev', // Replace with your actual sender email address
                to: 'email', // The email to which the code should be sent
                //to: 'meschum2@asu.edu',
                subject: 'StayWell Verification Code',
                html: `<strong>Your new verification code is: ${newVerificationCode}</strong>`,
            });

            console.log(`Email sent to ${email} successfully`);
            return res.status(200).json({ message: 'New verification code sent via email!', data: emailResponse });
        } catch (error) {
            console.error(`Error sending verification code to ${email}:`, error.message);
            return res.status(500).json({ error: 'Failed to send verification code via email' });
        }
    });
});


// Endpoint to update verification code for a specific email
app.put("/update-verify-code", (req, res) => {
    console.log("/update-verify-code endpoint reached");
    const { email } = req.body;

    // Generate a new random 4-digit verification code
    const newVerificationCode = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
    console.log("Generated new verification code:", newVerificationCode);

    const sql = "UPDATE Users SET verificationCode = ? WHERE email = ?";
    connection.query(sql, [newVerificationCode, email], (err, results) => {
        if (err) {
            console.error("Error updating verification code:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (results.affectedRows === 0) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Verification code updated successfully");
        res.status(200).json({ success: true, newVerificationCode }); // Optionally include the new code in the response for testing
    });
});


// ==============================================================================
// Documents page
// ==============================================================================
// Endpoint to store a new document containing either images or a PDF
app.post("/new-document", upload, async (req, res) => {
    const { userID, documentName, lockPasscode } = req.body;

    if (!documentName || !userID) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Insert the document into the Documents table
        const insertDocumentSql = `INSERT INTO Documents (documentID, documentName, userID, lockPasscode) VALUES (?, ?, ?, ?)`;
        const documentID = generateRandomID(10); // Generate unique documentID
        connection.query(insertDocumentSql, [documentID, documentName, userID, lockPasscode], (err) => {
            if (err) {
                console.error("Error inserting document:", err);
                return res.status(500).json({ error: "Error inserting document" });
            }

            const uploadPromises = []; // Array to store all upload promises

            // Handle PDF upload if provided
            if (req.files.pdf && req.files.pdf.length > 0) {
                const pdfFile = req.files.pdf[0];
                const pdfID = generateRandomID(10); // Generate unique ID for the PDF
                const pdfPath = `users/${userID}/documents/${documentID}/${pdfID}.pdf`;

                const params = {
                    Bucket: s3_bucket,
                    Key: pdfPath,
                    Body: pdfFile.buffer,
                    ContentType: pdfFile.mimetype,
                };

                // Upload the PDF to S3
                uploadPromises.push(
                    s3.upload(params).promise().then((data) => {
                        const pdfURL = data.Location;
                        // Insert the PDF URL into the Images table
                        const insertPdfSql = `INSERT INTO Images (imageID, documentID, imageURL, fileType) VALUES (?, ?, ?, 'pdf')`;
                        connection.query(insertPdfSql, [pdfID, documentID, pdfURL], (err) => {
                            if (err) {
                                console.error("Error inserting PDF as an image:", err);
                            }
                        });
                    })
                );
            }

            // Handle image uploads
            if (req.files.images && req.files.images.length > 0) {
                const imageUploadPromises = req.files.images.map((file) => {
                    const imageID = generateRandomID(10); // Generate unique imageID
                    const filePath = `users/${userID}/documents/${documentID}/${imageID}`;

                    const params = {
                        Bucket: s3_bucket,
                        Key: filePath,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                    };

                    return s3.upload(params).promise().then((data) => {
                        const imageURL = data.Location;
                        const insertImageSql = `INSERT INTO Images (imageID, documentID, imageURL, fileType) VALUES (?, ?, ?, 'image')`;
                        connection.query(insertImageSql, [imageID, documentID, imageURL], (err) => {
                            if (err) {
                                console.error("Error inserting image:", err);
                            }
                        });
                    });
                });

                uploadPromises.push(...imageUploadPromises);
            }

            // Wait for all uploads to complete
            Promise.all(uploadPromises)
                .then(() => {
                    console.log(`Created Document: ${documentID} : ${documentName}`);
                    res.status(200).json({ success: true, documentID });
                })
                .catch((error) => {
                    console.error("Error uploading files:", error);
                    res.status(500).json({ error: "Error uploading files" });
                });
        });
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint to update the document name
app.put("/documents/:userID/:documentID", (req, res) => {
    const { userID, documentID } = req.params;
    const { newName } = req.body;

    if (!newName) {
        return res.status(400).json({ error: "New document name is required" });
    }

    const sql = "UPDATE Documents SET documentName = ? WHERE documentID = ? AND userID = ?";
    connection.query(sql, [newName, documentID, userID], (err, result) => {
        if (err) {
            console.error("Error updating document name:", err);
            return res.status(500).json({ error: "Error updating document name" });
        }

        if (result.affectedRows > 0) {
            console.log(`Document name updated for documentID: ${documentID}`);
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ error: "Document not found" });
        }
    });
});


// Endpoint to generate a signed URL for a PDF file
app.get("/documents/:userID/:documentID/signed-url", (req, res) => {
    const { userID, documentID } = req.params;
    const fileName = req.query.fileName;

    if (!fileName) {
        return res.status(400).json({ error: "File name is required" });
    }

    const filePath = `users/${userID}/documents/${documentID}/${fileName}`;

    const params = {
        Bucket: s3_bucket,
        Key: filePath,
        Expires: 300, // URL expiration time in seconds (5 minutes)
        ResponseContentDisposition: "inline" // Suggest viewing the file inline
    };

    try {
        const signedUrl = s3.getSignedUrl("getObject", params);
        res.status(200).json({ signedUrl });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).json({ error: "Error generating signed URL" });
    }
});

// Get all the documents, name, their passcode
app.get("/documents/:userID", (req, res) => {
    const userID = req.params.userID;

    const sql =
        "SELECT documentID, documentName, lockPasscode FROM Documents WHERE userID = ?";
    connection.query(sql, [userID], (err, results) => {
        if (err) {
            console.error("Error fetching documents:", err);
            return res.status(500).json({ error: "Error fetching documents" });
        }

        results.forEach((document) => {
            console.log(`Fetched Document: ${document.documentID} : ${document.documentName}`);
        });

        res.status(200).json({ documents: results });
    });
});

// Endpoint to fetch all images/PDF for a specific document
app.get("/documents/:userID/:documentID", (req, res) => {
    const { userID, documentID } = req.params;

    // Query to get all images for the specified document
    const sql = `
        SELECT imageURL
        FROM Images
        WHERE documentID = ? AND documentID IN (
            SELECT documentID FROM Documents WHERE userID = ?
        )
    `;

    connection.query(sql, [documentID, userID], (err, results) => {
        if (err) {
            console.error("Error fetching images for the document:", err);
            return res
                .status(500)
                .json({ error: "Error fetching document images" });
        }

        if (results.length > 0) {
            const imageURLs = results.map((row) => row.imageURL);

            // Loop through the fetched images and print each image URL
            results.forEach((image) => {
                console.log(`Fetched Image URL: ${image.imageURL}`);
            });

            res.status(200).json({ images: imageURLs });
        } else {
            res.status(404).json({
                error: "No images found for this document",
            });
        }
    });
});

// Endpoint to delete a document and all its related images from the S3 bucket and SQL database
app.delete("/documents/:userID/:documentID", async (req, res) => {
    const { userID, documentID } = req.params;

    try {
        // Step 1: Retrieve all image IDs associated with the document
        const selectImagesSql = "SELECT imageID FROM Images WHERE documentID = ?";
        const [imageResults] = await new Promise((resolve, reject) => {
            connection.query(selectImagesSql, [documentID], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });

        // Step 2: Delete images from the S3 bucket
        const deleteImagePromises = imageResults.map((image) => {
            const imageID = image.imageID;
            const s3Key = `users/${userID}/documents/${documentID}/${imageID}-image1.jpg`; // Construct the correct S3 path

            const params = {
                Bucket: s3_bucket,
                Key: s3Key,
            };
            return s3.deleteObject(params).promise();
        });

        // Wait for all image deletions to complete
        await Promise.all(deleteImagePromises);

        // Step 3: Delete the image records from the database
        const deleteImagesSql = "DELETE FROM Images WHERE documentID = ?";
        await new Promise((resolve, reject) => {
            connection.query(deleteImagesSql, [documentID], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Step 4: Delete the document record from the database
        const deleteDocumentSql = "DELETE FROM Documents WHERE documentID = ? AND userID = ?";
        const deleteDocumentResult = await new Promise((resolve, reject) => {
            connection.query(deleteDocumentSql, [documentID, userID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (deleteDocumentResult.affectedRows > 0) {
            console.log(`Deleted Document: ${documentID}`);
            res.status(200).json({ success: true });
        } else {
            console.log("Document not found");
            res.status(404).json({ error: "Document not found" });
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint to delete a document and all related files (images and PDFs)
app.delete("/documents/:userID/:documentID", async (req, res) => {
    const { userID, documentID } = req.params;

    try {
        // Fetch all related files (images and PDFs)
        const selectFilesSql = "SELECT imageID, imageURL, fileType FROM Images WHERE documentID = ?";
        const [fileResults] = await new Promise((resolve, reject) => {
            connection.query(selectFilesSql, [documentID], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });

        // Delete files from S3
        const deleteFilePromises = fileResults.map((file) => {
            const s3Key = `users/${userID}/documents/${documentID}/${file.imageID}.${file.fileType === 'pdf' ? 'pdf' : 'jpg'}`;

            const params = {
                Bucket: s3_bucket,
                Key: s3Key,
            };
            return s3.deleteObject(params).promise();
        });

        // Wait for all deletions to complete
        await Promise.all(deleteFilePromises);

        // Delete the file records from the database
        const deleteFilesSql = "DELETE FROM Images WHERE documentID = ?";
        await new Promise((resolve, reject) => {
            connection.query(deleteFilesSql, [documentID], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Delete the document record from the database
        const deleteDocumentSql = "DELETE FROM Documents WHERE documentID = ? AND userID = ?";
        const deleteDocumentResult = await new Promise((resolve, reject) => {
            connection.query(deleteDocumentSql, [documentID, userID], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (deleteDocumentResult.affectedRows > 0) {
            console.log(`Deleted Document: ${documentID}`);
            res.status(200).json({ success: true });
        } else {
            console.log("Document not found");
            res.status(404).json({ error: "Document not found" });
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal server error" });
    }
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

// Configure Multer for handling single file upload (profile picture)
const uploadSingle = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
}).single("image");

// Handle image upload
app.post(
    "/upload-profile-picture",
    uploadSingle,
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



// ==============================================================================
// CALENDAR
// ==============================================================================

// Endpoint to get all events for a specific user
app.get("/events/:userID", async (req, res) => {
    console.log("/events/:userID endpoint reached");
    const userID = req.params.userID;
    console.log("Received userID:", userID);

    const sql = "SELECT * FROM Events WHERE userID = ?";

    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(sql, [userID], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        console.log("Query Results:", results);

        if (results.length > 0) {
            res.status(200).json({ events: results });
            console.log("Returning events data for userID:", userID);
        } else {
            res.status(404).json({ error: "No events found for this user" });
            console.log("No events found for userID:", userID);
        }
    } catch (error) {
        console.error("Error fetching events:", error.message);
        res.status(500).json({ error: "Error fetching events" });
    }
});



// Endpoint to mark an event as complete
app.put("/events/:eventID", async (req, res) => {
    console.log("/events/:eventID endpoint reached");
    const { eventID } = req.params;
    const { completed } = req.body;

    const sql = "UPDATE Events SET completed = ? WHERE eventID = ?";

    try {
        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [completed ? 1 : 0, eventID], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Event marked as complete." });
        } else {
            res.status(404).json({ error: "Event not found." });
        }
    } catch (error) {
        console.error("Error marking event as complete:", error.message);
        res.status(500).json({ error: "Error marking event as complete." });
    }
});
