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
            console.error("Error checking email:", err.message);
            return res.status(500).json({
                status: "error",
                message: "An error occurred while checking the email. Please try again later.",
                error: err.message
            });
        }

        if (results.length > 0) {
            // Email is already taken
            console.log(`Email ${email} is already taken`);
            return res.json({
                status: "success",
                taken: true,
                message: `The email address ${email} is already in use.`
            });
        } else {
            // Email is available
            console.log(`Email ${email} is available`);
            return res.json({
                status: "success",
                taken: false,
                message: `The email address ${email} is available.`
            });
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

// Endpoint to change password of a registered user
app.post("/change-password", async (req, res) => {
    console.log("/change-password endpoint reached");
    const { email, password } = req.body; // Get the email and new password from the request body

    // Check if the email and password were provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`Hashed password for ${email}:`, hashedPassword);

        // Update the user's password in the database
        const sql = "UPDATE Users SET password = ? WHERE email = ?";
        connection.query(sql, [hashedPassword, email], (err, result) => {
            if (err) {
                console.log(`Error encountered during password change for ${email}: ${err.message}`);
                return res.status(500).json({ error: err.message });
            }

            // Check if any rows were affected (i.e., if the email exists)
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "User not found with this email." });
            }

            console.log(`Password changed successfully for ${email}`);
            res.status(200).json({ success: true, message: "Password changed successfully." });
        });
    } catch (error) {
        console.log(`Error caught during password change: ${error.message}`);
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

    const email = req.params.email;
    const currentTime = new Date();

    // Check the last resend time from the database
    const checkTimeSql = "SELECT lastResendTime FROM Users WHERE email = ?";
    connection.query(checkTimeSql, [email], (err, results) => {
        if (err) {
            console.error(`Error checking last resend time for ${email}:`, err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            console.log(`User with email ${email} not found`);
            return res.status(404).json({ error: `User with email ${email} not found` });
        }

        const lastResendTime = results[0].lastResendTime ? new Date(results[0].lastResendTime) : null;

        // Check if 2 minutes have passed since the last resend
        if (lastResendTime && (currentTime - lastResendTime) < 120000) { // 120000 ms = 2 minutes
            const waitTime = Math.ceil((120000 - (currentTime - lastResendTime)) / 1000);
            console.log(`Cannot resend code. ${waitTime} seconds remaining before another code can be sent.`);
            return res.status(429).json({ error: `Please wait ${waitTime} seconds before resending the code.` });
        }

        // Generate a new verification code and update database
        const newVerificationCode = Math.floor(1000 + Math.random() * 9000);
        console.log(`Generated new verification code: ${newVerificationCode}`);

        const updateSql = "UPDATE Users SET verificationCode = ?, verificationAttempts = 0, lastResendTime = ? WHERE email = ?";
        connection.query(updateSql, [newVerificationCode, currentTime, email], async (err, results) => {
            if (err) {
                console.error(`Error updating verification code for ${email}:`, err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.affectedRows === 0) {
                console.log(`User with email ${email} not found`);
                return res.status(404).json({ error: `User with email ${email} not found` });
            }

            console.log(`Verification code updated for ${email}:`, newVerificationCode);

            // Send the new verification code via email
            try {
                console.log(`Sending new verification code to ${email}...`);
                const emailResponse = await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: 'meschum2@asu.edu',
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
});



// Endpoint to verify if the user's entered code matches the one in the database
app.post("/check-verification-code", (req, res) => {
    console.log("/check-verification-code endpoint reached");

    const { email, userVerificationCode } = req.body;

    // Query to get stored verification code and attempts
    const sql = "SELECT verificationCode, verificationAttempts FROM Users WHERE email = ?";
    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Error retrieving verification code from the database:", err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            console.log("User not found with the provided email");
            return res.status(404).json({ error: "User not found" });
        }

        const { verificationCode: storedVerificationCode, verificationAttempts } = results[0];
        console.log(`Code verification attempt ${verificationAttempts}: ${storedVerificationCode}`);

        // Check if attempts have reached the maximum limit
        if (verificationAttempts >= 5) {
            console.log("Max verification attempts reached for this user");
            return res.status(429).json({ error: "Max verification attempts reached. Please resend the code." });
        }

        if (parseInt(userVerificationCode, 10) === parseInt(storedVerificationCode, 10)) {
            console.log("Verification code matched successfully");

            // Reset attempts and lastResendTime after a successful verification
            const resetSql = "UPDATE Users SET verificationAttempts = 0, lastResendTime = NULL WHERE email = ?";
            connection.query(resetSql, [email], (err) => {
                if (err) {
                    console.error("Error resetting verification attempts and lastResendTime:", err.message);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(200).json({ message: "Verification successful!" });
            });
        } else {
            console.log(`Verification code ${userVerificationCode} did not match.`);

            // Increment verificationAttempts on incorrect code
            const incrementAttemptsSql = "UPDATE Users SET verificationAttempts = verificationAttempts + 1 WHERE email = ?";
            connection.query(incrementAttemptsSql, [email]);

            return res.status(400).json({ error: "Invalid verification code" });
        }
    });
});


// ==============================================================================
// Documents page
// ==============================================================================
// Endpoint to send request to create a new document with the current name
app.post("/new-document", async (req, res) => {
    console.log("new-document creation endpoint reached");
    const { userID, documentName, lockPasscode } = req.body;

        if (!documentName || !userID) {
            return res.status(400).json({ error: "Missing required fields" });
        }

    try {
        // Generate a unique documentID
        const documentID = generateRandomID(10);

        // Insert the document into the Documents table
        const insertDocumentSql = `INSERT INTO Documents (documentID, documentName, userID, lockPasscode) VALUES (?, ?, ?, ?)`;
        connection.query(insertDocumentSql, [documentID, documentName, userID, lockPasscode], (err) => {
            if (err) {
                console.error("Error inserting document:", err);
                return res.status(500).json({ error: "Error inserting document" });
            }
            console.log(`Created Document entry: ${documentID} : ${documentName}`);
            res.status(200).json({ success: true, documentID });
        });
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint to store new images or PDF
app.post("/upload-files", upload, async (req, res) => {
    console.log("upload-files endpoint reached");
    const { documentID, userID } = req.body;

    if (!documentID || !userID) {
        return res.status(400).json({ error: "Missing documentID or userID" });
    }

    try {
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

        // Handle image uploads if provided
        if (req.files.images && req.files.images.length > 0) {
            const imageUploadPromises = req.files.images.map((file) => {
                const imageID = generateRandomID(10); // Generate unique imageID
                const filePath = `users/${userID}/documents/${documentID}/${imageID}.jpg`;

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
                console.log(`Uploaded files for Document: ${documentID}`);
                res.status(200).json({ success: true });
            })
            .catch((error) => {
                console.error("Error uploading files:", error);
                res.status(500).json({ error: "Error uploading files" });
            });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Endpoint to update the document name
app.put("/documents/:userID/:documentID", (req, res) => {
    console.log("documents/:userID/:documentID endpoint reached");
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
    console.log("documents/:userID/:documentID/signed-url endpoint reached");
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
    console.log("document-userID endpoint reached");
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

// Reset the passcode for a document
app.post("/document-passcode-reset", async (req, res) => {
    console.log("document-passcode-reset endpoint reached");
    const { documentID, passcode } = req.body;

    // Verify both documentID and passcode are provided
    if (!documentID || !passcode) {
        return res.status(400).json({ error: "Document ID and passcode are required." });
    }

    try {
        //// Hash the new passcode
        //const hashedPasscode = await bcrypt.hash(passcode, 10);

        // Update the document's passcode in the database using the correct column name 'lockPasscode'
        const sql = "UPDATE Documents SET lockPasscode = ? WHERE documentID = ?";
        connection.query(sql, [passcode, documentID], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Document not found." });
            }

            return res.status(200).json({ success: true });
        });
    } catch (error) {
        console.error("Error hashing passcode:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

    // Endpoint to fetch all images for a specific document
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

// Endpoint to create a new event
app.post("/events", async (req, res) => {
    console.log("/events POST endpoint reached");
    const {
        eventName,
        color,
        isPublic,
        viewableBy,
        notes,
        streakDays,
        reminder,
        startTime,
        endTime,
        allDay,
        eventType,
        calendarID,
        userID,
        completed,
    } = req.body;

    // Check to ensure required fields are filled
    if (!eventName || !startTime || !userID) {
        return res.status(400).json({ error: "Missing required event data" });
    }

    const sql = `
        INSERT INTO Events 
        (eventName, color, isPublic, viewableBy, notes, streakDays, reminder, startTime, endTime, allDay, eventType, calendarID, userID, completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const result = await new Promise((resolve, reject) => {
            connection.query(
                sql,
                [
                    eventName,
                    color || null,
                    isPublic ? 1 : 0,  // boolean
                    viewableBy || null,
                    notes || null,
                    streakDays || null,
                    reminder || null,
                    startTime,
                    endTime || null,
                    allDay ? 1 : 0,  // boolean
                    eventType || null,
                    calendarID || null,
                    userID,
                    completed ? 1 : 0  // boolean
                ],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        if (result.affectedRows > 0) {
            res.status(201).json({ message: "Event created successfully", eventID: result.insertId });
        } else {
            res.status(500).json({ error: "Failed to create event" });
        }
    } catch (error) {
        console.error("Error creating event:", error.message);
        res.status(500).json({ error: "Error creating event" });
    }
});