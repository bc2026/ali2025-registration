const express = require('express');
const path = require('path');
const Voter = require('./common/models/voters/voter'); 
const sendDataToSheet = require('./gsheets');

const app = express(); // Initialize Express FIRST

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Find voter in the database
app.post("/find-voter", async (req, res) => {
    const { first_name, last_name, dob } = req.body;
    
    const parsedData = {
        first_name: first_name?.toLowerCase(),
        last_name: last_name?.toLowerCase(),
        dob // Keep dob unchanged unless you need to format it
      };
    try {
        const voter = await Voter.findOne({
            where: { first_name: parsedData.first_name, last_name: parsedData.last_name, dob: parsedData.dob }
        });

        sendDataToSheet(req.body); // Log data to Google Sheets

        const is_reg = voter !== null;

        if(is_reg)
        {
            res.sendFile("./public/registered.html")
        }

        else
        {
            res.sendFile("./public/not_registered.html")
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
