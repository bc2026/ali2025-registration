const express = require('express');
const path = require('path');
const Voter = require('./common/models/voters/voter'); 
const sendDataToSheet = require('./gsheets');
const axios = require('axios'); // For sending requests to Meta
const crypto = require("crypto");

const app = express(); // Initialize Express FIRST

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
// Meta Pixel (Conversions API) Credentials
const META_PIXEL_ID = "312046999514384";  // Replace with your actual Pixel ID
const META_ACCESS_TOKEN = "EAAHfWfXi0PYBO8nbai3RJte5mqK8uQOnvwAa9hYjOSAsz4cfjOuSUx0bnOxDDzteCvl3xAPxov9MEm7qIoAFJdfVZALI1aKcdcEeScDAtQx7FX6WBwYNovYhT8fIEvoBn3rAK6gTTalQCsKIPZBCg3q11eMftVJmIMulqgpdQL8Y0BH46HfgcLZCzAK7fGguZBHVgwBN7ZBLKMmNUNzdWiZCMyOZAAZBYv0ZBFIvyuk4wTQZDZD";  // Replace with your actual Access Token
const META_API_URL = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`;


// Function to hash data using SHA-256
function hashData(data) {
    return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex");
}

// Serve static files (HTML, CSS, JS)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Find voter in the database
app.post("/find-voter", async (req, res) => {
    const { first_name, last_name, dob, email, phone_no, address } = req.body;
    
    const parsedData = {
        first_name: first_name?.toLowerCase().replace(/\s/g, ""),
        last_name: last_name?.toLowerCase().replace(/\s/g, ""),
        dob // Keep dob unchanged unless you need to format it
      };
    try {
        const voter = await Voter.findOne({
            where: { first_name: parsedData.first_name, last_name: parsedData.last_name, dob: parsedData.dob }
        });

        
        const is_reg = voter !== null;

        await axios.post(META_API_URL, {
            data: [
                {
                    event_name: "submit_form",
                    event_time: Math.floor(Date.now() / 1000),
                    event_source_url: "http://jcvotes.eastus2.cloudapp.azure.com:3000/find-voter",
                    action_source: "website",
                    user_data: {
                        em: email ? hashData(email) : undefined, // Hashing is required
                        ph: phone_no ? hashData(phone_no) : undefined,
                        fn: first_name ? hashData(first_name) : undefined,
                        ln: last_name ? hashData(last_name) : undefined,
                        address: address ? hashData(address) : undefined
                    }
                }
            ],
            access_token: META_ACCESS_TOKEN
        });
        
        sendDataToSheet(req.body, is_reg); // Log data to Google Sheets

        if(is_reg)
        {
            res.sendFile(path.join(__dirname, "./public/registered.html"))
        }

        else
        {
            res.sendFile(path.join(__dirname, "./public/not_registered.html"))
        }

    } catch (error) {
        console.error("Error finding voter:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// // Health check endpoint
// app.get("/status", (req, res) => {
//     res.json({ Status: "Running" });
// });

// Start server and listen on 0.0.0.0 (all network interfaces)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on PORT: ${PORT}`);
});
