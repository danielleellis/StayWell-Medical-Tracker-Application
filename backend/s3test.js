const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config(); // Load your environment variables

// S3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Upload image function (refactored from your existing code)
const uploadImage = (filePath, fileKey) => {
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: process.env.S3_BUCKET, // Your bucket name
        Key: fileKey, // File name in S3
        Body: fileContent,
        ContentType: "image/jpeg", // Adjust content type as needed
    };

    return s3.upload(params).promise();
};

// Test function
const testS3Upload = async () => {
    try {
        const filePath = "logo-test.png"; // Specify your local image path
        const fileKey = "users/test-upload.jpg"; // S3 file key
        const result = await uploadImage(filePath, fileKey);
        console.log("Image uploaded successfully to S3:", result.Location);
    } catch (error) {
        console.error("Error uploading image to S3:", error);
    }
};

// Run the test
testS3Upload();
