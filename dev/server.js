const express = require('express');
const path = require('path');
const Voter = require('./common/models/voters/voter'); 
const sendDataToSheet = require('./gsheets');
const sendDataToMeta = require('./meta')

const app = express(); // Initialize Express FIRST

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;


// Serve static files (HTML, CSS, JS)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Find voter in the database
app.post("/find-voter", async (req, res) => {
    const { first_name, last_name, dob, email, phone_no, address, residence_zip} = req.body;
    
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

        console.log("Sending data to GSheet and Meta in parallel...");

        // Run both async functions in parallel for better performance
        await Promise.all([
            sendDataToSheet(req.body, is_reg), 
            sendDataToMeta(req.body)
        ]);       
            
        is_reg ? res.sendFile(path.join(__dirname, "./public/registered.html")) 
        : res.sendFile(path.join(__dirname, "./public/not_registered.html")) 

    } catch (error) {
        console.error("Error finding voter:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Start server and listen on 0.0.0.0 (all network interfaces)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on PORT: ${PORT}`);
});
